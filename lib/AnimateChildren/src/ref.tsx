import { type Ref, type RefObject } from "react";

export function mergeRef<T>(
  ...refs: Ref<T>[]
) {
  return (node: T | null) => {
    const cleanups = refs.map(ref => {
      if (ref == null) {
        return { cleanup: undefined, ref }
      } else if (typeof ref === "function") {
        return { cleanup: ref(node), ref }
      } else {
        ref.current = node
        return { cleanup: undefined, ref }
      }
    })

    return () => {
      cleanups.forEach(({ cleanup, ref }) => {
        if (cleanup) {
          cleanup()
        } else if (typeof ref === "function") {
          ref(null)
        } else if (ref) {
          ref.current = null
        }
      })
    }
  }
}

export function mergeRefOld<T>(
  passedRef: Ref<T>,
  innerRef: RefObject<T | null>
) {
  return (node: T | null) => {
    innerRef.current = node
    let cleanup: (() => void) | void = undefined
    if (passedRef) {
      if (typeof passedRef === "function") {
        cleanup = passedRef(node)
      } else {
        passedRef.current = node
      }
    }
    return () => {
      innerRef.current = null
      if (passedRef) {
        if (typeof cleanup === "function") {
          cleanup()
        } else if (typeof passedRef === "function") {
          passedRef(null)
        } else {
          passedRef.current = null
        }
      }
    }
  }

}


// type OutRefObject<in out T> = { current: T | null }
// type OutRefCallback<in out T> = (node: T | null) => void


// function createMergedRef<T>(
//   ...refCb: ((node: T) => (void | (() => void)))[]
// ) {
//   return (node: T) => {
//     const cleanups: (void | (() => void))[] = []
//     refCb.forEach(cb => cleanups.push(cb(node)))
//     return () => {
//       cleanups.forEach(cleanup => cleanup && cleanup())
//     }
//   }
// }

// const genericRef = useRef<{ animate: HTMLElement['animate'] }>(null)
// const preciseRef = useRef<HTMLDivElement>(null)
// const derivedRef = useRef<HTMLDivElement & { hello: string }>(null)


// const merged = createMergedRef<HTMLDivElement>(
//   (node) => {
//     genericRef.current = node
//     return () => genericRef.current = null
//   },
//   (node) => {
//     preciseRef.current = node
//     return () => preciseRef.current = null
//   },
//   (node) => {
//     derivedRef.current = node
//     return () => derivedRef.current = null
//   }
// )


// // Test

// type R_Generic = Ref<{ animate: HTMLElement['animate'] }>
// type R_Precise = Ref<HTMLDivElement>
// type R_Derived = Ref<HTMLDivElement & { hello: string }>

// // const merged = createMergedRef(
// //   {} as R1,
// //   {} as R2,
// // )

// // Covariant: child is a subtype of parent and child is assignable to parent
// type IsCovariant<Parent, Child> = Child extends Parent ? true : false;

// // Contravariant: child is a subtype of parent and parent is assignable to child
// type IsContravariant<Parent, Child> = Parent extends Child ? false : true;

// type Parent = { name: string };
// type Child = { name: string; age: number };

// type TestCovariance = IsCovariant<Parent, Child>; // false
// type TestCovariance2 = IsCovariant<Child, Parent>; // true

// type TestContravariance = IsContravariant<Parent, Child>; // false
// type TestContravariance3 = IsContravariant<Parent, Parent>; // false
// type TestContravariance2 = IsContravariant<Child, Parent>; // true 