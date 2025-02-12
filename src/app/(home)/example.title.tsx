import { useEffect, useRef, useState } from "react"
import { AnimateChildren } from "../../../lib/AnimateChildren/src"

const title = "Animate Children with Ease"

export function TitleExample() {

  const [arrs, setArrs] = useState(
    [...Array.from({ length: title.split('').length }, (_, i) => i)]
  )

  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const shuffle = () => {
    // shuffle
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setArrs(prev => prev.toSorted(() => Math.random() - 0.5))
    const timeout = setTimeout(() => {
      setArrs(prev => prev.toSorted((a, b) => a - b))
    }, 1000)
    timeoutRef.current = timeout
  }

  useEffect(() => {
    // @ts-expect-error Exposing setCount to window
    window.shuffle = shuffle; // Exposing setCount to window
    return () => {
      // @ts-expect-error Exposing setCount to window
      delete window.shuffle; // Cleanup on unmount
    };
  }, []);

  return (
    <>
      <AnimateChildren>
        {
          arrs.map((i) => (
            <span
              key={i}
              className="inline-block whitespace-pre"
              onClick={() => { }}
            >
              {title[i]}
            </span>
          ))
        }
      </AnimateChildren>
    </>
  )
}