"use client"

import { createRef, isValidElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode, type ReactPortal, type Ref, type RefObject } from "react"
import { flatMap, isPortal, type ReactElementWithKey, cloneWithMergedRef, filterNodeByKey, createProp, clone, type AnimationTime } from "./helper"


//╭─────────────────────────────────────────────────╮
//│ Types                                           │
//╰─────────────────────────────────────────────────╯
type AnimatableElement = Pick<HTMLElement,
  | "animate"
  | "getBoundingClientRect"
  | "getAnimations"
  | "removeAttribute"
  | "parentElement"
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
  rect?: DOMRect,
  cssAnimationTimes?: AnimationTime[],
}


//╭─────────────────────────────────────────────────╮
//│ # Main                                          │
//╰─────────────────────────────────────────────────╯
export function AnimateChildren(
  { children }: {
    children?: ReactNode
  }
) {
  const [rendered, setRendered] = useState<ValidNode[]>([])
  const data = useRefMap<SavedChildData>(() => ({ ref: createRef() }))

  const fn = useRefObject({
    saveChildRectAndAnimation: (entry: SavedChildData) => {
      const node = entry.ref.current
      if (!node) return
      entry.rect = node.getBoundingClientRect()
      entry.cssAnimationTimes = node.getAnimations().filter(isCSSAnimation).map(a => a.currentTime)
      // Only save CSSAnimation times because CSSTransition can't be persisted
    },
  })

  const parent = useParent()


  useEffect(() => {   // On incoming children change
    const keys = new Set<string>()
    // Track keys to prevent duplicates

    // Flat iterate through every children to process incoming new elements
    const newRender = flatMap<ValidNode>(children,
      child => {
        if (!isValidElement(child) || isPortal(child)) return child
        // Skips processing invalid elements or portals but left as-is in the children
        //   Invalid elements doesn't have keys therefore it wont be animated since it can't be tracked
        //   Even if they have keys, portal can't be animated since its not a valid animatable element

        keys.add(child.key)
        // Check for duplicate keys

        const { entry, inPrev } = data.getOrAdd(child.key)

        //╭───────────────────╮
        //│ Delete Animation  │
        //╰───────────────────╯
        entry.ref.current?.removeAttribute("data-deleting")
        // Remove 'data-deleting' attribute if present to trigger un-delete transition
        clearTimeout(entry.timeout)
        delete entry.timeout
        // Clear existing timeout to prevent existing timeout to trigger deletion

        const modifiedProp = createProp()

        //╭───────────────────╮
        //│ Add Animation     │
        //╰───────────────────╯
        if (inPrev) modifiedProp["data-adding"] = ''
        // This will be deleted later after layout paint to trigger CSS transition via attribute change

        return cloneWithMergedRef(child, entry.ref, modifiedProp)
      }
    )

    // Iterate through rendered children to mark deleted elements
    rendered.forEach(
      (child, index) => {
        if (!isValidRenderedChild(child)) return
        // Ivalid nodes are filtered here because we can't animate key-less elements.

        const entry = data.get(child.key)
        if (!entry?.ref.current) return
        const node = entry.ref.current

        parent.node ??= node.parentElement ?? parent.node
        // Cache parent node

        fn.saveChildRectAndAnimation(entry)
        // Save the rect data and css animationTimes of the current node

        //╭───────────────────╮
        //│ Delete Animation  │ This part below is for deletion animation.
        //╰───────────────────╯ 

        if (keys.has(child.key)) return
        // Filter only the deleted keys

        newRender.splice(index, 0, clone(child, { "data-deleting": "" }))
        // Re-add the deleted elements back in the children with "data-deleting" props.

        if (entry.timeout) return
        // Schedule deletion ideally after animation completes but ONLY if existing timeout hadn't been run yet

        entry.timeout = setTimeout(() => {
          if (!entry.timeout) return
          // If timeout is already cleared, do not proceed with deletion. This will fuck up the stability of the elements.

          // Save the rect and animation and everything else again here.
          data.forEach(fn.saveChildRectAndAnimation)
          parent.saveRect()

          setRendered(prev => filterNodeByKey(prev, child.key))
          // Trigger re-render so that useLayoutEffect can run again

          data.delete(child.key)
          // Delete the entry

        }, 1000)

      }
    )

    setRendered(newRender)

    //╭───────────────────╮
    //│ Parent Animation  │
    //╰───────────────────╯
    parent.saveRect()

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

    rendered.forEach(
      child => {
        // Same as before, we can only animate valid elements with ref.
        if (!isValidRenderedChild(child)) return

        // We can't get the ref from child.props.ref because their ref might be a callback ref.
        const entry = data.get(child.key)

        if (!entry?.ref.current) return
        const node = entry.ref.current

        // Reconcile the css animation times of the current node
        //   We assumed that the css animation times are in the same order before and after setRendered. (before and after reflow)
        node.getAnimations()
          .filter(isCSSAnimation)
          .forEach((animation, index) => animation.currentTime = entry.cssAnimationTimes?.[index] ?? 0)

        const prev = entry.rect
        if (!prev) return // Can't animate if rect is not saved

        const curr = node.getBoundingClientRect()
        const deltaY = prev.y - curr.y
        const deltaX = prev.x - curr.x
        if (!deltaY && !deltaX) return
        animationQueue.add({
          node,
          keyframes: [
            { translate: `${ deltaX }px ${ deltaY }px` },
            { translate: `0px 0px` }
          ],
          options: {
            duration: 500,
            easing: "ease-out",
            fill: "both",
            composite: "add",
          },
          cancelOnFinish: true
        })
      }
    )

    //╭───────────────────╮
    //│ Parent Animation  │
    //╰───────────────────╯
    const parentAnimation = parent.queueAnimation()
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
    queueAnimation() {
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
          duration: 500,
          easing: "ease-out",
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