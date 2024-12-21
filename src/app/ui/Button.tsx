import { cn } from "lazy-cn";
import type { ComponentProps } from "react";

export function Button({ className, onMouseDown, ...props }: ComponentProps<"button">) {
  return (
    <button
      onMouseDown={(e) => {
        e.currentTarget.animate([
          { "outlineWidth": "0px", "outlineColor": "#fff2" },
          { "outlineWidth": "24px", "outlineColor": "#fff3" },
          { "outlineWidth": "48px", "outlineColor": "#fff0" },
        ], {
          duration: 300,
          easing: "ease-in",
        })
        if (onMouseDown) {
          onMouseDown(e)
        }
      }}

      className={cn(
      "p-2.5 px-6 rounded-md  font-semibold border border-white/50 bg-zinc-950",
      "hover:brightness-150",
      "transition-all",
      "outline outline-1 outline-transparent"
      , className)} {...props}
    />
  )
}