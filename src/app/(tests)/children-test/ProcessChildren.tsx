"use client"

import { cloneElement, type ComponentProps, isValidElement, useState, type ReactNode, useRef, type RefObject, useEffect, Children, createRef, type ReactElement, type CSSProperties } from "react"
import { isFragment } from "react-is"
import { flatMap } from "../../../../lib/AnimateChildren/src/flatMap"

export function Div(props: ComponentProps<"div">) { return <div {...props} /> }

export function ProcessChildren(
  props: {
    children?: React.ReactNode
  }
) {

  const [rendered, setRendered] = useState<ReactNode[]>([])
  const refs = useRef<Map<string, RefObject<HTMLElement | null>>>(new Map())
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())
  useEffect(() => {

    const newKeys = new Set<string>()
    // const newRender: ReactNode[] = []
    // function flatForEach(
    //   children: ReactNode,
    //   callback: (child: ReactNode) => void,
    //   keyPrefix: string = ""
    //   // Key prefix is needed because child of fragment does not add the fragment's key. Therefore it has to be added manually.
    // ) {
    //   Children.toArray(children).forEach(child => {
    //     // console.log(child)
    //     if (isFragment(child)) {
    //       console.log("fragment found!!!")
    //       const props = child.props as { children?: ReactNode }
    //       return flatForEach(props.children, callback, keyPrefix + child.key)
    //     }
    //     if (!isValidElement(child))
    //       return callback(child)

    //     if (isLazy(child)) {
    //       console.log("LAZY", child)
    //       // console.log("lazy", child._owner)
    //       const el = cloneElement(child)
    //       // return callback(cloneElement(child, { key: keyPrefix + (child.key) }))
    //     }
    //     callback(cloneElement(child, { key: keyPrefix + (child.key) }))
    //   })
    // }

    const newRender = flatMap(props.children, (child) => {
      if (!isValidElement(child)) return child
      // console.log(typeof child.props, child.props)
      if (typeof child.props !== "object") throw new Error("Invalid props")

      // console.log("child", child.key, child.type)

      const ref = refs.current.get(child.key as string) ?? createRef()
      refs.current.set(child.key as string, ref)
      newKeys.add(child.key as string)

      clearTimeout(timeoutRefs.current.get(child.key as string))
      timeoutRefs.current.delete(child.key as string)

      return cloneElement(child as ReactElement<Record<string, unknown>>, { ref })
    })

    // console.log("NEW KEYS", newKeys)

    rendered.forEach((child, i) => {
      if (!isValidElement(child)) return
      if (isFragment(child) as boolean) return
      if (child.key === null) return
      if (newKeys.has(child.key)) return


      const props = child.props as { style?: CSSProperties }
      const el = cloneElement(child as ReactElement<Record<string, unknown>>, {
        style: { color: "yellow", ...props?.style } as CSSProperties,
      })

      // const timeout = setTimeout(() => {
      //   if (!timeoutRefs.current.has(el.key as string)) return
      //   setRendered(prev => prev.filter((child) => isValidElement(child) ? child.key !== el.key : true))
      //   timeoutRefs.current.delete(el.key as string)
      // }, 1000)
      // timeoutRefs.current.set(el.key as string, timeout)

      newRender.splice(i, 0, el)
    })



    // console.log(newRender?.map((el) => isValidElement(el) ? el.key : el?.toString()).join("\n"))



    setRendered(newRender)
  }, [props.children])

  return (
    <Div className="flex flex-col gap-4">
      <Div>
        PROCESSED <br />
        <Div className="*:p-2 *:inline-block relative">
          {rendered.length > 0 ? rendered : props.children}
        </Div>
      </Div>
      <Div>
        RAW <br />
        <Div className="*:p-2 *:inline-block relative">
          {props.children}
        </Div>
      </Div>
    </Div>
  )
}
