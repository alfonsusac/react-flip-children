/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneElement, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal } from "react";
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

export type AnimationTime = (null | CSSNumberish)


//─────────────────────────────────────────────────╮
// cloneElement helpers                            │
//                                                 │  
export type ReactElementWithStandardProps<
  P extends Record<string, any> = Record<string, any>,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
> = ReactElement<P, T>

export function clone<
  E extends ReactElementWithStandardProps,
  P extends Record<string, any>
>(
  element: E,
  props?: P
) {
  return cloneElement(element, props) as Pretty<E & { props: E['props'] & P }>
}