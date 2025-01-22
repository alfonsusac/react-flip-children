/* eslint-disable @typescript-eslint/no-explicit-any */
import { Children, cloneElement, isValidElement, type CSSProperties, type ExoticComponent, type JSXElementConstructor, type LazyExoticComponent, type ReactElement, type ReactNode, type ReactPortal, type Ref } from "react";
import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";


type Pretty<T> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;


//─────────────────────────────────────────────────╮
// react-is                                        │
//                                                 │  
// Patch isFragment to return false if the type is not Fragment
export function isFragment(child: ReactNode): child is ReactElement<{ children?: ReactNode }> {
  return _isFragment(child)
}
export function isPortal(child: ReactNode): child is ReactPortal {
  return _isPortal(child)
}
export function isStandardFlattenedReactElement(child: ReactElement): child is ReactElement<Record<string, any>> & { key: string } {
  return typeof child.props === "object" && child.key != null
}

type PrimitiveChild =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined

export function isPrimitive(node: ReactNode): node is PrimitiveChild {
  return node == null || typeof node !== 'object'
}

export type AnimationTime = (null | CSSNumberish)


//─────────────────────────────────────────────────╮
// FlatMap                                         │
//                                                 │   
// Flat forEach children implementation
// - Inspired by [https://www.npmjs.com/package/react-keyed-flatten-children]
// - Key prefix is needed because child of fragment does not add the fragment's key. Therefore it has to be added manually.
// - Doesn't handle async components properly. This is a weakness in React's part
export function flatForEach(
  children: ReactNode,
  callback: (child: FlatMapReactNode, index: number) => void,
  keyPrefix: string = ""
) {
  Children
    .toArray(children)
    .forEach((child, index) => {
      if (isFragment(child))
        flatForEach(
          child.props.children,
          callback,
          keyPrefix + child.key
        )
      else if (!isValidElement(child))
        callback(child as FlatMapReactNode, index)
      else
        callback(cloneElement(child, { key: keyPrefix + (child.key) }) as FlatMapReactNode, index)
    })
}

export function flatMap<T>(
  children: ReactNode,
  mapFn: (child: FlatMapReactNode, index: number) => T
) {
  const arr: T[] = []
  flatForEach(children, (child, index) => arr.push(mapFn(child, index)))
  return arr
}

export type ReactElementFromFlatMap
  = ReactElement<Record<string, any>> & { key: string }

export type FlatMapReactNode
  = Exclude<ReactNode,
    | null
    | undefined
    | boolean
    | Iterable<ReactNode>
    | ReactElement // filter out these types
    | Promise<ReactNode>
  >
  | string
  | Pretty<ReactElementFromFlatMap> // ReactElement<Record<string, any>> & { key: string }
  | ReactPortal
// all child in flatMap are assumed
//  to be ReactElement with key due to Children.toArray()

export type FlatMapReactNodePrimitive =
  | string
  | number
  | bigint


//─────────────────────────────────────────────────╮
// cloneElement helpers                            │
//                                                 │  
export type ReactElementWithStandardProps<
  P extends Record<string, any> = Record<string, any>,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
> = ReactElement<P, T>


export type ReactElementWithKey<
  P extends Record<string, any> = Record<string, any>,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
> = Omit<ReactElementWithStandardProps<P, T>, 'key'> & { key: string }


export function clone<
  E extends ReactElementWithStandardProps,
>(
  element: E,
  props?: Record<string, any>
) {
  return cloneElement(element, props) as E
}

export function cloneWithMergedRef<
  E extends ReactElementWithStandardProps,
  R extends Ref<unknown>
>(
  element: E,
  ref: R,
  props?: Record<string, any>
) {
  // Todo: merge ref too from incoming children with this ref.

  // Goofy type casting since ReactElement has a Prop generic and we are just adding on the end of it
  return cloneElement(element, { ref, ...props }) as
    Pretty<E & { props: E['props'] & { ref: R } }>
}

export function cloneWithStyle<
  E extends ReactElementWithStandardProps
>(
  element: E,
  style: CSSProperties
) {
  return cloneElement(element, { style }) as E
}

export function filterNodeByKey<T>(node: T[], key: string) {
  return node.filter(n => isValidElement(n) ? n.key !== key : true)
}


export function createProp<P extends Record<string, any>>(init?: P) {
  return {} as P & Record<string, any>
}

