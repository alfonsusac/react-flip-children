import { cn } from "lazy-cn";
import type { ComponentProps } from "react";

export function Footer(
  { className, ...props }: ComponentProps<"footer">
) {
  return (
    <footer className={cn(
      "py-20 text-sm text-center opacity-60",
      className,
    )}>
      &copy; {new Date().getUTCFullYear()} Alfonsus Ardani. All rights reserved.
    </footer>
  )
}