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
  cloneWithMergedRef,
  clone,
  flatMapPreserveKey,
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
  rect?: Pick<DOMRect, "x" | "y" | "width" | "height">,
  cssAnimationTimes: AnimationTime[],
  order: number
}

//╭─────────────────────────────────────────────────╮
//│ # Main                                          │
//╰─────────────────────────────────────────────────╯
export function AnimateChildren(
  { children, ...props }: {
    children?: ReactNode
    easing?: KeyframeAnimationOptions["easing"]
    duration?: number
    normalizeKeys?: boolean
    delayDeletion?: number
    useAbsolutePositionOnDelete?: boolean
    stagger?: number
    strategy?: "interrupt" | "continuous" | "reset"
    disableAnimationReconciliation?: boolean
    disableScaleAnimation?: boolean
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
    order: 0
  }))

  function saveChildRectAndAnimation(entry: SavedChildData, reconcileAnimation?: boolean) {
    const node = entry.ref.current
    if (!node) return

    if (opts.strategy === "interrupt" && parent.rect) {
      const rect = node.getBoundingClientRect()
      entry.rect = {
        x: rect.x - parent.rect.x,
        y: rect.y - parent.rect.y,
        width: rect.width,
        height: rect.height,
      }
    } else {
      entry.rect = {
        x: node.offsetLeft,
        y: node.offsetTop,
        width: node.offsetWidth,
        height: node.offsetHeight,
      }
    }

    if (opts.disableAnimationReconciliation || reconcileAnimation === false)
      return
    entry.cssAnimationTimes = node.getAnimations()
      .filter(isCSSAnimation)
      .map(a => a.currentTime)
    // Only save CSSAnimation times because CSSTransition can't be persisted
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
        if (!isValidElement(child) || isPortal(child)) return child
        // Skips processing invalid elements or portals but left as-is in the children
        //   Invalid elements doesn't have keys therefore it wont be animated since it can't be tracked
        //   Even if they have keys, portal can't be animated since its not a valid animatable element

        const key = child.key ?? `____${ keylessCount++ }`
        keys.add(key)                               // Check for duplicate keys

        const [entry, isNew] = data.getOrAdd(key)

        if (entry.deleting)
          delete entry.deleting                     // Clear existing timeout to prevent existing timeout to trigger deletion

        const modifiedProp: Record<string, any> = { key }

        if (isNew) {
          // modifiedProp["data-adding"] = ''          
          entry.adding = true
        }

        const el = clone(child, {
          ref: mergeRef<AnimatableElement>(child.props.ref, (node) => {
            entry.ref.current = node
            if (isNew && node) node.dataset.adding = ''  // This will be deleted later after layout paint to trigger CSS transition via attribute change
            return () => { entry.ref.current = null }
          }),
          key,
          ...modifiedProp
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
            top: node.offsetTop, // Todo: try with rect.y/x
            left: node.offsetLeft,
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

    console.log("useLayoutEffect")

    // console.time("getting animation queue")
    // Animations are collected in a queue because we need useLayoutEffect to run as fast as possible.
    // We can run the animation here but it would cause a lot of lag.
    // Therefore, animations are run in the next frame using requestAnimationFrame.
    const animationQueue = new AnimationQueue()

    const deletingKeys: string[] = []

    // This is to apply staggered animation by apply longer delay multipled by the count
    // Problem: delay is re-added when animations are stacked
    // Solution: check first if there are existing animation

    rendered.forEach(
      child => {
        // Same as before, we can only animate valid elements with ref.
        if (!isValidRenderedChild(child)) return

        // We can't get the ref from child.props.ref because their ref might be a callback ref.
        const entry = data.get(child.key)
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

        let hasPrevAnimation = false                  // To prevent adding extra delay for staggered animation.

        // Reconcile the css animation times of the current node
        //   We assumed that the css animation times are in the same order before and after setRendered. (before and after reflow)
        //   NB: Major Performance Hit
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
                  a.currentTime = delay
                }
                hasPrevAnimation = true
              }

              if (isCSSAnimation(a))
                return true
            })
            .forEach(
              (a, i) => a.currentTime = entry.cssAnimationTimes[i]
            )
        }

        let prev = entry.rect
        if (!prev) return                       // Can't animate if rect is not saved
        if (opts.duration === 0) return         // Can't animate if duration is 0

        let curr: SavedChildData['rect']

        if (opts.strategy === "interrupt" && parent.rect) {
          const rect = node.getBoundingClientRect()
          curr = {
            x: rect.x - parent.rect.x,
            y: rect.y - parent.rect.y,
            width: rect.width,
            height: rect.height,
          }
        } else {
          curr = {
            x: node.offsetLeft,
            y: node.offsetTop,
            width: node.offsetWidth,
            height: node.offsetHeight,
          }
        }

        const deltaY = prev.y - curr.y
        const deltaX = prev.x - curr.x
        const deltaWidth = prev.width - curr.width
        const deltaHeight = prev.height - curr.height

        if (!deltaY && !deltaX) return

        const delay = !hasPrevAnimation       // If there is no previous animation, add delay
          ? entry.order * opts.stagger
          : 0

        animationQueue.add({
          node,
          keyframes: [
            opts.disableScaleAnimation
              ? {
                translate: `${ deltaX }px ${ deltaY }px`,
              }
              : {
                translate: `${ deltaX + (deltaWidth / 2) }px ${ deltaY + (deltaHeight / 2) }px`,
                scale: `${ prev.width / curr.width } ${ prev.height / curr.height }`,
              },
            opts.disableScaleAnimation
              ? {
                translate: `0px 0px`,
              } : {
                translate: `0px 0px`,
                scale: `1 1`,
              }
          ],
          options: {
            duration: opts.duration,
            easing: opts.easing,
            delay: delay,
            fill: "both",
            composite: opts.strategy === "reset" ? "replace" : "add",
            id: `__react-flip-children-move-animation+delay=${ delay }`
          },
          cancelOnFinish: true
        })
      }
    )

    //╭───────────────────╮
    //│ Parent Animation  │
    //╰───────────────────╯
    if (!opts.disableParentAnimation) {
      const parentAnimation = parent.queueAnimation(opts)
      if (parentAnimation) animationQueue.add(parentAnimation)
    }

    requestAnimationFrame(() => {
      animationQueue.animate()
      // Animate all the animations in the queue. This includes elements that had moved and parent if they had moved.

      data.forEach(entry => {
        if (entry.deleting && entry.ref.current) {
          entry.ref.current.dataset.deleting = '' // Remove the "data-adding" attribute to trigger CSS transition
        }
      })

      const keys = deletingKeys
      requestAnimationFrame(() => {
        data.forEach(
          entry => {
            if (entry.adding && entry.ref.current) {
              delete entry.ref.current.dataset.adding
              delete entry.adding
            }
          }
        )
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
        cancelOnFinish: true
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
  cancelOnFinish: boolean
}

class AnimationQueue {
  queue: AnimationItem[] = []
  add(animation: AnimationItem) {
    this.queue.push(animation)
  }
  animate() {
    this.queue.forEach(({ node, keyframes, options, cancelOnFinish }) => {
      const anim = node.animate(keyframes, options)
      if (cancelOnFinish) {
        anim.onfinish = () => anim.cancel()
      }
    })
  }
}