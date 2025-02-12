import { cn } from "lazy-cn";
import type { ComponentProps } from "react";

export function Footer(
  { className, ...props }: ComponentProps<"footer">
) {
  return (
    <footer className={cn(
      "py-20 text-sm text-center text-zinc-500",
      className,
    )}>
      &copy; {new Date().getUTCFullYear()} <a className="text-zinc-800 dark:text-zinc-300 !no-underline hover:!underline cursor-pointer" href="https://alfon.dev" target="_blank">Alfonsus Ardani</a>. All rights reserved.
    </footer>
  )
}