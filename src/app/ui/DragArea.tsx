import { useState, type ComponentProps } from "react";

export function DragArea(
  { onMoveRight, onMoveLeft, ...props }: ComponentProps<"div"> & {
    onMoveRight?: () => void
    onMoveLeft?: () => void
  }
) {
  // call onMoveRight when user drags X pixel to the right
  // call onMoveLeft when user drags X pixel to the left

  const [startX, setStartX] = useState<number | null>(null)




  return (
    <div
      onMouseDown={(e) => {
        setStartX(e.clientX)
      }}
      onMouseMove={(e) => {
        if (startX === null) return
        const diff = e.clientX - startX
        const threshold = 10
        if (diff > 0 && Math.abs(diff) > threshold) {
          onMoveRight?.()
          setStartX(e.clientX)
        } else if (diff < 0 && Math.abs(diff) > threshold) {
          onMoveLeft?.()
          setStartX(e.clientX)
        }
      }}
      onMouseUp={() => setStartX(null)}
      onMouseLeave={() => setStartX(null)}
      {...props}
    />
  )

}