/* eslint-disable @typescript-eslint/no-explicit-any */

import { Children, createRef, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode, type RefObject } from "react";

// Todo - can this be made without the use of isValidElementStrict?

export function AnimateChild(
  { children, ...props }: {
    children: React.ReactNode;
    duration?: number;
    easing?: string;
  }
) {
  const [rendered, setRendered] = useState()
  const [refs, getOrAddRef] = useMap<{ ref: HTMLElementRefObject, rect?: SavedChildData }>()
  const parentRef = useRef<SavedParentData>(null)
  const deletingMapRef = useMap<NodeJS.Timeout>()

  useEffect(() => {

    const newChildrenKeyStrictSet = new StrictSet()
    const newRenderedElements: ReactNode[] = []

    Children.forEach(children, (child) => {
      let newNode = child
      if (!isValidElementStrict(child)) return
      newChildrenKeyStrictSet.addOrThrow(child.key)
      const ref = getOrAddRef(child.key, { ref: createRef<HTMLElement | null>() })

      newNode = cloneElement(child, { ref: ref.ref })
    })



  })

}

// Utils
// --------------

type ReactKey
  = string | number
type HTMLElementRefObject
  = RefObject<HTMLElement | null>
type ValidReactElement
  = ReactElement<{ key: ReactKey, ref?: HTMLElementRefObject }> & { key: string }
type SavedChildData
  = { y: number, x: number }
type SavedParentData
  = { node: HTMLElement, width: number, height: number }

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
  addOrThrow(key: string) {
    if (this.has(key)) throw new DuplicateKeysError(key)
    super.add(key)
    return this
  }
}
class StrictMap extends Map<string, unknown> {
  setOrThrow(key: string, value: unknown) {
    if (this.has(key)) throw new DuplicateKeysError(key)
    super.set(key, value)
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
  child: ReactNode,
  props?: Record<string, any>,
  reason?: string,
  disableLog?: boolean
) {
  if (isValidElementStrict(child)) {
    if (!!reason && !disableLog)
      console.log(`Creating new element of key [${ child.key }]. for ${ reason }`)



  } else {
    if (!!reason && !disableLog)
      console.log(`Creating new element of key [${ child }]. for ${ reason }`)
  }


  if (!!reason && !disableLog)
    console.log(`Creating new element of key [${child.key}]. for ${reason}`)
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











