import { Children, cloneElement, createRef, isValidElement, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type DetailedHTMLProps, type Dispatch, type HTMLAttributes, type ReactElement, type ReactNode, type RefObject, type SetStateAction } from "react";

export function ReorderArray(props: {
  children: ReactNode
  usingFixedSpeed?: boolean
  speed?: number
  duration?: number
  blur?: number
  animationOptions?: KeyframeAnimationOptions,
  exitAnimation?: [
    Keyframe[] | PropertyIndexedKeyframes | null,
    options?: Omit<KeyframeAnimationOptions, "duration"> & { duration: number }
  ]
  disableAnimation?: boolean,
  disableBlur?: boolean,
  disableRotation?: boolean,
  /** Good if array elements are absolutely positioned */
  deferElementDeletions?: boolean,
  delayEntryAnimation?: number | boolean,
}) {
  const children = props.children
  const [renderedChildren, setRenderedChildren] = useState<ReactNode>()
  const rectRef = useRef<Record<string, {
    y: number,
    x: number,
    width: number,
    height: number,
    rotate: string,
  }>>({})



  // 0. Inject refs to rendered children
  const renderedChildrenRefs = useRef<Record<string, RefObject<HTMLElement | null>>>({})
  const renderedChildrenWithRef = Children.map(renderedChildren, (child) => {
    if (!isValidArrayElement(child)) return child
    const key = child.key
    const ref = renderedChildrenRefs.current[key] = createRef<HTMLElement>()
    return cloneElement(child, { ...child.props, ref, key })
  })

  const renderNewChildren = (getNewChildren: SetStateAction<ReactNode>) => {
    // console.log("Saving previous state")
    // Save the current "animation" state
    // - This will be triggered on children change.
    // -  and when element finished animating, it will be removed from the children state.
    Object.entries(renderedChildrenRefs.current).forEach(([key, child]) => {
      const ref = child.current
      if (!ref) return
      const computed = getComputedStyle(ref)
      ref.style.rotate = "0deg" // might not need this
      const rect = ref.getBoundingClientRect()
      rectRef.current[key] = {
        y: props.disableRotation ? rect.y : rect.y + (rect.height / 2) - Number(computed.height.replace('px', '')) / 2,
        x: props.disableRotation ? rect.x : rect.x + (rect.width / 2) - Number(computed.width.replace('px', '')) / 2,
        width: rect.width,
        height: rect.height,
        rotate: props.disableRotation ? `0deg` : computed.rotate,
      }
    })
    // 3. Set renderedChildren to new children. This is from react's setter.
    setRenderedChildren(getNewChildren)
    // TODO - Should I delete ref keys here?
  }

  const deletedElements = useRef<Set<string>>(new Set())

  useEffect(() => {
    // console.log("first useEffect called")

    // Gather the keys from the incoming children
    const newChildrenKeys = new Set<string>()
    const newRender: ReactNode[] = []
    Children.forEach(children, (child) => {
      // Child key format = without .$
      if (!isValidArrayElement(child)) return
      newRender.push(child) // must be a valid child (needs key)
      if (newChildrenKeys.has(child.key)) throw new Error("Duplicate key found with key: " + child.key)
      newChildrenKeys.add(child.key)
    })

    // Mark deleted elements by comparing rendered with incoming children
    Children.forEach(renderedChildren, (renderedChild, index) => {
      // Child key format = without .$
      if (!isValidArrayElement(renderedChild)) return
      if (newChildrenKeys.has(renderedChild.key)) return
      // Rendered Child = not found in new children. What to do?
      const deletedRenderedChild = renderedChild
      const deletedKey = deletedRenderedChild.key


      // Get Data Deleting Prop from the rendered rendered child! not the rendered child (rendered child is the reference stored in react state. rendered rendered child is the actual reference in the DOM)
      const dataDeletingProp = renderedChildrenRefs.current[deletedKey].current?.getAttribute('data-deleting')
      if (dataDeletingProp === "done") {
        return
      }

      // console.log("Deleted Key", deletedKey, "Data Deleting Prop", dataDeletingProp, "Ref?", renderedChildrenRefs.current[deletedKey].current?.getAttribute('data-deleting'))
      // Recreate deleted elements with same key but with additional attribute
      const el = cloneElement(deletedRenderedChild, {
        ...(deletedRenderedChild.props as object),
        key: deletedKey,
        "data-deleting": dataDeletingProp ?? false, // to be set to true on next render,
      })

      newRender.splice(index, 0, el)

      // delete renderedChildrenRefs.current[deletedKey]
      delete rectRef.current[deletedKey]
    })

    // 2. Set renderedChildren to new children
    renderNewChildren(newRender)

  }, [children])

  useLayoutEffect(() => {
    console.log("second useEffect called")
    // For animating added elements
    const addedElementsRef: { ref: RefObject<HTMLElement | null>, key: string }[] = []

    // On next render, (with renderedChildren already injected with refs)
    // 3. add style of prev dimension using renderedChildrenRefs
    Object.entries(renderedChildrenRefs.current).forEach(([key, childRef]) => {
      const child = childRef.current
      if (!child) return

      const isDeleting = child.getAttribute('data-deleting')
      // console.log("data-deleting prop", key, isDeleting, typeof isDeleting)
      if (isDeleting) {
        if (isDeleting === 'true') return
        if (isDeleting === "done") {
          console.log("!! element should be deleted", key)
          return
        }
        child.setAttribute('data-deleting', 'true')
        deletedElements.current.add(key)
        const animation = child.animate(
          props.exitAnimation?.[0] ??
          [
            { opacity: 1 },
            { opacity: 0 }
          ],
          props.exitAnimation?.[1] ??
          {
            duration: 500,
            easing: 'ease-in-out',
            fill: 'both', // Add this to options
          }
        )
        animation.onfinish = (e) => {
          // console.log("Key", key, "Refs", renderedChildrenRefs.current[key])
          renderedChildrenRefs.current[key].current!.setAttribute('data-deleting', 'done')
          if (props.deferElementDeletions) return
          deletedElements.current.delete(key)
          if (deletedElements.current.size === 0)
            renderNewChildren(prev => {
              if (!prev) return prev
              return Children
                .toArray(prev)
                .filter(child => {
                  if (!isValidArrayElement(child)) return true

                  // console.log("Render New Children On Delete:", child.props['data-deleting'])
                  // This fixes the issue of not deleting the element after a quick succession of removal
                  // data-deleting should be "done" or "true" at this point.
                  console.log("Deleting Key", child.key, "Data Deleting Prop", child.props['data-deleting'])
                  if (child.props['data-deleting'] === false || child.props['data-deleting'] === "true") return false
                  if (stripKey(child.key) === key) return false
                  return true
                })
                .map(child => {
                  if (!isValidArrayElement(child)) return child
                  return cloneElement(
                    child,
                    {
                      ...(child.props as object),
                      key: stripKey(child.key),
                      ref: renderedChildrenRefs.current[stripKey(child.key)]
                    })
                })
            })
        }
        return
      }



      // 4. using FLIP technique, apply animation to each child
      const prev = rectRef.current[key]
      if (!prev) {
        child.setAttribute('data-adding', 'true')
        addedElementsRef.push({ ref: childRef, key })
        return
      }

      child.getAnimations().forEach(anim => {
        if (anim instanceof CSSTransition) return
        anim.cancel()
      })

      // console.log("Content: ", child.textContent, "Adding: ", child.getAttribute('data-adding'))

      // child.removeAttribute('data-adding')
      // child.removeAttribute('data-deleting')


      const curr = child.getBoundingClientRect()

      const deltaY = prev.y - curr.y // (find the difference)
      const deltaX = prev.x - curr.x // (find the difference)
      const scaleDiffX = prev.width - curr.width // (find the difference)
      const scaleDiffY = prev.height - curr.height // (find the difference)
      const distance = Math.sqrt(deltaY ** 2 + deltaX ** 2) // (find the distance)

      if (deltaY === 0 && deltaX === 0) return

      const duration = !props.usingFixedSpeed ? (props.duration ?? 500) : (distance / ((props.speed ?? 1)))

      // console.log("Duration", duration)
      // console.log("Duration", props.speed)

      child.animate(
        [
          {
            transform: `translateY(${ deltaY }px) translateX(${ deltaX }px)`,
            transformOrigin: `${ (prev.x - curr.x) + curr.width / 2 }px ${ (prev.y - curr.y) + curr.height / 2 }px`,
            ...props.disableRotation ? {} : { rotate: prev.rotate ?? `0deg` },
          },
          {
            ...props.disableBlur ? {} : { filter: `blur(${ (props.blur ?? 1) * Math.abs((deltaY + deltaX) / 120) }px)` },
            ...props.disableRotation ? {} : { rotate: `${ (-deltaX) / 20 }deg` },
          },
          {
            transform: 'translateY(0px) translateX(0px) scale(1, 1)',
            transformOrigin: `${ (curr.x - curr.x) + curr.width / 2 }px ${ (curr.y - curr.y) + curr.height / 2 }px`,
            ...props.disableRotation ? {} : { rotate: `0deg` }
          }
        ],
        {
          duration,
          easing: 'ease-in-out',
          fill: 'both',
          ...props?.animationOptions,
        }
      )
    })

    const exitAnimationDuration = props.exitAnimation?.[1]?.duration ?? 500

    addedElementsRef.forEach(childRef => {
      // console.log("Adding elements of key: ", childRef.key)
      setTimeout(() => {
        const node = renderedChildrenRefs.current[childRef.key]?.current
        if (!node) return
        node.removeAttribute('data-adding')
      }, 10 + (props.delayEntryAnimation === true ? exitAnimationDuration : (props.delayEntryAnimation || 0)))
    })

  }, [renderedChildren])

  return <>{renderedChildrenWithRef}</>

}


function stripKey(key: string) {
  return key.toString().replace(/^(\.\$)+/, '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidArrayElement(node: ReactNode): node is ReactElement & { key: string, props: Record<string, any> } {
  return isValidElement(node) && typeof node.key === "string" && !!node.key && typeof node.props === "object"
}
