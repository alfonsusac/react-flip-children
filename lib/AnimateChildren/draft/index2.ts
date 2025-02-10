// "use client"

// import { Children, cloneElement, createRef, isValidElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, type Ref, type RefCallback, type RefObject } from "react"
// import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";
// import { flatMap } from "./flatMap";


// type Pretty<T> = T extends object
//   ? { [K in keyof T]: T[K] }
//   : T;


// function useRefMap<T extends { ref: RefObject<any> }>() {
//   const ref = useRef<Map<string, T>>(new Map())
//   return {
//     getOrAdd:
//       (key: string): [entry: T, isNew: boolean] => {
//         const existing = ref.current.get(key)
//         if (existing) return [existing, false]
//         const newEntry = { ref: createRef() } as T
//         ref.current.set(key, newEntry)
//         return [newEntry, true]
//       },
//     get:
//       (key: string) => ref.current.get(key),
//     forEach:
//       (...args: Parameters<Map<string, T>['forEach']>) => ref.current.forEach(...args),
//     delete:
//       (key: string) => ref.current.delete(key),
//     [Symbol.iterator]:
//       () => ref.current[Symbol.iterator]()
//   }
// }
// function useObject<T extends object>(defaultObj?: T) {
//   const ref = useRef(defaultObj ?? {})
//   return ref.current as T
// }



// function isPortal(child: ReactNode): child is ReactPortal {
//   return _isPortal(child)
// }
// function isRefCallback<T>(ref: Ref<T>): ref is RefCallback<T> {
//   return typeof ref === "function"
// }
// function isRefObject<T>(ref: Ref<T>): ref is RefObject<T | null> {
//   return !!ref && "current" in ref
// }
// function isReact19RefCallbackCleanUpFunction<T>(refReturn: void | (() => void)): refReturn is (() => void) {
//   return typeof refReturn === "function"
// }
// type ReactElementWithStandardProps<
//   P extends Record<string, any> = Record<string, any>,
//   T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
// > = ReactElement<P, T>
// function clone<
//   E extends ReactElementWithStandardProps,
// >(
//   element: E,
//   props?: Record<string, any>
// ) {
//   return cloneElement(element, props) as E
// }
// function cloneElementWithRef<
//   E extends ReactElement<Record<string, any>>,
//   R extends RefObject<unknown>,
//   T extends R['current']
// >(
//   element: E,
//   ref: R,
//   props?: Record<string, any>
// ) {
//   const passedDownRef = 'ref' in element.props ? element.props.ref : null
//   const mergedRef
//     = passedDownRef ?
//       (node: T) => {
//         if (isRefCallback(passedDownRef)) {
//           const cleanup = passedDownRef(node)
//           ref.current = node
//           return () => {
//             if (isReact19RefCallbackCleanUpFunction(cleanup)) {
//               cleanup()
//             } else {
//               passedDownRef(null)
//               ref.current = null
//             }
//           }
//         }
//         if (isRefObject(passedDownRef)) {
//           passedDownRef.current = node
//           ref.current = node
//           return () => {
//             passedDownRef.current = null
//             ref.current = null
//           }
//         }
//         ref.current = node
//         return () => ref.current = null
//       }
//       : ref

//   return cloneElement(element, { ...props, mergedRef }) as Pretty<
//     E & { props: E['props'] & { ref: R } }
//   >
// }




// type AnimatableElement =
//   | Pick<HTMLElement,
//     | "animate"
//     | "getAnimations"
//     | "getBoundingClientRect"
//     | "dataset"
//     | "removeAttribute"
//     | "parentElement"
//     | "offsetTop"
//     | "offsetLeft"
//     | "offsetWidth"
//     | "offsetHeight">

// type AnimationTime =
//   | null | CSSNumberish

// type AnimatableElementRef =
//   | RefObject<AnimatableElement | null>

// type ProcessedReactElement =
//   | ReactElement<{ ref: Ref<AnimatableElement> }> & { key: string }

// type ValidNode =
//   | string | number | bigint
//   | ReactPortal | ProcessedReactElement

// function isValidRenderedChild(child: ValidNode): child is ProcessedReactElement {
//   return isValidElement(child)
//     && child.key !== null
//     && !isPortal(child)
// }

// type SavedChildData = {
//   ref: AnimatableElementRef,
//   rect?: {
//     x: number,
//     y: number,
//   },
//   scale?: {
//     width: number,
//     height: number,
//   }
//   order?: number,
//   adding?: boolean,
//   deleting?: boolean,
//   cssAnimationTimes?: AnimationTime[]
// }

// const subtractRect
//   = (a: DOMRect, b: DOMRect) => ({ x: a.x - b.x, y: a.y - b.y })

// const isCSSAnimation
//   = (a: Animation): a is CSSAnimation => a instanceof CSSAnimation

// const isFlipMoveAnimation
//   = (a: Animation): boolean => a.id.startsWith("__react-flip-children-move-animation")

// const filterNodeByKey
//   = <T>(node: T[], key: string) => node.filter(n => isValidElement(n) ? n.key !== key : true)

// type AnimateChildrenProps = {
//   /** The strategy to use when animating children. */
//   children?: ReactNode
//   duration?: number
//   easing?: string
//   stagger?: number
//   delayDeletion?: number
//   strictKeys?: boolean,
//   strategy?: "continuous" | "interrupt" | "reset"
//   useAbsolutePositionOnDelete?: boolean
//   disableScaleAnimation?: boolean
//   disableParentAnimation?: boolean
//   disableAnimationReconciliation?: boolean
// }

// function initOptions(props: AnimateChildrenProps) {
//   return {
//     children: null,
//     duration: 500,
//     easing: "ease-out",
//     stagger: 0,
//     delayDeletion: 500,
//     strategy: "continuous",
//     strictKeys: false,
//     disableScaleAnimation: false,
//     disableParentAnimation: false,
//     useAbsolutePositionOnDelete: false,
//     disableAnimationReconciliation: false,
//     ...props,
//   } satisfies Required<AnimateChildrenProps>
// }

// function AnimateChildren(props: AnimateChildrenProps) {
//   const opts = initOptions(props)
//   const children = opts.children

//   const [rendered, setRendered] = useState<ValidNode[]>([])
//   const data = useRefMap<SavedChildData>()
//   const parent = useObject({
//     node: undefined as undefined | AnimatableElement,
//     rect: undefined as undefined | DOMRect,
//     saveNode: (node: AnimatableElement | null) => {
//       parent.node = node ?? parent.node
//       if (parent.node) parent.rect = parent.node.getBoundingClientRect()
//       return parent.node
//     },
//   })
//   const saveChildData = (entry: SavedChildData) => {
//     const node = entry.ref.current
//     if (!node) return

//     if (opts.strategy === "interrupt" && parent.rect) {
//       const rect = node.getBoundingClientRect()
//       entry.rect = subtractRect(rect, parent.rect)
//       entry.scale = { width: rect.width, height: rect.height }
//     } else {
//       entry.rect = { x: node.offsetLeft, y: node.offsetTop }
//       if (!opts.disableScaleAnimation) {
//         entry.scale = { width: node.offsetWidth, height: node.offsetHeight, }
//       }
//     }

//     if (opts.disableAnimationReconciliation) return

//     entry.cssAnimationTimes = node.getAnimations()
//       .filter(isCSSAnimation)
//       .map(a => a.currentTime) // Only save CSSAnimation times because CSSTransition can't be persisted
//   }

//   // On incoming children change
//   useEffect(() => {
//     const keys = new Set<string>()
//     let keylessCount = 0

//     const newRender = flatMap<ValidNode>(
//       children,
//       (child) => {
//         if (!isValidElement(child) || isPortal(child))
//           return child

//         const key = child.key ?? `____` + keylessCount++
//         keys.add(key)

//         const [entry, isNew] = data.getOrAdd(key)

//         if (entry.deleting)
//           delete entry.deleting

//         const modifiedProps: Record<string, any> = { key }
//         if (isNew) {
//           modifiedProps["data-adding"] = ''
//           entry.adding = true
//         }
//         return cloneElementWithRef(
//           child,
//           entry.ref,
//           { key }
//         )
//       },
//       opts.strictKeys
//     )

//     let staggerElementCount = 0                     // For stagger: To save the order of the elements in previous order before changed to new order
//     let tempParent: AnimatableElement | undefined   // For parent: Temporarily store parent in this cycle to save the parent node and rect only once
//     const deletingKeys: string[] = []               // For deletion: To store keys that are not in the new render for delete animation using one setTimeout

//     rendered.forEach(
//       (child, index) => {
//         if (!isValidRenderedChild(child))
//           return

//         const entry = data.get(child.key)
//         if (!entry?.ref.current) return
//         const node = entry.ref.current

//         tempParent ??= parent.saveNode(node.parentElement)
//         saveChildData(entry)

//         if (!opts.delayDeletion)
//           return // If deletion is instant, skip exit animations

//         if (keys.has(child.key)) {
//           entry.order = staggerElementCount++
//           return // Filter for deleted keys
//         }

//         const props: Record<string, any> = { "data-deleting": "" }
//         if (opts.useAbsolutePositionOnDelete && entry.rect) {
//           props.style = {
//             position: "absolute",
//             top: entry.rect.y,
//             left: entry.rect.x,
//           } satisfies CSSProperties
//         }

//         newRender.splice(index, 0, clone(child, props))   // Re-add the deleted elements back in the children with "data-deleting" props.

//         if (entry.deleting) return                        // Schedule deletion ideally after animation completes but ONLY if existing timeout hadn't been run yet
//         deletingKeys.push(child.key)
//         entry.deleting = true

//       }
//     )

//     setRendered(newRender)

//     setTimeout(() => {
//       tempParent = undefined
//       for (let [key, entry] of data) {
//         if (!entry?.ref.current) continue
//         const node = entry.ref.current
//         tempParent ??= parent.saveNode(node.parentElement)
//         saveChildData(entry)
//         if (!entry.deleting) continue
//         setRendered(prev => filterNodeByKey(prev, key))
//         data.delete(key);
//       }

//     }, opts.delayDeletion)

//   }, [children])
//   // End of 1st Use Effect

//   // On rendered children change before repaint
//   useLayoutEffect(() => {
//     const animationQueue: any[] = []
//     rendered.forEach(
//       child => {
//         if (!isValidRenderedChild(child))
//           return

//         const entry = data.get(child.key)
//         if (!entry?.ref.current) return
//         const node = entry.ref.current

//         let hasPrevAnimation = false // For CSSAnimation: To check if there is a previous animation

//         // Reconcile CSSAnimation from previous cycle.
//         //   Assume that the CSSAnimation order is the same before and after setRendered
//         if (opts.stagger || !opts.disableAnimationReconciliation) {
//           node
//             .getAnimations()
//             .filter(
//               a => {
//                 if (opts.strategy === "interrupt" && isFlipMoveAnimation(a)) {
//                   a.cancel()
//                   return false
//                 }
//                 if (opts.stagger && isFlipMoveAnimation(a)) {
//                   const delay = Number(a.id.split('+delay=')[1])
//                   const currentTime = Number(a.currentTime)
//                   if (delay > currentTime) {
//                     a.currentTime = delay
//                   }
//                   hasPrevAnimation = true
//                 }
//                 if (opts.disableAnimationReconciliation)
//                   return false
//                 if (isCSSAnimation(a))
//                   return true
//               })
//             .forEach(
//               (a, i) => a.currentTime = entry.cssAnimationTimes?.[i] ?? 0
//             )
//         }

//         // Animate Movement
//         const prevRect = entry.rect
//         if (!prevRect) return

//         const prevScale = entry.scale

//         let currRect: { x: number, y: number }
//         let currScale: { width: number, height: number } | undefined = undefined

//         if (opts.strategy === "interrupt" && parent.rect) {
//           const rect = node.getBoundingClientRect()
//           currRect = subtractRect(rect, parent.rect)
//           currScale = { width: rect.width, height: rect.height }
//         } else {
//           currRect = { x: node.offsetLeft, y: node.offsetTop }
//           if (!opts.disableScaleAnimation) {
//             currScale = { width: node.offsetWidth, height: node.offsetHeight, }
//           }
//         }


//         const deltaX = currRect.x - prevRect.x
//         const deltaY = currRect.y - prevRect.y
//         const deltaWidth = currScale && prevScale ? currScale.width - prevScale.width : 0
//         const deltaHeight = currScale && prevScale ? currScale.height - prevScale.height : 0

//         if (
//           !deltaX && !deltaY &&
//           (opts.disableScaleAnimation || (!deltaWidth && !deltaHeight))
//         ) return;

//         const delay = !hasPrevAnimation
//           ? (entry.order ?? 0) * opts.stagger
//           : 0

//         animationQueue.push({
//           node,
//           keyframes: [
//             {
//               ...(deltaX || deltaY) && {
//                 translate: `${ deltaX }px ${ deltaY }px`
//               },
//               ...(
//                 !opts.disableScaleAnimation
//                 && (deltaWidth || deltaHeight)
//                 && prevScale
//                 && currScale
//               ) && {
//                 scale: `${ prevScale.width / currScale.width } ${ prevScale.height / currScale.height }`
//               },
//             },
//             {
//               ...(deltaX || deltaY) && {
//                 translate: `0px 0px`
//               },
//               ...(
//                 !opts.disableScaleAnimation
//                 && (deltaWidth || deltaHeight)
//                 && prevScale
//                 && currScale
//               ) && {
//                 scale: `1 1`
//               },
//             }
//           ],
//           options: {
//             duration: opts.duration,
//             easing: opts.easing,
//             delay: delay,
//             fill: "both",
//             composite: opts.strategy === "reset"
//               ? "replace"
//               : "add",
//             id: "__react-flip-children-move-animation+delay=" + delay,
//           },
//           cancelOnFinish: true,
//         })
//       }
//     )


//   }, [rendered])


// }









// function mergeRef<
//   E extends Ref<any>,
//   R extends RefObject<unknown>,
//   T extends R['current']
// >(
//   passedDownRef: E,
//   ref: R,
//   props?: Record<string, any>
// ) {
//   const mergedRef
//     = passedDownRef ?
//       (node: T) => {
//         if (isRefCallback(passedDownRef)) {
//           const cleanup = passedDownRef(node)
//           ref.current = node
//           return () => {
//             if (isReact19RefCallbackCleanUpFunction(cleanup)) {
//               cleanup()
//             } else {
//               passedDownRef(null)
//               ref.current = null
//             }
//           }
//         }
//         if (isRefObject(passedDownRef)) {
//           passedDownRef.current = node
//           ref.current = node
//           return () => {
//             passedDownRef.current = null
//             ref.current = null
//           }
//         }
//         ref.current = node
//         return () => ref.current = null
//       }
//       : ref
//   return mergedRef
// }
