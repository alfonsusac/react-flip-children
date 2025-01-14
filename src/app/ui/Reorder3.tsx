/* eslint-disable @typescript-eslint/no-explicit-any */

import { Children, cloneElement, createRef, isValidElement, useEffect, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode, type RefObject } from "react";

// Todo - can this be made without the use of isValidElementStrict?

export function AnimateChild2(
  { children, ...props }: {
    children: React.ReactNode;
    duration?: number;
    easing?: string;
  }
) {
  const [rendered, setRendered] = useState<ValidReactElement[]>()
  const [entries, getOrAddEntry] = useMap<SavedChildData>()
  const parentRef = useRef<SavedParentData>({})

  useEffect(() => {

    const uniqueNewKeys = new StrictSet()
    const newRenders: ValidReactElement[] = []

    // Loop through every child of incoming children.
    // The goal is to 1) inject refs to each child, 2) add data-adding to new children, 3) remove data-deleting from deleted children that are 
    Children.forEach(children, child => {
      if (!isValidElementStrict(child)) return
      uniqueNewKeys.register(child.key)
      const inPrev = entries.has(child.key)

      const existingChild = getOrAddEntry(child.key, { ref: createRef<HTMLElement | null>() })

      existingChild.ref.current?.removeAttribute("data-deleting")
      if (existingChild.deletingTimeout) {
        clearTimeout(existingChild.deletingTimeout)
        delete existingChild.deletingTimeout
      }

      const props: Props = { ref: existingChild.ref }
      if (!inPrev) props['data-adding'] = ''

      const el = cloneFrom(child, props)
      newRenders.push(el)
    })

    rendered?.forEach((child, index) => {
      const node = child.props.ref?.current
      if (!node) return

      // Save parent node
      parentRef.current.node ??= node.parentElement

      const entry = entries.get(child.key)
      if (!entry) return

      // Save rect data
      const rect = node.getBoundingClientRect()
      entry.rect = rect

      // Save css animation times
      const cssAnimations = node.getAnimations()
        .filter(a => a instanceof CSSAnimation)
        .map(a => a.currentTime)
      entry.cssAnimationTimes = cssAnimations

      if (uniqueNewKeys.has(child.key)) return

      // Deleting
      const props = { 'data-deleting': '', ref: child.props.ref }
      const el = cloneFrom(child, props)

      newRenders.splice(index, 0, el)
    })

    // Save parent data
    if (parentRef.current.node) {
      parentRef.current.rect = {
        width: parentRef.current.node.clientWidth,
        height: parentRef.current.node.clientHeight
      }
    }

    setRendered(newRenders)

  }, [children])

  useLayoutEffect(() => {

    if (!rendered) return

    const animateQueue: AnimationItem[] = []

    // Queue Children Animation
    rendered.forEach(child => {
      const node = child.props.ref?.current
      if (!node) return


      const entry = entries.get(child.key)
      if (!entry) return // if it happen it should reconstruct entry


      const key = child.key

      // Reconcile animations
      const animations = node.getAnimations()
      animations
        .filter(a => a instanceof CSSAnimation)
        .forEach((animation, index) => {
          const prevTime = entry?.cssAnimationTimes?.[index]
          animation.currentTime = prevTime ?? 0
        })

      // Trigger delete timeout
      const alreadyDeleting = entry?.deletingTimeout
      if (node.hasAttribute("data-deleting") && !alreadyDeleting) {
        const timeout = setTimeout(() => {
          if (!node.hasAttribute("data-deleting")) return
          // Same as in first useEffect
          entries.forEach((entry) => {
            const node = entry.ref.current
            if (!node) return

            // Save rect data
            const rect = node.getBoundingClientRect()
            entry.rect = rect
            // Save css animation times
            const cssAnimations = node.getAnimations()
              .filter(a => a instanceof CSSAnimation)
              .map(a => a.currentTime)
            entry.cssAnimationTimes = cssAnimations
          })
          // Save parent data
          if (parentRef.current.node) {
            parentRef.current.rect = {
              width: parentRef.current.node.clientWidth,
              height: parentRef.current.node.clientHeight
            }
          }

          setRendered(prev => prev?.filter(child => child.key !== key))
          entries.delete(key)
        }, 2000) // TODO - figure when to end animation!
        entry.deletingTimeout = timeout
      }

      // Animate
      const prev = entry.rect
      if (!prev) return

      const curr = node.getBoundingClientRect()
      const deltaY = prev.y - curr.y
      const deltaX = prev.x - curr.x

      if (deltaY === 0 && deltaX === 0) return

      animateQueue.push({
        node,
        keyframes: [
          { translate: `${ deltaX }px ${ deltaY }px` },
          { translate: `0px 0px` }
        ],
        options: {
          duration: props.duration ?? 500,
          easing: props.easing ?? "ease-out",
          fill: "both",
          // composite: props.resetAnimation ? "replace" : "add",
          composite: "add",
        }
      })
    })

    // Queue Parent Animation
    if (parentRef.current.node && parentRef.current.rect) {
      const node = parentRef.current.node
      const prev = parentRef.current.rect
      const curr = node.getBoundingClientRect()
      const delta = {
        y: prev.height - curr.height,
        x: prev.width - curr.width,
      }
      if (delta.y !== 0 || delta.x !== 0) {
        animateQueue.push({
          node,
          keyframes: [
            { marginBottom: `${ delta.y }px`, marginRight: `${ delta.x }px` },
            { marginBottom: `0px`, marginRight: `0px` }
          ],
          options: {
            duration: props.duration ?? 500,
            easing: props.easing ?? "ease-out",
            composite: "add",
          }
        })
      }
    }


    // Animate all
    requestAnimationFrame(() => {
      animateQueue.forEach(({ node, keyframes, options }) => {
        const animation = node.animate(keyframes, options)
        animation.onfinish = () => animation.cancel()
      })
    });

    // Trigger Add Animation
    setTimeout(() => {
      entries.forEach(entry => {
        entry.ref.current?.removeAttribute("data-adding")
      })
    })

  }, [rendered])

  return rendered ?? children
}

// Utils
// --------------

type ReactKey
  = string | number
type AnimationTime
  = null | CSSNumberish
type Props
  = { [key: string]: any }
type HTMLElementRefObject
  = RefObject<HTMLElement | null>
type ValidReactElement
  = ReactElement<{ key: ReactKey, ref?: HTMLElementRefObject }> & { key: string }
type SavedChildData
  = {
    ref: HTMLElementRefObject,
    rect?: { x: number, y: number },
    deletingTimeout?: NodeJS.Timeout,
    cssAnimationTimes?: AnimationTime[]
  }
type SavedParentData
  = {
    node?: HTMLElement | null,
    rect?: { width: number, height: number }
  }
type AnimationItem
  = { node: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions }

class AnimateChildError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AnimateChildError"
  }
}
class DuplicateKeysError extends AnimateChildError {
  constructor(key: string) {
    super(`Duplicate key found with key: ${ key }`)
    this.name = "DuplicateKeysError"
  }
}
class StrictSet extends Set<string> {
  register(key: string) {
    if (this.has(key)) throw new DuplicateKeysError(key)
    super.add(key)
    return this
  }
}


function isValidReactKey(key: unknown): key is ReactKey {
  return typeof key === "string" || typeof key === "number"
}
// can this be made without the use of isValidElementStrict?
function isValidElementStrict(node: ReactNode): node is ValidReactElement {
  return isValidElement(node) && isValidReactKey(node.key)
}
function warnKeylessElement(node: ReactNode) {
  console.warn("Child can only be a valid ReactElement (<CustomComponent/> or primitive component like: <div>) with a key (string | number)", node)
}


function useMap<T>() {
  const ref = useRef<Map<string, T>>(new Map())
  const getOrAddRef = (key: string, value: T) => {
    const val = ref.current.get(key)
    if (!val) {
      ref.current.set(key, value)
      return value
    }
    return val
  }
  return [ref.current, getOrAddRef] as const
}
function cloneFrom(
  child: ValidReactElement,
  props?: Record<string, any>,
  reason?: string,
  disableLog?: boolean
) {
  if (!!reason && !disableLog)
    console.log(`Creating new element of key [${ child.key }]. for ${ reason }`)

  const newProps = { ...child.props, key: child.key, ...props }

  const el = cloneElement(child, newProps)
  if (!isValidElementStrict(el)) throw new AnimateChildError("Invalid element")
  return el
}

// PureMap maps children without adding '.$' to the key.
function MapUniqueChildrenElements<T>(children: ReactNode, callback: (child: ValidReactElement, index: number) => T) {
  const newChildren: T[] = []
  const newChildrenKeys = new Set<string>()
  Children.forEach(children, (child, index) => {
    if (!isValidElementStrict(child)) return child
    newChildren.push(callback(child, index))
  })
  return newChildren
}











