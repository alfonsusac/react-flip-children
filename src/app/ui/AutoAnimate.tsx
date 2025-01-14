import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { ComponentProps } from 'react'

export function AutoAnimate(
  props: {
    children?: React.ReactNode,
    props?: Omit<ComponentProps<'div'>, "children">,
    useAutoAnimateOptions?: Parameters<typeof useAutoAnimate>[0]
  }
) {
  const [parent, enableAnimations] = useAutoAnimate(props?.useAutoAnimateOptions)
  return (
    <div {...props?.props} ref={parent}>{props.children}</div> 
  )
}