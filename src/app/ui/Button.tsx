import { cn } from "lazy-cn";
import type { ComponentProps } from "react";

export function Button({ className, onMouseDown, ...props }: ComponentProps<"button">) {
  return (
    <button
      onMouseDown={(e) => {
        e.currentTarget.animate([
          // { "outlineWidth": "0px", "outlineColor": "#fff2" },
          // { "outlineWidth": "24px", "outlineColor": "#fff3" },
          // { "outlineWidth": "48px", "outlineColor": "#fff0" },
        ], {
          duration: 300,
          easing: "ease-in",
        })
        if (onMouseDown) {
          onMouseDown(e)
        }
      }}
      className={cn(
        "h-16 px-7 rounded-lg  font-semibold tracking-wide text-sm",
        "flex items-center gap-2",
        "text-zinc-200/90",
        "transform-gpu",

        // "hover:brightness-150",
        "transition-all duration-[75ms]",
        // "active:brightness-90",
        "outline outline-0 outline-transparent",

        // "before:h-[120%]",
        "before:absolute",
        "before:-inset-[0px]",
        "before:rounded-[4px]",
        "before:transition-all",
        "before:duration-[75ms]",
        "before:blur-[0.4px]",
        // "before:top-[0.2rem]",
        "before:shadow-[inset_0px_1px_0_0_#fff2,_inset_0px_-1px_0_0_#000a]",
        "before:-z-10",
        "button-bg",

        "after:absolute",
        "after:inset-[6px]",
        "after:rounded-[16px]",
        "after:transition-all",
        "after:duration-[75ms]",
        "after:-z-10",
        "after:bg-gradient-to-t after:from-[#555555] after:to-[#4a4a4a]",
        // "after:active:from-[#4a4a4a] after:active:to-[#4a4a4a]",
        "after:shadow-[inset_0px_1px_0px_0_#fff1]",
        "after:blur-[0.4px]",

        "shadow-[0_0_4px_3px_#0008]",
        "active:shadow-[0_0_2px_1px_#0008]",
        "active:scale-[0.98]",
        "data-[pressed=true]:shadow-[0_0_2px_1px_#0008]",
        "data-[pressed=true]:scale-[0.98]",
        // "active:shadow-[0_0_2px_0px_#0008]",
        // "shadow-[0_19px_5px_2px_#0008]",
        // "active:shadow-[0_12px_5px_2px_#0008]",
        // "data-[pressed=true]:shadow-[0_12px_5px_2px_#0008]",
        // "data-[selected=true]:shadow-[0_14px_5px_2px_#0008]",
        // "active:data-[selected=true]:shadow-[0_12px_5px_2px_#0008]",
        // "data-[pressed=true]:data-[selected=true]:shadow-[0_12px_5px_2px_#0008]",

        // "translate-y-[-8px]",
        // "active:translate-y-[0px]",
        // "data-[pressed=true]:translate-y-[0px]",
        // "data-[selected=true]:translate-y-[-2px]",
        // "active:data-[selected=true]:translate-y-[0px]",
        // "data-[pressed=true]:data-[selected=true]:translate-y-[0px]",
        className)} {...props}
    />
  )
}

export function Button2({ className, onMouseDown, ...props }: ComponentProps<"button">) {
  return (
    <button
      onMouseDown={(e) => {
        e.currentTarget.animate([
        ], {
          duration: 300,
          easing: "ease-in",
        })
        if (onMouseDown) {
          onMouseDown(e)
        }
      }}

      className={cn(
        "p-2.5 px-6 rounded-md  font-semibold bg-[#E5E1D7] text-black/80",
        // "hover:brightness-75",
        "transition-all",
        "outline outline-1 outline-transparent",
        "translate-y-[-7px] ",
        "active:translate-y-0",
        "data-[selected=true]:translate-y-0",
        "shadow-[inset_0_5px_2.3px_0px_#FFFFFF,_inset_0_-5px_2.3px_0px_#CABFA3,_inset_5px_0_2.3px_0px_#CDC2A4,_inset_-5px_0_2.3px_0px_#CDC2A4,_0px_7px_0_0_#9d8e66]",
        "active:shadow-[inset_0_5px_2.3px_0px_#ffffffd2,_inset_0_-5px_2.3px_0px_#CABFA3,_inset_5px_0_2.3px_0px_#CDC2A4,_inset_-5px_0_2.3px_0px_#CDC2A4]",
        "data-[selected=true]:shadow-[inset_0_5px_2.3px_0px_#ffffffd2,_inset_0_-5px_2.3px_0px_#CABFA3,_inset_5px_0_2.3px_0px_#CDC2A4,_inset_-5px_0_2.3px_0px_#CDC2A4]",
        "active:bg-[#dfd9c9]"
        , className)} {...props}
    />
  )
}



