"use client"
import { Children, cloneElement, createRef, isValidElement, useEffect, useState, type ReactNode } from "react";

export function ChildrenPromiseTest(
  props: {
    children: ReactNode
  }
) {
  const [rendered, setRendered] = useState<ReactNode>()

  // const mapRef = useRef<Map<number, ReactNode>>()

  useEffect(() => {

    console.log("----- start ------")

    const newRender: ReactNode[] = []
    // const newRender: ReactNode[] = Children.toArray(props.children)

    console.log(props.children)

    // if (Array.isArray(props.children)) {
    //   console.log("Array")
    //   props.children.forEach(child => {
    //     if (!isValidElement(child)) {
    //       newRender.push(child)
    //       console.log("Not valid element", child)
    //       return
    //     }
    //     // const el = cloneElement(child)
    //     // newRender.push(el)
    //     console.log("valid element", child)
    //     newRender.push(child)
    //     return
    //   })
    // } else {
    //   console.log("Not Array")

    //   if (!isValidElement(props.children)) {
    //     newRender.push(props.children)
    //     console.log("Not valid element", props.children)
    //   }
    //   // const el = cloneElement(props.children)
    //   // newRender.push(el)
    //   console.log("valid element", props.children)
    //   newRender.push(props.children)
    // }

    Children.forEach(props.children, child => {
      if (!isValidElement(child)) {
        newRender.push(child)
        console.log("Not valid element", child)
        return
      }
      // const el = cloneElement(child)
      // newRender.push(el)
      console.log("valid element", child)
      newRender.push(child)
      return
    })

    console.log("Children", props.children)
    console.log("NewRendr", newRender)

    setRendered(newRender)

  }, [props.children])

  return rendered ?? props.children
}