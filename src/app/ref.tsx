import { useEffect, useRef, version, type ComponentProps, type ComponentPropsWithoutRef, type Ref, type RefCallback, type RefObject } from "react";


type Pretty<T> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;


type OutRefObject<in out T> = { current: T | null }
type OutRefCallback<in out T> = (node: T | null) => void

export function createMergedRef<A, B>(
  passedDownRef: Ref<A>,
  localRef: RefObject<B>,
): RefCallback<A & B> {
  const mergedRef = (node: A & B) => { }
  return mergedRef
}

type createMergedRefType<in T> = (
  passedDownRef: NoInfer<Ref<T>>,
  localRef: NoInfer<RefObject<T>>,
) => RefCallback<T>


// Tests
type R1 = Ref<Pick<HTMLDivElement, "animate">>
type R2 = RefObject<HTMLDivElement>

const merged = createMergedRef(
  {} as R1,
  {} as R2,
)


// V2

export function createMergedRef2<Dest>(
  r1: (node: Dest) => void,
  r2: (node: Dest) => void
) {
  return (node: Dest) => {
    r1(node)
    r2(node)
  }
}

