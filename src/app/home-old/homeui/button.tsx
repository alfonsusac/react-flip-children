import { cn } from "lazy-cn";
import type { ComponentProps } from "react";

export function Button(
  { className, ...props }: ComponentProps<"button">
) {
  return (
    <button
      className={cn(
        "p-2 px-6 text-lg rounded-md font-bold",
        "transition-all",
        "border border-[#5b482722]",
        "shadow-[inset_0px_-1rem_2rem_0px_#5b482711]",
        "hover:brightness-110",
        "transition-transform",
        "active:scale-105",
        className,
      )}
      {...props}
    />
  )
}