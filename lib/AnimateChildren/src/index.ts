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
  flatMap,
  isPortal,
  cloneWithMergedRef,
  clone,
  flatMapPreserveKey,
  type AnimationTime,
} from "./helper"

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
    useAbsolutePositionOnDeletedElements?: boolean
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
    useAbsolutePositionOnDeletedElements: false,
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

  function saveChildRectAndAnimation(entry: SavedChildData) {
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

    if (opts.disableAnimationReconciliation)
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

    const mapFn = opts.normalizeKeys
      ? flatMapPreserveKey<ValidNode>
      : flatMap<ValidNode>

    const deletingKeys: string[] = []

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
        if (entry.deleting) {
          delete entry.deleting
        }
        // Clear existing timeout to prevent existing timeout to trigger deletion
        // ────────────────────

        const modifiedProp: Record<string, any> = { key }
        //╭───────────────────╮
        //│ Add Animation     │
        //╰───────────────────╯
        if (!inPrev) {
          modifiedProp["data-adding"] = ''
          entry.adding = true
        }
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
        tempParent ??= parent.saveNodeAndRect(node.parentElement)
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

        const props: Record<string, any> = { "data-deleting": "" }

        if (opts.useAbsolutePositionOnDeletedElements) {
          props.style = {
            position: 'absolute',
            top: node.offsetTop,
            left: node.offsetLeft,
          } satisfies CSSProperties
        }

        newRender.splice(index, 0, clone(child, props))
        // Re-add the deleted elements back in the children with "data-deleting" props.

        if (entry.deleting) return
        // Schedule deletion ideally after animation completes but ONLY if existing timeout hadn't been run yet

        deletingKeys.push(child.key)
        entry.deleting = true
        // ────────────────────
      }
    )

    setRendered(newRender)


    // Timeout for deletion are queued here
    setTimeout(() => {
      // data.forEach(saveChildRectAndAnimation)
      // parent.saveRect()

      // deletingKeys.forEach(i => {
      //   if (!data.get(i)?.deleting) return
      //   setRendered(prev => filterNodeByKey(prev, i))
      //   data.delete(i)
      // })
      tempParent = undefined
      for (let [key, entry] of data) {
        if (!entry?.ref.current) return
        const node = entry.ref.current
        tempParent ??= parent.saveNodeAndRect(node.parentElement)
        saveChildRectAndAnimation(entry)
        if (!entry.deleting) return
        setRendered(prev => filterNodeByKey(prev, key))
        data.delete(key);
      }
    }, opts.delayDeletion)

    // console.timeEnd("cloning")

    // Why missing dependencies like "data", "parent", and "rendered" are ignored:
    //   "parent" is using useRef therefore its not reactive
    //   "data" is also using useRef therefore its not reative
    //   We can't depend on rendered because we need this part to not run on rendered change.
    //     We need "rendered" to be a state because we are relying on useLayoutEffect which needs a dependency to run.
    //     We need useLayoutEffect because we need to run some code before layout repaints.

  }, [children])

  // On rendered change before repaint
  useLayoutEffect(() => {

    // console.time("getting animation queue")
    // Animations are collected in a queue because we need useLayoutEffect to run as fast as possible.
    // We can run the animation here but it would cause a lot of lag.
    // Therefore, animations are run in the next frame using requestAnimationFrame.
    const animationQueue = new AnimationQueue()

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
        //   NB: Major Performance Hit
        // console.log(animations)

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
        if (!prev) return // Can't animate if rect is not saved
        if (opts.duration === 0) return // Can't animate if duration is 0

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
            width: (node as HTMLDivElement).offsetWidth,
            height: (node as HTMLDivElement).offsetHeight,
          }
        }

        const deltaY = prev.y - curr.y
        const deltaX = prev.x - curr.x
        const deltaWidth = prev.width - curr.width
        const deltaHeight = prev.height - curr.height
        if (!deltaY && !deltaX) return
        const delay = !hasPrevAnimation
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

      data.forEach(
        entry => {
          if (entry.adding && entry.ref.current) {
            delete entry.ref.current.dataset.adding
            delete entry.adding
          }
        })
      // Remove the "data-adding" attribute to trigger CSS transition
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
    entry: ref.current,
    [Symbol.iterator]: () => ref.current[Symbol.iterator]()
  }
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