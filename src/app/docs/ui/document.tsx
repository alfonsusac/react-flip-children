import { cn } from "lazy-cn";
import type { ComponentProps } from "react";

export function H3(
  { id, children, className, ...props }: ComponentProps<"h3">
) {
  return <h3 className={cn(
    "group relative",
    className,
  )} {...props} id={id}>
    <Anchor forId={id} className="translate-y-1" />
    {children}
  </h3>
}

export function H4(
  { id, children, className, ...props }: ComponentProps<"h4">
) {
  return <h4 className={cn(
    "group relative",
    className,
  )} {...props} id={id}>
    <Anchor forId={id} className="translate-y-1" />
    {children}
  </h4>
}

function Anchor(
  { className, forId, ...props }: ComponentProps<"a"> & {
    forId?: string
  }
) {
  return <a {...props} href={forId ? `#${ forId }` : undefined} className={cn(
    "opacity-0",

    "absolute",
    "-left-6",

    "font-medium",
    "text-2xl",
    "text-center leading-none",
    "transition-all",
    "group-hover:opacity-100",
    "!text-[#66b]",
    "!no-underline",
    "hover:!underline",
    "hover:cursor-pointer",
    "hover:!text-[#66f]",
    className,
  )}>#</a>
}