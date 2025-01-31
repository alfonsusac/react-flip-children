"use client"

import { createRef, isValidElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode, type ReactPortal, type Ref, type RefObject } from "react"
import { flatMap, isPortal, type ReactElementWithKey, cloneWithMergedRef, filterNodeByKey, createProp, clone, type AnimationTime, flatMapPreserveKey } from "./helper"


//╭─────────────────────────────────────────────────╮
//│ Types                                           │
//╰─────────────────────────────────────────────────╯
type AnimatableElement = Pick<HTMLElement,
  | "animate"
  | "getBoundingClientRect"
  | "getAnimations"
  | "removeAttribute"
  | "parentElement"
  | "offsetTop"
  | "offsetLeft"
>
type ProcessedReactElement =
  | ReactElementWithKey<{ ref: Ref<AnimatableElement> }>

type ValidNode =
  | string
  | number
  | bigint
  | ReactPortal
  | ProcessedReactElement

type SavedChildData = {
  ref: RefObject<AnimatableElement | null>,
  timeout?: NodeJS.Timeout,
  rect?: Pick<DOMRect, "x" | "y">,
  cssAnimationTimes?: AnimationTime[],
  order?: number
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
    useAbsolutePositionOnDeletedElements?: boolean
    stagger?: number
    snapshotStrategy?: "getBoundingClientRect" | "offset"
  }
) {
  const opts = {
    easing: props.easing ?? "ease-out",
    duration: props.duration ?? 500,
    normalizeKeys: props.normalizeKeys ?? false,
    delayDeletion: props.delayDeletion ?? 500,
    useAbsolutePositionOnDeletedElements: props.useAbsolutePositionOnDeletedElements ?? false,
    stagger: props.stagger ?? 0,
    snapshotStrategy: props.snapshotStrategy ?? "offset"
  }



  const [rendered, setRendered] = useState<ValidNode[]>([])
  const data = useRefMap<SavedChildData>(() => ({ ref: createRef() }))

  function saveChildRectAndAnimation(entry: SavedChildData) {
    const node = entry.ref.current
    if (!node) return
    // entry.rect = node.getBoundingClientRect()

    if (opts.snapshotStrategy === "getBoundingClientRect" && parent.rect) {
      console.log("using getBoundingClientRect")
      const clientRect = node.getBoundingClientRect()
      entry.rect = {
        x: clientRect.x - parent.rect.x,
        y: clientRect.y - parent.rect.y
      }
    } else {
      console.log("using offset")
      entry.rect = {
        x: node.offsetLeft,
        y: node.offsetTop
      }
    }

    entry.cssAnimationTimes = node.getAnimations().filter(isCSSAnimation).map(a => a.currentTime)
    // Only save CSSAnimation times because CSSTransition can't be persisted
  }

  const parent = useParent()


  useEffect(() => {   // On incoming children change
    const keys = new Set<string>()
    // Track keys to prevent duplicates

    const mapFn = opts.normalizeKeys
      ? flatMapPreserveKey<ValidNode>
      : flatMap<ValidNode>

    let keylessCount = 0


    // Flat iterate through every children to process incoming new elements
    const newRender = mapFn(children,
      child => {
        if (!isValidElement(child) || isPortal(child)) return child
        // Skips processing invalid elements or portals but left as-is in the children
        //   Invalid elements doesn't have keys therefore it wont be animated since it can't be tracked
        //   Even if they have keys, portal can't be animated since its not a valid animatable element

        const key = child.key ?? `____${ keylessCount++ }`
        keys.add(key)
        // Check for duplicate keys

        const { entry, inPrev } = data.getOrAdd(key)

        //╭───────────────────╮
        //│ Delete Animation  │
        //╰───────────────────╯
        entry.ref.current?.removeAttribute("data-deleting")
        // Remove 'data-deleting' attribute if present to trigger un-delete transition
        clearTimeout(entry.timeout)
        delete entry.timeout
        // Clear existing timeout to prevent existing timeout to trigger deletion
        // ────────────────────

        const modifiedProp = createProp()
        modifiedProp['key'] = key

        //╭───────────────────╮
        //│ Add Animation     │
        //╰───────────────────╯
        if (!inPrev) modifiedProp["data-adding"] = ''
        // This will be deleted later after layout paint to trigger CSS transition via attribute change
        // ────────────────────

        return cloneWithMergedRef(child, entry.ref, modifiedProp)
      }
    )

    let existingElementCount = 0
    // For stagger: to save the order of the elements in previous order

    let tempParent: AnimatableElement | undefined
    // Temporarily store parent in this cycle to save the parent node and rect only once

    // Iterate through rendered children to mark deleted elements
    rendered.forEach(
      (child, index) => {
        if (!isValidRenderedChild(child)) return
        // Ivalid nodes are filtered here because we can't animate key-less elements.

        const entry = data.get(child.key)
        if (!entry?.ref.current) return
        const node = entry.ref.current

        //╭───────────────────╮
        //│ Parent Animation  │
        //╰───────────────────╯
        tempParent ??= (() => {
          const newParent = node.parentElement ?? parent.node
          if (newParent) {
            parent.saveNode(newParent)
            parent.saveRect()
          }
          return newParent
        })()
        // Cache parent node

        saveChildRectAndAnimation(entry)
        // Save the rect data and css animationTimes of the current node

        //╭───────────────────╮
        //│ Delete Animation  │ This part below is for deletion animation.
        //╰───────────────────╯
        if (opts.delayDeletion === 0) return
        // If delayDeletion is 0, we don't need to animate deletion.  We can delete it immediately.

        if (keys.has(child.key)) {
          entry.order = existingElementCount++
          return
        }
        // Filter only the deleted keys

        const props = createProp()
        props["data-deleting"] = ""

        if (opts.useAbsolutePositionOnDeletedElements) {
          props.style = {
            position: 'absolute',
            top: node.offsetTop,
            left: node.offsetLeft,
          } as CSSProperties
        }

        newRender.splice(index, 0, clone(child, props))
        // Re-add the deleted elements back in the children with "data-deleting" props.

        if (entry.timeout) return
        // Schedule deletion ideally after animation completes but ONLY if existing timeout hadn't been run yet

        entry.timeout = setTimeout(() => {
          if (!entry.timeout) return
          // If timeout is already cleared, do not proceed with deletion. This will fuck up the stability of the elements.

          // Save the rect and animation and everything else again here.
          data.forEach(saveChildRectAndAnimation)
          parent.saveRect()

          setRendered(prev => filterNodeByKey(prev, child.key))
          // Trigger re-render so that useLayoutEffect can run again

          data.delete(child.key)
          // Delete the entry

        }, opts.delayDeletion)
        // ────────────────────

      }
    )

    setRendered(newRender)



    // Why missing dependencies like "data", "parent", and "rendered" are ignored:
    //   "parent" is using useRef therefore its not reactive
    //   "data" is also using useRef therefore its not reative
    //   We can't depend on rendered because we need this part to not run on rendered change.
    //     We need "rendered" to be a state because we are relying on useLayoutEffect which needs a dependency to run.
    //     We need useLayoutEffect because we need to run some code before layout repaints.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  // On rendered change before repaint
  useLayoutEffect(() => {

    // Animations are collected in a queue because we need useLayoutEffect to run as fast as possible.
    // We can run the animation here but it would cause a lot of lag.
    // Therefore, animations are run in the next frame using requestAnimationFrame.
    const animationQueue = new AnimationQueue()

    // let animCount = 0 // TODO: Might delete later
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

        let hasPrevAnimation = false
        // To prevent adding extra delay for staggered animation.

        // Reconcile the css animation times of the current node
        //   We assumed that the css animation times are in the same order before and after setRendered. (before and after reflow)
        node.getAnimations()
          .filter((a) => {
            if (opts.stagger && a.id.startsWith("__react-flip-children-move-animation")) {
              const delay = Number(a.id.split('+delay=')[1])
              const currentTime = Number(a.currentTime)
              if (delay > currentTime) {
                a.currentTime = delay
              }
              hasPrevAnimation = true
              // To prevent adding extra delay for staggered animation.
              // If there are existing animations, we don't need to add extra delay.
            }

            if (isCSSAnimation(a))
              return true
          })
          .forEach((animation, index) => animation.currentTime = entry.cssAnimationTimes?.[index] ?? 0)

        const prev = entry.rect
        if (!prev) return // Can't animate if rect is not saved
        if (opts.duration === 0) return // Can't animate if duration is 0

        // const curr = node.getBoundingClientRect()
        let curr: { x: number, y: number }
        if (opts.snapshotStrategy === "getBoundingClientRect" && parent.rect) {
          console.log("using getBoundingClientRect")
          const clientRect = node.getBoundingClientRect()
          curr = {
            x: clientRect.x - parent.rect.x,
            y: clientRect.y - parent.rect.y,
          }
        } else {
          console.log("using offset")
          curr = {
            x: node.offsetLeft,
            y: node.offsetTop
          }
        }

        const deltaY = prev.y - curr.y
        const deltaX = prev.x - curr.x
        if (!deltaY && !deltaX) return
        const delay = !hasPrevAnimation ? (entry.order ?? 0) * opts.stagger : 0
        animationQueue.add({
          node,
          keyframes: [
            { translate: `${ deltaX }px ${ deltaY }px` },
            { translate: `0px 0px` }
          ],
          options: {
            duration: opts.duration,
            easing: opts.easing,
            delay: delay,
            fill: "both",
            composite: "add",
            id: `__react-flip-children-move-animation+delay=${ delay }`
          },
          cancelOnFinish: true
        })
      }
    )

    //╭───────────────────╮
    //│ Parent Animation  │
    //╰───────────────────╯
    const parentAnimation = parent.queueAnimation(opts)
    if (parentAnimation) animationQueue.add(parentAnimation)

    requestAnimationFrame(() => {
      animationQueue.animate()
      // Animate all the animations in the queue. This includes elements that had moved and parent if they had moved.

      //╭───────────────────╮
      //│ Add Animation     │
      //╰───────────────────╯
      data.forEach(entry => entry.ref.current?.removeAttribute("data-adding"))
      // Remove the "data-adding" attribute to trigger the CSS transition
    })


  }, [rendered])

  return rendered.length
    ? rendered
    : children
}



//╭─────────────────────────────────────────────────╮
//│ Hooks                                           │
//╰─────────────────────────────────────────────────╯
function useRefMap<T>(
  defaultValues: () => T
) {
  const ref = useRef<Map<string, T>>(new Map())

  return {
    getOrAdd(key: string) {
      const existing = ref.current.get(key)
      if (existing) return { entry: existing, inPrev: true }

      const newRef = defaultValues
        ? defaultValues()
        : createRef<AnimatableElement>()

      ref.current.set(key, newRef as T)
      return { entry: newRef as T, inPrev: false }
      //  Would it be better to have the ref already attached to the element?
      //  Answer: No, because we need to attach the ref.
      //  There are no other ways to ensure that the ref is already attached to the element.
      //  Therefore, do not use .getOrAdd() if you don't plan to attach the ref to the element.
    },
    get(key: string) {
      return ref.current.get(key)
      // Error should be handled gracefully here.
      // What happens if we're not in the cloneElement phase but the key doesn't exist?
      // We shouldn't throw error here because we're not sure if the key is valid.
      // And we have no way to ensure that the keys are synchronized to the elements being rendered.
      // We also shouldn't throw because it is better to have a fallback than to crash the app.
    },
    forEach: (...args: Parameters<typeof ref['current']['forEach']>) => ref.current.forEach(...args),
    delete: (key: string) => ref.current.delete(key),
    entry: ref.current
  }
}

function useParent() {
  const parent = useRefObject({
    rect: undefined as undefined | DOMRect,
    node: undefined as undefined | AnimatableElement,
    saveNode(node?: AnimatableElement) {
      parent.node = node ?? parent.node
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
  return ref.current as T // directly return .current to avoid ref.current. everywhere.
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
function isCSSAnimation(animation: Animation): animation is CSSAnimation {
  return animation instanceof CSSAnimation
}


type AnimationItem = { node: AnimatableElement, keyframes: Keyframe[], options: KeyframeAnimationOptions, cancelOnFinish: boolean }

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