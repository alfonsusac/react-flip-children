import { Children, cloneElement, createRef, isValidElement, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";

export function ReorderArray(props: {
  children: ReactNode,
  fixedSpeed?: boolean,
}) {
  const children = props.children
  const [renderedChildren, setRenderedChildren] = useState<ReactNode>()
  const rectRef = useRef<Record<string, {
    y: number,
    x: number,
    width: number,
    height: number
  }>>({})

  // 0. Inject refs to rendered children
  const renderedChildrenRefs = useRef<Record<string, RefObject<HTMLElement | null>>>({})
  const renderedChildrenWithRef = Children.map(renderedChildren, (child) => {
    if (!isValidElement(child) || !child.key || typeof child.key !== "string") return child
    const key = child.key
    const ref = renderedChildrenRefs.current[key] = createRef<HTMLElement>()
    const element = cloneElement(child, {
      // @ts-expect-error (ref is a valid prop)
      ref,
      key
    })
    return element
  })

  useEffect(() => {
    // On children change,
    // 1. Capture current pos using renderedChildrenRefs and store it to yPosRef
    Object.entries(renderedChildrenRefs.current).forEach(([key, child]) => {
      const ref = child.current
      if (!ref) return
      const rect = ref.getBoundingClientRect()
      rectRef.current[key] = {
        y: rect.y,
        x: rect.x,
        width: rect.width,
        height: rect.height
      }
    })

    // 2. Set renderedChildren to new children
    setRenderedChildren(children)

  }, [children])

  useLayoutEffect(() => {
    // On next render, (with renderedChildren already injected with refs)
    // 3. add style of prev dimension using renderedChildrenRefs
    Object.entries(renderedChildrenRefs.current).forEach(([key, child]) => {
      const ref = child.current
      if (!ref) return

      const animations = child.current!.getAnimations()
      animations.forEach(anim => anim.cancel())

      // using FLIP technique
      const prev = rectRef.current[key]
      if (!prev) return
      const curr = child.current!.getBoundingClientRect()

      // const prevY = rectRef.current[key]?.y  // First
      // const currY = child.current!.getBoundingClientRect()?.y // Last
      const deltaY = prev.y - curr.y // (find the difference)
      const deltaX = prev.x - curr.x // (find the difference)
      // const deltaWidth = prev.width / curr.width // (find the difference)
      // const deltaHeight = prev.height / curr.height // (find the difference)

      child.current!.animate(
        [
          // Invert (start from prev)
          {
            transform: `translateY(${ deltaY }px) translateX(${ deltaX }px)`,
            transformOrigin: `${ (prev.x - curr.x) + prev.width / 2 }px ${ (prev.y - curr.y) + prev.height / 2 }px`,
          },
          { filter: `blur(${ Math.abs((deltaY + deltaX) / 120) }px)`, rotate: `${ (-deltaX) / 20 }deg` },
          // (ends in now)
          {
            transform: 'translateY(0px) translateX(0px) scale(1, 1)',
            transformOrigin: `${ (curr.x - curr.x) + curr.width / 2 }px ${ (curr.y - curr.y) + curr.height / 2 }px`,
          }
        ],
        {
          duration: !props.fixedSpeed ? 300 : Math.abs((deltaY + deltaX) / 40) * 40,
          iterations: 1,
          easing: 'ease-out',
        }
      )

    })
  }, [renderedChildren])

  return <>{renderedChildrenWithRef}</>

}