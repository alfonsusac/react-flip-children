import { useEffect } from "react";

export function useKeycap(
  key: string,
  id: string,
  onDown?: () => void,
  onUp?: () => void,
) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === key) {
        onDown?.()
        const el = document.getElementById(id)
        el?.setAttribute("data-pressed", "true")
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === key) {
        onUp?.()
        const el = document.getElementById(id)
        el?.setAttribute("data-pressed", "false")
      }
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  })
}