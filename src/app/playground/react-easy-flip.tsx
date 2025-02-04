import { linear } from "react-easy-flip";
import { cubicBezier } from "motion";

export function getReactEasyFlipEasing(
  easing: string,
  onError?: (error: unknown) => void
): (num: number) => number {
  try {
    if (easing === "linear")
      return linear
    if (easing.startsWith("linear("))
      return linear // Not implemented yet


    if (easing === "ease")
      return cubicBezier(0.25, 0.1, 0.25, 1)
    if (easing === "ease-in")
      return cubicBezier(0.42, 0, 1, 1)
    if (easing === "ease-out")
      return cubicBezier(0, 0, 0.58, 1)
    if (easing === "ease-in-out")
      return cubicBezier(0.42, 0, 0.58, 1)  
    if (easing.startsWith("cubic-bezier(")) {
      const [_, x1, y1, x2, y2] = easing.match(/cubic-bezier\(([^,]+),([^,]+),([^,]+),([^,]+)\)/) as string[]
      return cubicBezier(parseFloat(x1), parseFloat(y1), parseFloat(x2), parseFloat(y2))
    }

    if (easing === "step-start")
      return () => 1
    if (easing === "step-end")
      return () => 0
    if (easing.startsWith("steps(")) {
      return linear // Not implemented yet
    }

  } catch (error) {
    onError?.(error)
  }
  return linear
}

