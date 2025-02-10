import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";

type Pretty<T>
  = T extends object ? { [K in keyof T]: T[K] } : T;

type Callback<Ret = void>
  = (child: FlatMapReactNode, index: number) => Ret

type StandardProps
  = Record<string, any>

type FlatMapReactNode =
  | Exclude<ReactNode,
    | null                // null is skipped in Children array methods
    | undefined           // undefined is also skipped 
    | boolean             // boolean is also skipped
    | Iterable<ReactNode> // Iterable is unwrapped
    | ReactElement        // ReactElement is replaced with Pretty<ReactElement>
    | Promise<ReactNode>  // Promise is converted into lazy exotic component
  >
  | string
  | ReactPortal
  | Pretty<ReactElement<StandardProps> & { key: string }> //  All element in flatMap are assumed to be ReactElement with key due to Children.toArray()


// Flat forEach children implementation
// - Inspired by [https://www.npmjs.com/package/react-keyed-flatten-children]
// - Key prefix is needed because child of fragment does not add the fragment's key. Therefore it has to be added manually.
// - Doesn't handle async components properly. This is a weakness in React's part

function flatForEach(
  children: ReactNode,
  callback: Callback,
  predecessorKey: string = ""
) {
  Children
    .toArray(children)
    .forEach((child, index) => {
      if (isFragment(child)) {
        flatForEach(
          child.props.children,
          callback,
          predecessorKey + child.key
        )
      } else {
        const element = isValidElement(child)
          ? cloneElement(child, { key: predecessorKey + child.key })
          : child
        callback(
          element as FlatMapReactNode,
          index
        )
      }
    })
}
export function flatForEachPreserveKey(
  children: ReactNode,
  callback: Callback,
) {
  Children
    .forEach(children, (child, index) => {
      if (isFragment(child)) {
        flatForEachPreserveKey(
          child.props.children,
          callback
        )
      }
      callback(
        child as FlatMapReactNode,
        index
      )
    })
}

export function flatMap<T>(
  children: ReactNode,
  callback: Callback<T>,
  strictlyUnique: boolean = false
) {
  const arr: T[] = []
  const flat = strictlyUnique
    ? flatForEachPreserveKey
    : flatForEach
  flat(
    children,
    (child, index) => arr.push(callback(child, index))
  )
  return arr
}













function isFragment(child: ReactNode): child is ReactElement<{ children?: ReactNode }> {
  return _isFragment(child)
}