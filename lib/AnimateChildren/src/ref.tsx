import { type Ref } from "react";

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
