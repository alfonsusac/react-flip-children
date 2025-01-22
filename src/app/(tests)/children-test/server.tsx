import type { ComponentProps } from "react"
import { Div } from "./ProcessChildren"

async function AsyncDiv(
  props: ComponentProps<"div">
) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return (
    <Div {...props} key={props.key} />
  )
}