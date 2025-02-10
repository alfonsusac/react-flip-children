"use client"

import {
  createRef,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
  type Ref,
  type RefObject
} from "react"
import {
  isPortal,
  clone,
  type AnimationTime,
} from "./helper"
import { useRefMap } from "./useRefMap"
import { flatMap } from "./flatMap"
import { mergeRef } from "./ref"

//╭─────────────────────────────────────────────────╮
//│ Types                                           │
//╰─────────────────────────────────────────────────╯
type AnimatableElement =
  | Pick<HTMLElement,
    | "animate"
    | "getBoundingClientRect"
    | "getAnimations"
    | "dataset"
    | "style"
    | "parentElement"
    | "offsetTop"
    | "offsetLeft"
    | "offsetWidth"
    | "offsetHeight">

type ProcessedReactElement =
  | ReactElement<{ ref: Ref<AnimatableElement> }> & { key: string }

type ValidNode =
  | string
  | number
  | bigint
  | ReactPortal
  | ProcessedReactElement

type SavedChildData = {
  ref: RefObject<AnimatableElement | null>,
  tobedeleted?: boolean,
  deleting?: boolean,
  adding?: boolean,
  rect?: { x: number, y: number },
  size?: { width: number, height: number }
  cssAnimationTimes: AnimationTime[],                     // For animation reconciliation
  order: number,                                          // For staggered animation
}

//╭─────────────────────────────────────────────────╮
//│ # Main                                          │
//╰─────────────────────────────────────────────────╯
export function AnimateChildren(
  { children, ...props }: {
    /**
     * The children to animate. This can be any valid ReactNode, 
     * but only valid children will be animated. Others may be rendered 
     * but not animated, or omitted entirely.
     * 
     * [See Docs](https://react-flip-children.alfon.dev/docs#props-children)
     */
    children?: ReactNode

    /** The easing of the moving animation. */
    easing?: KeyframeAnimationOptions["easing"]

    /** The duration of the moving animation in milliseconds. */
    duration?: number

    /**
     * Whether or not to normalize keys. If set to true, the component 
     * will flatten the children array and check for uniquely defined keys. 
     * If set to false (default), the component allows for duplicate keys 
     * if its under different fragment.
     * 
     * [See Docs](https://react-flip-children.alfon.dev/docs#props-normalizeKeys)
     */
    normalizeKeys?: boolean

    /** The delay before the deletion of the child. This is useful when you want 
     * to animate the child before it is removed from the DOM. */
    delayDeletion?: number

    /** Whether or not to use absolute position on deleted elements. If set to true,
     * the component will use absolute position to animate the deleted child. 
     * 
     * **Recommended**: Set to true if the width of the child is fixed.*/
    useAbsolutePositionOnDelete?: boolean

    /** The stagger of the moving animation in milliseconds. The animation delay will 
     * be skipped if the animation is interrupted. */
    stagger?: number

    /** The strategy to use when taking a snapshot of the child's position. The 
     * default is `"continuous"`, which uses the `offsetLeft` and `offsetTop` property 
     * of the child. If set to `"interrupt"`, the component will use the 
     * `getBoundingClientRect` method to take a snapshot of the child's position. */
    strategy?: "interrupt" | "continuous" | "reset"

    /** Whether or not to disable animation reconciliation. If set to true, the 
     * component will not reconcile CSS animations.
     * 
     * **Recommended**: Set to false if animating a large number of children.*/
    disableAnimationReconciliation?: boolean

    /** Whether or not to disable scale animation. If set to true, the component 
     * will not scale the child during animating the reorder. */
    disableScaleAnimation?: boolean

    /** Whether or not to disable parent animation. If set to true, the component
     *  will not animate the parent. */
    disableParentAnimation?: boolean
  }
) {
  const opts = {
    easing: "ease-in-out",
    duration: 500,
    normalizeKeys: false,
    delayDeletion: 500,
    useAbsolutePositionOnDelete: false,
    stagger: 0,
    strategy: "continuous",
    disableAnimationReconciliation: false,
    disableScaleAnimation: false,
    disableParentAnimation: false,
    ...props
  }

  const [rendered, setRendered] = useState<ValidNode[]>([])
  const data = useRefMap<SavedChildData>(() => ({
    ref: createRef(),
    cssAnimationTimes: [],
    order: 0,
    // This is to apply staggered animation by apply longer delay multipled by the count
    // Problem: delay is re-added when animations are stacked
    // Solution: check first if there are existing animation
  }))

  function saveChildRectAndAnimation(entry: SavedChildData, reconcileAnimation?: boolean) {
    const node = entry.ref.current
    if (!node) return

    if (opts.strategy === "interrupt" && parent.rect) {
      const rect = node.getBoundingClientRect()
      entry.rect = {
        x: rect.x - parent.rect.x,
        y: rect.y - parent.rect.y,
      }
      entry.size = rect
    } else {
      entry.rect = {
        x: node.offsetLeft,
        y: node.offsetTop,
      }
      if (!opts.disableScaleAnimation) {
        entry.size = {
          width: node.offsetWidth,
          height: node.offsetHeight,
        }
      }
    }

    if (opts.disableAnimationReconciliation || reconcileAnimation === false)
      return
    entry.cssAnimationTimes = node.getAnimations()
      .filter(isCSSAnimation)                                     // Only save CSSAnimation times because CSSTransition can't be persisted
      .map(a => a.currentTime)

  }

  const parent = useParent()

  useEffect(() => { // On incoming children change
    const keys = new Set<string>()
    let keylessCount = 0
    // Track keys to prevent duplicates

    // Flat iterate through every children to process incoming new elements
    const newRender = flatMap<ValidNode>(
      children,
      child => {
        if (
          !isValidElement(child) || isPortal(child)
        ) return child
        // Skips processing invalid elements or portals but left as-is in the children
        //   Invalid elements doesn't have keys therefore it wont be animated since it can't be tracked
        //   Even if they have keys, portal can't be animated since its not a valid animatable element

        const key = child.key ?? `____${ keylessCount++ }`
        keys.add(key)                               // Check for duplicate keys

        const [entry, isNew] = data.getOrAdd(key)
        if (entry.deleting)
          delete entry.deleting                     // Clear existing timeout to prevent existing timeout to trigger deletion

        if (isNew)
          entry.adding = true

        const el = clone(child, {
          ref: mergeRef<AnimatableElement>(
            child.props.ref,
            (node) => {
              entry.ref.current = node
              if (isNew && node) node.dataset.adding = ''  // This will be deleted later after layout paint to trigger CSS transition via attribute change
              return () => { entry.ref.current = null }
            }),
          key,
        })
        return el
      },
      opts.normalizeKeys
    )

    let staggerElementCount = 0                     // For stagger: To save the order of the elements in previous order before changed to new order
    let tempParent: AnimatableElement | undefined   // For parent: Temporarily store parent in this cycle to save the parent node and rect only once
    const deletingKeys: string[] = []               // For deletion: To store keys that are not in the new render for delete animation using one setTimeout

    // Iterate through rendered children to mark deleted elements
    rendered.forEach(
      (child, index) => {
        if (!isValidRenderedChild(child)) return
        // Ivalid nodes are filtered here because we can't animate key-less elements.

        const entry = data.get(child.key)
        if (!entry?.ref.current) return
        const node = entry.ref.current

        tempParent ??= parent.saveNodeAndRect(node.parentElement)   // Cache parent node
        saveChildRectAndAnimation(entry)                            // Save the rect data and css animationTimes of the current node

        // ↓ This part below is for deletion animation.
        if (!opts.delayDeletion)
          return                                                    // If deletion is instant, skip exit animations

        if (keys.has(child.key)) {
          entry.order = staggerElementCount++
          return                                                    // Filter for deleted keys
        }
        const props: Record<string, any> = {}
        if (opts.useAbsolutePositionOnDelete) {
          props.style = {
            position: 'absolute',
            top: entry.rect?.y ?? node.offsetTop,
            left: entry.rect?.x ?? node.offsetLeft,
          } satisfies CSSProperties
        }
        newRender.splice(index, 0, clone(child, props))             // Re-add the deleted elements back in the children with "data-deleting" props.

        if (entry.deleting) return                                  // Schedule deletion ideally after animation completes but ONLY if existing timeout hadn't been run yet
        deletingKeys.push(child.key)
        entry.tobedeleted = true
      }
    )

    setRendered(newRender)

    // Why missing dependencies like "data", "parent", and "rendered" are ignored:
    //   "parent" is using useRef therefore its not reactive
    //   "data" is also using useRef therefore its not reative
    //   We can't depend on rendered because we need this part to not run on rendered change.
    //     We need "rendered" to be a state because we are relying on useLayoutEffect which needs a dependency to run.
    //     We need useLayoutEffect because we need to run some code before layout repaints.

  }, [children])

  // On rendered change before repaint
  useLayoutEffect(() => {

    const animationQueue = new AnimationQueue()
    // Animations are collected in a queue because we need useLayoutEffect to run as fast as possible.
    // Running the animation here would cause a lot of lag.
    // Therefore, animations are run in the next frame using requestAnimationFrame.

    const deletingKeys: string[] = []
    // For optimizing deletion: only remove attribute for deleted keys in this array.

    rendered.forEach(
      child => {
        if (!isValidRenderedChild(child)) return          // Same as before, we can only animate valid elements with ref.

        const entry = data.get(child.key)                 // We can't get the ref from child.props.ref because their ref might be a callback ref.
        if (!entry?.ref.current) return
        const node = entry.ref.current

        if (entry.tobedeleted) {
          deletingKeys.push(child.key)
          node.dataset.deleting = ''
          delete entry.tobedeleted
          entry.deleting = true
          return
        }

        if (entry.adding)
          node.dataset.adding = ''

        let hasPrevAnimation = false                     // To prevent adding extra delay for staggered animation.

        // Reconcile the css animation times of the current node
        //   We assumed that the css animation times are in the same order before and after setRendered. (before and after reflow)
        //   NB: Major Performance Hit
        // console.log(`key: ${child.key}`, entry.animations.map(a => a.currentTime))
        if (opts.stagger || !opts.disableAnimationReconciliation) {
          const animations = node.getAnimations()
          animations
            .filter((a) => {
              if (opts.strategy === "interrupt" && a.id.startsWith("__react-flip-children-move-animation")) {
                a.cancel()
                return false
              }
              if (opts.stagger && a.id.startsWith("__react-flip-children-move-animation")) {
                const delay = Number(a.id.split('+delay=')[1])
                const currentTime = Number(a.currentTime)
                if (delay > currentTime) {
                  try {
                    a.currentTime = delay
                  } catch (error) { }
                }
                hasPrevAnimation = true
              }
              if (isCSSAnimation(a))
                return true
            })
            .forEach(
              (a, i) => {
                try {
                  a.currentTime = entry.cssAnimationTimes[i]
                } catch (error) { }
              }
            )
        }

        if (opts.duration === 0) return         // Can't animate if duration is 0

        let prevRect = entry.rect
        let prevSize = entry.size

        if (!prevRect && (opts.disableScaleAnimation || !prevSize)) return                       // Can't animate if rect is not saved

        let currRect: { x: number, y: number }
        let currSize: { width: number, height: number } | undefined = undefined

        if (opts.strategy === "interrupt" && parent.rect) {
          const rect = node.getBoundingClientRect()
          currRect = {
            x: rect.x - parent.rect.x,
            y: rect.y - parent.rect.y,
          }
          currSize = {
            width: rect.width,
            height: rect.height,
          }
        } else {
          currRect = {
            x: node.offsetLeft,
            y: node.offsetTop,
          }
          if (!opts.disableScaleAnimation) {
            currSize = {
              width: node.offsetWidth,
              height: node.offsetHeight,
            }
          }
        }

        prevRect ??= currRect

        const deltaY = prevRect.y - currRect.y
        const deltaX = prevRect.x - currRect.x
        const positionChanged = !!deltaY || !!deltaX

        const widthScale = currSize && prevSize ? prevSize.width / currSize.width : 1
        const heightScale = currSize && prevSize ? prevSize.height / currSize.height : 1
        const sizeChanged = opts.disableScaleAnimation ? false : widthScale !== 1 || heightScale !== 1

        if (
          !positionChanged && !sizeChanged
        ) return

        const delay = !hasPrevAnimation       // If there is no previous animation, add delay
          ? entry.order * opts.stagger
          : 0

        animationQueue.add({
          node,
          keyframes: [
            {
              ...positionChanged && { translate: `${ deltaX }px ${ deltaY }px` },
              ...sizeChanged && { scale: `${ widthScale } ${ heightScale }` },
            },
            {
              ...positionChanged && { translate: `0px 0px` },
              ...sizeChanged && { scale: `1 1` },
            }
          ],
          options: {
            duration: opts.duration,
            easing: opts.easing,
            delay: delay,
            fill: "both",
            composite: opts.strategy === "reset"
              ? "replace"
              : "add",
            id: `__react-flip-children-move-animation+delay=${ delay }`
          },
          onRegister: (animation) => {
            animation.oncancel = () => animation.cancel()
          },
        })
      }
    )

    if (!opts.disableParentAnimation) {                     // Parent Animation
      const parentAnimation = parent.queueAnimation(opts)
      if (parentAnimation) animationQueue.add(parentAnimation)
    }

    requestAnimationFrame(() => {
      animationQueue.animate()                              // Animate all the animations in the queue. This includes elements that had moved and parent if they had moved.

      data.forEach(entry => {
        if (entry.deleting && entry.ref.current)
          entry.ref.current.dataset.deleting = ''           // Remove the "data-adding" attribute to trigger CSS transition
      })

      const keys = deletingKeys
      requestAnimationFrame(() => {
        data.forEach(entry => {
          if (entry.ref.current)
            delete entry.ref.current.dataset.adding
          if (entry.adding)
            delete entry.adding
        })
        keys.length && setTimeout(() => {
          data.forEach(e => saveChildRectAndAnimation(e))   // Cache parent node
          parent.saveRect()                                 // Save the rect data and css animationTimes of the current node

          keys.forEach(i => {
            if (!data.get(i)?.deleting) return
            setRendered(prev => filterNodeByKey(prev, i))
            data.delete(i)
          })
        }, opts.delayDeletion)
      })
    })

  }, [rendered])

  return rendered.length
    ? rendered
    : children
}



function useParent() {
  const parent = useRefObject({
    rect: undefined as undefined | DOMRect,
    node: undefined as undefined | AnimatableElement,
    saveNodeAndRect(node?: AnimatableElement | null) {
      parent.node = node ?? parent.node
      parent.saveRect()
      return parent.node
    },
    saveRect() {
      if (!parent.node) return
      parent.rect = parent.node.getBoundingClientRect()
    },
    queueAnimation(opts: {
      easing: KeyframeAnimationOptions["easing"]
      duration: number
    }) {
      if (!parent.rect || !parent.node) return
      const node = parent.node
      const prev = parent.rect
      const curr = node.getBoundingClientRect()
      const delta = {
        height: prev.height - curr.height,
        width: prev.width - curr.width,
      }
      if (delta.height === 0 && delta.width === 0) return
      return {
        node,
        keyframes: [
          { marginBlockEnd: `${ delta.height }px`, marginInlineEnd: `${ delta.width }px` } satisfies CSSProperties,
          { marginBlockEnd: `0px`, marginInlineEnd: `0px` }
        ],
        options: {
          duration: opts.duration,
          easing: opts.easing,
          composite: "add",
        },
        onRegister: (animation) => {
          animation.oncancel = () => animation.cancel()
        },
      } satisfies AnimationItem
    }
  })
  return parent
}



function useRefObject<T extends object>(defaultObj?: T) {
  const ref = useRef(defaultObj ?? {})
  return ref.current as T
}


//╭─────────────────────────────────────────────────╮
//│ Helper                                          │
//╰─────────────────────────────────────────────────╯
function isValidRenderedChild(child: ValidNode): child is ProcessedReactElement {
  // Return true if:
  // - child is a valid element
  // - child has a key
  // - child is not a portal
  return isValidElement(child)
    && child.key !== null
    && !isPortal(child)
}

const isCSSAnimation
  = (a: Animation): a is CSSAnimation => a instanceof CSSAnimation

const filterNodeByKey
  = <T>(node: T[], key: string) => node.filter(n => isValidElement(n) ? n.key !== key : true)

type AnimationItem = {
  node: AnimatableElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  onRegister?: (animation: Animation) => void
}

class AnimationQueue {
  queue: AnimationItem[] = []
  add(animation: AnimationItem) {
    this.queue.push(animation)
  }
  animate() {
    this.queue.forEach(({ node, keyframes, options, onRegister }) => {
      const anim = node.animate(keyframes, options)
      onRegister?.(anim)
    })
  }
}