"use client"

import { useEffect, useRef, useState } from "react"

export default function Page() {

  const [count, setCount] = useState({ val: 0 })
  const countRef = useRef(count)

  useEffect(() => {
    countRef.current = count
    setTimeout(() => {
      console.log("Count:", countRef.current)
    }, 5000)
  }, [count])

  return (
    <>
      <h1>Count: {count.val}</h1>
      <button onClick={() => setCount(prev => ({ val: prev.val + 1 }))}>Increment</button>
    </>
  )
}