import { useRef } from "react";

export function useRefMap<T>(
  defaultValues: () => T
) {
  const ref = useRef(new Map<string, T>())
  return {
    getOrAdd:
      (key: string): [entry: T, isNew: boolean] => {
        const existing = ref.current.get(key)
        if (existing) return [existing, false]
        const newEntry = defaultValues()
        ref.current.set(key, newEntry)
        return [newEntry, true]
      },
    get:
      (key: string) => ref.current.get(key),
    forEach:
      (...args: Parameters<Map<string, T>['forEach']>) => ref.current.forEach(...args),
    delete:
      (key: string) => ref.current.delete(key),
    current: ref.current,
  }
}

// getOrAdd()
//  Would it be better to have the ref already attached to the element?
//  Answer: No, because we need to attach the ref.
//  There are no other ways to ensure that the ref is already attached to the element.
//  Therefore, do not use .getOrAdd() if you don't plan to attach the ref to the element.

// get()
// Error should be handled gracefully here.
// What happens if we're not in the cloneElement phase but the key doesn't exist?
// We shouldn't throw error here because we're not sure if the key is valid.
// And we have no way to ensure that the keys are synchronized to the elements being rendered.
// We also shouldn't throw because it is better to have a fallback than to crash the app.