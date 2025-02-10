import { cn } from "lazy-cn";
import type { ComponentProps, SVGProps } from "react";

export function H3(
  { id, children, className, ...props }: ComponentProps<"h3">
) {
  return <h3 className={cn(
    "group bg-[var(--bg)]",
    className,
  )} {...props} id={id}>
    {children} 
    <Anchor forId={id} />
  </h3>
}

export function H4(
  { id, children, className, ...props }: ComponentProps<"h4">
) {
  return <h4 className={cn(
    "group relative",
    className,
  )} {...props} id={id}>
    {children}
    <Anchor forId={id} />
  </h4>
}

function Anchor(
  { className, forId, ...props }: ComponentProps<"a"> & {
    forId?: string
  }
) {
  return <a {...props} href={forId ? `#${ forId }` : undefined} className={cn(
    "opacity-0",
    
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
  )}>
    <MdiLinkVariant className="inline ml-2" />
  </a>
}


export function MdiLinkVariant(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M10.59 13.41c.41.39.41 1.03 0 1.42c-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0a5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.98 2.98 0 0 0 0-4.24a2.98 2.98 0 0 0-4.24 0l-3.53 3.53a2.98 2.98 0 0 0 0 4.24m2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0a5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.98 2.98 0 0 0 0 4.24a2.98 2.98 0 0 0 4.24 0l3.53-3.53a2.98 2.98 0 0 0 0-4.24a.973.973 0 0 1 0-1.42"></path></svg>
  )
}