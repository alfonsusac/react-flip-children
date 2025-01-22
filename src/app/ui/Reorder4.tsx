/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Children, cloneElement, createRef, isValidElement, useEffect, useLayoutEffect, useMemo, useRef, useState, type JSX, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal, type Ref, type RefCallback, type RefObject } from "react";
import {
  isPortal
} from "react-is"


// :TODO LIST
// TODO - when child is portal, check if this is correct / stable
// TODO - replace HTMLElement with a more precise type with only APIs that are used.
// TODO - benchmark createMergedRes2 vs createMergedRefs
// TODO - support for react portal
// TODO - support for async components
// TODO - support for fragments

// AnimateChild only accepts children with certain valid types
type ValidChildren =
  | string | number | bigint | boolean | null | undefined
  | ReactPortal | Iterable<ValidChildren>
  | ReactElement<{ key?: Key, ref: Ref<HTMLElement> }, string | JSXElementConstructor<any>> // elements with key and ref props

// These are the possible children types that will be rendered
type RenderedNode =
  | string | number | bigint | boolean | null | undefined
  | ReactPortal
  | ReactElement<{ key?: Key, ref: Ref<HTMLElement> }, string | JSXElementConstructor<any>>

// These are all the data that is saved for each child
type SavedChildData
  = {
    ref: RefObject<HTMLElement | null>,
    rect?: { x: number, y: number },
    deletingTimeout?: NodeJS.Timeout,
    cssAnimationTimes?: (null | CSSNumberish)[]
  }

// AnimateChild keeps track of the references to each child via a Map.
// AniamteChild also creates a mergedRef for each child that is passed to the child's ref prop.
//  so that the child's ref prop can be used as normal. And the internal ref can be used to animate the child
function useChildrenRefs() {
  const refs = useRef<Map<Key, SavedChildData>>(new Map())
  const ret = {
    entries: refs.current,
    has: refs.current.has,
    getOrAdd: (key: Key) => {
      let entry = refs.current.get(key)
      if (!entry) {
        entry = { ref: createRef() }
        refs.current.set(key, entry)
      }
      return entry
    },
  }
  return ret
}

function useAddAnimationModule(enabled: boolean) {
  const addDataAddingPropIfInPrev = (inPrev: boolean, prop: Record<string, any>) => {
    if (!enabled) return
    if (!inPrev) prop['data-adding'] = ''
  }
}


export function AnimateChild3(
  { children, ...props }: {
    children: ValidChildren
    duration?: number
    easing?: string
    deleteAnimationDuration?: number
  }
) {
  // Defaults
  const duration = props.duration ?? 500
  const easing = useEasingValueCheck("ease-out", props.easing)
  const deleteAnimationDuration = props.deleteAnimationDuration ?? 500
  const withAddAnimation = true
  const withDeleteAnimation = true

  // State
  const [rendered, setRendered] = useState<RenderedNode[]>([])
  const entries = useChildrenRefs()

  useEffect(() => { // On children change
    const newKeys = new StrictKeySet()
    const keylessCount = new Counter()
    const newRenders = mapChildren(children,
      (child, index) => {
        // Allow primitives and portals to pass through
        if (isChildPrimitive(child))
          return child
        if (isChildPortal(child))
          return child // Portals are ignored for now.

        // Resolve Keys
        const key = child.props.key ?? `keyless_` + keylessCount.next()
        newKeys.addOrThrow(key)
        const inPrev = entries.has(key)
        const entry = entries.getOrAdd(key)

        // Resolve Refs
        const existingRef = child.props.ref
        const internalRef = entry.ref
        const ref = createMergedRefs(existingRef, internalRef)

        // Prepare props
        const props = prepareProps({ key, ref })

        // Additional processing
        // - If the child is not in the previous render, add a [data-adding] attribute
        if (withAddAnimation)
          if (!inPrev) props['data-adding'] = ''

        // - If the child is deleting in the previous render and re-added, remove the [data-deleting] attribute
        if (withDeleteAnimation) {
          entry.ref.current?.removeAttribute("data-deleting")
          if (entry.deletingTimeout) {
            clearTimeout(entry.deletingTimeout)
            delete entry.deletingTimeout
          }
        }

        // Commit changes
        return cloneElement(child, props)
      })

    rendered.forEach((child, index) => {
      // Allow primitives and portals to pass through
      if (isChildPrimitive(child) || isChildPortal(child))
        return child


      const node = child.props

    })

    setRendered(newRenders)

  }, [children])

  return rendered
}


/** A set that throws an error when a duplicate key is added */
class StrictKeySet extends Set<Key> {
  addOrThrow(key: Key) {
    if (this.has(key)) throw new DuplicateKeysError(key.toString()); super.add(key); return key
  }
}

/** A counter that is incremented everytime it is retrieved */
class Counter {
  private count = 0
  next() { return this.count++ }
}
// This is needed to maintain the order of the keys by assigning a unique key to elements without a key.
//  A count is used to ensure the order is maintain
//  Example when shuffled: before: [1, cxd, ghy, pos, 2] | after: [1, pos, cxd, ghy, 2]
//   The order is maintained because the <div key={1} /> and <div key={2} /> are not shuffled and they stayed in the same place
//   As the case if written like this ->
//   <AnimateChild>
//     <div>1</div>
//     {arr.map( ... )}
//     <div>2</div>
//   </AnimateChild >
//

class AnimateChildError extends Error {
  constructor(message: string) { super(message); this.name = "AnimateChildError"; }
}
class DuplicateKeysError extends AnimateChildError {
  constructor(key: string) { super(`Duplicate key found with key: ${ key }`); this.name = "DuplicateKeysError"; }
}


/** Check once if the new easing value is valid. */
function useEasingValueCheck(defaultValue: string, prop?: string) {
  return useMemo(() => {
    if (!prop) return defaultValue
    try {
      const div = document.createElement("div")
      div.animate({ opacity: 0 }, { duration: 500, easing: prop })
      return prop
    } catch (error) {
      console.log(`Invalid easing value: ${ prop }. Using default easing: ${ defaultValue }`)
      return defaultValue
    }
  }, [prop])
}


type PrimitiveChild =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined

type InvalidChild =
  | ReactPortal
  | Promise<Awaited<ReactNode>>

// // Error handling
// if (isChildPromise(child))
//   throw new AnimateChildError(`🔥 Oops: Promise children/Async components are not yet supported. Please wrap the component in a HTML-like element. Check child number ${ index } from this children`)
// if (isChildIterable(child))
//   throw new AnimateChildError(`🔥 Oops: Found an array while iterating through child. This shouldn't happen.. Children are passed through Children.forEach and should not be an array. Check child number ${ index } from this children.. or contact the developer of this library.`)
// if (!isValidProp(child))
//   throw new AnimateChildError(`🔥 Oops: Invalid child. The prop of child number ${ index } should be an object.`)

function isChildPrimitive(node: ReactNode): node is PrimitiveChild {
  return node == null || typeof node !== 'object'
}

function isChildPromise(node: ReactNode): node is Promise<Awaited<ReactNode>> {
  return node instanceof Promise
}

function isChildPortal(node: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<Awaited<ReactNode>>): node is ReactPortal {
  return isPortal(node)
}

function isChildIterable(node: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>): node is Iterable<ReactNode> {
  return node != null && Symbol.iterator in node
}

function isValidProp(node: ReactElement): node is ReactElement<Record<string, any>> {
  return typeof node.props === 'object' && node.props !== null && "ref" in node.props
}

function isValidRenderedChild(node: ReactNode): node is ReactElement<{ key?: string, ref: Ref<HTMLElement> }, string | JSXElementConstructor<any>> {
  if (isChildPrimitive(node) || isChildPortal(node)) return false


  return true
}

function isRefCallback<T>(ref: Ref<T>): ref is RefCallback<T> {
  return typeof ref === "function"
}
function isReact19RefCallbackCleanUpFunction<T>(refReturn: void | (() => void)): refReturn is (() => void) {
  return typeof refReturn === "function"
}

function isRefObject<T>(ref: Ref<T>): ref is RefObject<T | null> {
  return !!ref && "current" in ref
}

// Exclude Iterable type helper
type ExcludeIterable<T> = T extends Iterable<infer U> ? never : T

// Custom Children.forEach that does: 
// - Not modify the keys of the children
// - (TODO) Unwrap fragments
// - (TODO) Somehow handle async components
function mapChildren<C, T>(children: C, fn: (child: ExcludeIterable<C>, index: number) => T) {
  const newChildren: T[] = []
  Children.forEach(children, (child, index) => {
    newChildren.push(fn(child as ExcludeIterable<C>, index))
  })
  return newChildren
}

function prepareProps<T>(props: T) {
  return props as T & { [key: string]: any }
}

function createMergedRefs<T>(
  passedDownRef: Ref<T>,
  internalRef: RefObject<T | null>
): RefCallback<T> {
  return (node: T) => {
    if (isRefCallback(passedDownRef)) {
      const cleanup = passedDownRef(node)
      internalRef.current = node
      return () => {
        if (isReact19RefCallbackCleanUpFunction(cleanup))
          cleanup()
        else
          passedDownRef(null)
        internalRef.current = null
      }
    }
    if (isRefObject(passedDownRef)) {
      passedDownRef.current = node
      internalRef.current = node
      return () => {
        passedDownRef.current = null
        internalRef.current = null
      }
    }
    internalRef.current = node
    return () =>
      internalRef.current = null
  }
}

function createMergedRes2<T>(
  passedDownRef: Ref<T>,
  internalRef: RefObject<T | null>
): Ref<T> {
  if (isRefCallback(passedDownRef)) {
    return (node: T) => {
      const cleanup = passedDownRef(node)
      internalRef.current = node
      return () => {
        if (isReact19RefCallbackCleanUpFunction(cleanup))
          cleanup()
        else
          passedDownRef(null)
        internalRef.current = null
      }
    }
  }
  if (isRefObject(passedDownRef)) {
    return (node: T) => {
      passedDownRef.current = node
      internalRef.current = node
      return () => {
        passedDownRef.current = null
        internalRef.current = null
      }
    }
  }
  return internalRef
}


// // AnimateChild processes incoming children to identify the keys and the order of the children
// function mapValidChildren(children: ReactNode, fn: (child: ValidChild) => ValidChild) {
//   // Process incoming children
//   //  .forEach is used instead of Children.map because .map prefixes the key with a '.$' which is not wanted.
//   const newRenders: ReactNode[] = []
//   Children.forEach(children, child => {
//     if (!isValidChild(child)) return
//     fn(child)
//   })
//   return newRenders
// }

// function mergeRefs<T>(...refs: Array<Ref<T>>) {
//   return (node: T) => {
//     refs.forEach(ref => {
//       if (typeof ref === 'function') {
//         ref(node);  // Call the callback ref with the node
//       } else if (ref && 'current' in ref) {
//         (ref as React.RefObject<T>).current = node;  // Set the node on the ref object
//       }
//     });
//   };
// }





// const mergedRef = (node: HTMLElement) => {
//   if (isRefCallback(existingRef)) {
//     const cleanup = existingRef(node)
//     internalRef.current = node
//     return () => {
//       if (isReact19RefCallbackCleanUpFunction(cleanup)) {
//         cleanup()
//       } else {
//         existingRef(null)
//       }
//       internalRef.current = null
//     }
//   }
//   if (isRefObject(existingRef)) {
//     existingRef.current = node
//     internalRef.current = node
//     return () => {
//       existingRef.current = null
//       internalRef.current = null
//     }
//   }
//   internalRef.current = node
//   return () => {
//     internalRef.current = null
//   }
// }