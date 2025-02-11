
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Children, cloneElement, createRef, isValidElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode, type RefObject, type SetStateAction, type TransitionEvent } from "react";

export function AnimateChild(
  { children, ...props }: {
    children: React.ReactNode;
    duration?: number;
    easing?: string;
    resetAnimation?: boolean;
  }
) {
  const [rendered, setRendered] = useState<ValidReactElement[]>()

  // 𝓇𝑒𝓃𝒹𝑒𝓇𝑒𝒹𝑅𝑒𝒻𝓈
  // This is the ref to the previous children that was rendered.
  const renderedRefs = useRef<Map<string, RefObject<HTMLElement | null>>>(new Map()) // TODO : Clear deleted keys
  const getOrCreateChildrenRef = (key: string) => {
    const ref = renderedRefs.current.get(key) ?? createRef<HTMLElement>()
    renderedRefs.current.set(key, ref)
    return ref
  }

  // parentRef
  // This is the ref to the parent element.
  const parentRef = useRef<HTMLElement | undefined>(null)
  const prevParentRef = useRef<{
    width: number,
    height: number,
  }>(null)
  const saveParent = () => {
    if (!parentRef.current) return
    prevParentRef.current = {
      // TODO - try with clientWidth and clientHeight
      width: parentRef.current.offsetWidth,
      height: parentRef.current.offsetHeight
    }
  }

  // rectData
  // This is the ref to the previous children that was rendered.
  const prevRectRef = useRef<Map<string, {
    node: HTMLElement,
    y: number,
    x: number,
    animationCurrentTimes: (null | CSSNumberish)[]
  }>>(new Map())
  const saveRect = (key: string, node: HTMLElement) => {
    const rect = node.getBoundingClientRect()
    const animations = node.getAnimations()
    prevRectRef.current.set(key, {
      node,
      y: rect.y,
      x: rect.x,
      animationCurrentTimes: animations.filter(a => a instanceof CSSAnimation).map(a => a.currentTime)
    })
  }

  // deletingMap
  // This is a map of keys that are currently being deleted.
  const deletingMap = useRef<Map<string, NodeJS.Timeout>>(new Map())



  useEffect(() => {
    console.time("useEffect")

    const debouncedFunction = () => {

      const newChildren = new Set<string>()
      const oldChildren = new Set<string>()

      rendered?.forEach(child => oldChildren.add(child.key))

      const newRenderArr = pureMapChildren(children, (child) => {
        if (newChildren.has(child.key)) throw new DuplicateKeysError(child.key)
        newChildren.add(child.key)
        const ref = getOrCreateChildrenRef(child.key)
        ref.current?.removeAttribute("data-deleting")
        const deletingRef = deletingMap.current.get(child.key)
        if (deletingRef) {
          clearTimeout(deletingRef)
          deletingMap.current.delete(child.key)
        }
        const inOld = oldChildren.has(child.key)
        return cloneFrom(child, { ref, ...inOld ? {} : { 'data-adding': '' } }) as ValidReactElement
      })

      rendered?.forEach((child, index) => {
        const node = child.props.ref?.current
        if (!node) return

        parentRef.current ??= node.parentElement
        saveRect(child.key, node)

        if (newChildren.has(child.key)) return
        console.log("Deleting", child.key)
        const el = cloneFrom(child, { 'data-deleting': '', ref: child.props.ref })
        newRenderArr.splice(index, 0, el)
      })
      saveParent()

      setRendered(newRenderArr)
    }

    const id = setTimeout(debouncedFunction, 10)
    console.timeEnd("useEffect")
    return () => clearTimeout(id)
  }, [children])


  useLayoutEffect(() => {

    console.time("useEffect2")

    const animateQueue: { node: HTMLElement, deltaX: number, deltaY: number }[] = []

    prevRectRef.current.forEach((prev, key) => {
      const node = prev.node

      // This part only reconcile animations but not transitions
      const animations = node.getAnimations()
      animations // Reconcile previous CSSAnimation
        ?.filter(a => a instanceof CSSAnimation)
        .forEach((animation, index) => {
          const prevCurrentTimes = prev.animationCurrentTimes?.at(index) // Assume that the order of the animations is the same
          animation.currentTime = prevCurrentTimes ?? 0
        })

      const alreadyDeleting = deletingMap.current.get(key)
      if (node.getAttribute("data-deleting") === "" && !alreadyDeleting) {
        console.log("Setting timeout for", key)
        const timeout = setTimeout(() => {
          const node = renderedRefs.current.get(key)?.current
          if (node?.hasAttribute("data-deleting") === false) return

          renderedRefs.current.forEach((ref, key) => {
            if (!ref.current) return
            parentRef.current ??= ref.current.parentElement
            saveRect(key, ref.current)
          })
          saveParent()

          setRendered(prev => prev?.filter(child => child.key !== key))
          prevRectRef.current.delete(key)
          deletingMap.current.delete(key)
        }, 2000)

        deletingMap.current.set(key, timeout)
      }

      const curr = node.getBoundingClientRect()
      const deltaY = prev.y - curr.y // (find the difference)
      const deltaX = prev.x - curr.x // (find the difference)

      if (deltaY === 0 && deltaX === 0) return
      animateQueue.push({ node, deltaX, deltaY }) // animate later
    })

    requestAnimationFrame(() => {
      animateQueue.forEach(({ node, deltaX, deltaY }) => {
        const animation = node.animate([
          { translate: `${ deltaX }px ${ deltaY }px` },
          { translate: `0px 0px` }
        ], {
          duration: props.duration ?? 500,
          easing: props.easing ?? "ease-out",
          fill: "both",
          composite: props.resetAnimation ? "replace" : "add",
        })
        animation.onfinish = () => animation.cancel()
      })
    });


    (() => {
      const parent = parentRef.current
      const prev = prevParentRef.current
      if (!parent) return
      if (!prev) return
      const curr = parent.getBoundingClientRect()
      const delta = {
        y: prev.height - curr.height,
        x: prev.width - curr.width,
      }
      requestAnimationFrame(() => {
        const animation = parent.animate([
          { marginBottom: `${ delta.y }px`, marginRight: `${ delta.x }px` },
          { marginBottom: `0px`, marginRight: `0px` }
        ], {
          duration: props.duration ?? 500,
          easing: props.easing ?? "ease-out",
          composite: props.resetAnimation ? "replace" : "add",
        })
        animation.onfinish = () => animation.cancel()
      })
    })()

    setTimeout(() => {
      renderedRefs.current.forEach((ref, key) => {
        ref.current?.removeAttribute("data-adding")
      })
    })

    console.timeEnd("useEffect2")

  }, [rendered])

  return rendered ?? children
}

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



type Getter<T> = (prev: T) => T

type ValidReactElement = ReactElement<{ key: string, ref?: RefObject<HTMLElement>, }> & {
  key: string,
}

function isValidArrayElement(node: ReactNode): node is ValidReactElement {
  if (!isValidElement(node)) {
    console.warn("Child can only be a valid ReactElement with a key", node)
    return false
  }
  if (typeof node.key !== "string" || !node.key) {
    console.warn("Child key must be a string", node)
    return false
  }
  if (typeof node.props !== "object") {
    return false
  }
  return true
}

function isValidElementWithRef(node: ReactElement) {
  if (typeof node.type === "string") {
    return true
  }
  if (typeof node.type === "function" && !!node.type.prototype.isReactComponent) {
    return true
  }
  // @ts-expect-error node.type.displayName is a valid property
  if (typeof node.type === 'function' && node.type.displayName === 'ForwardRef') {
    return true;  // Components wrapped with forwardRef can accept a ref
  }
  return false
}

function forEachChildren(children: ReactNode, callback: (child: ValidReactElement, index: number) => void) {
  Children.forEach(children, (child, index) => {
    if (!isValidArrayElement(child)) {
      console.warn("Child can only be a valid ReactElement with a key", child)
      return
    }
    callback(child, index)
  })
}

function mapChildren(children: ReactNode, callback: (child: ValidReactElement, index: number) => ReactNode) {
  return Children.map(children, (child, index) => {
    if (!isValidArrayElement(child)) return child
    return callback(child, index)
  })
}


// PureMap maps children without adding '.$' to the key.
function pureMapChildren<T>(children: ReactNode, callback: (child: ValidReactElement, index: number) => T) {
  const newChildren: T[] = []
  Children.forEach(children, (child, index) => {
    if (!isValidArrayElement(child)) return child
    newChildren.push(callback(child, index))
  })
  return newChildren
}

function cloneFrom(child: ValidReactElement, props?: Record<string, any> & { key?: string }, reason?: string, disableLog?: boolean) {
  if ((!disableLog && reason) || reason)
    console.log("Creating new element", child.key, "Reason", reason ?? "No reason")
  return cloneElement<{ key: string }>(child, { ...(child.props), key: child.key, ...props }) as ValidReactElement
}