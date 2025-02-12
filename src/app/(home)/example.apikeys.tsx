import { cn } from "lazy-cn"
import { useArrayDemo } from "../(updates)/shared"
import { AnimateChildren } from "../../../lib/AnimateChildren/src"
import type { SVGProps } from "react"

export function APIKeysExample() {

  const demo = useArrayDemo(3)

  return (
    <div className="flex flex-col text-xs">

      <div className="flex flex-col gap-2 text-[var(--text-light-3)]">
        <div className="flex gap-2">
          <div className="grow flex-1">Key</div>
          <div className="grow flex-1">Value</div>
          <div className="w-8"/>
        </div>

        <AnimateChildren duration={300} useAbsolutePositionOnDelete>
          {demo.arr.map((item) => (
            <div
              key={item}
              className={cn(
                "bg-[var(--bg-light)]",
                "flex flex-col gap-2 text-sm",
                "group",
                "[&_b]:font-semibold",
                "transition-all",
                "opacity-100",
                "data-[adding]:opacity-0",
                "data-[deleting]:opacity-0",
              )}>
              <div className="flex gap-2 font-mono">
                <input
                  placeholder="e.g. CLIENT_KEY"
                  className="p-1 px-1.5 bg-[var(--bg-light)] rounded-md border border-[var(--border-light-2)] grow focus:outline-none focus:border-[var(--text-light-4)] min-w-0 text-[var(--text-light)]"
                />
                <input
                  className="p-1 px-1.5 bg-[var(--bg-light)] rounded-md border border-[var(--border-light-2)] grow focus:outline-none focus:border-[var(--text-light-4)] min-w-0"
                />
                <button
                  onClick={() => demo.remove(item)}
                  className="p-1 w-8 h-8 flex items-center justify-center rounded-md bg-[var(--bg-light-2)] hover:bg-[var(--bg-light-3)] cursor-pointer active:bg-[var(--bg-light-3)] select-none transition-all text-[var(--text-light)] border border-[var(--border-light)]">
                  <LucideTrash />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => demo.addLast()}
            className={cn(
              "self-start",
              "flex gap-2 items-center",
              "text-sm p-2 px-4 rounded-md text-center bg-[var(--bg-light-2)] hover:bg-[var(--bg-light-3)] cursor-pointer active:bg-[var(--bg-light-3)] select-none transition-all",
              "text-[var(--text-light)]",
              "border border-[var(--border-light)]"
            )}>
            <RadixIconsPlus />
            Add Another
          </button>
        </AnimateChildren>
      </div>
    </div>
  )
}


export function LucideTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
  )
}

export function LucideArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12l7-7l7 7m-7 7V5"></path></svg>
  )
}

export function LucideArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7l-7 7l-7-7"></path></svg>
  )
}


export function RadixIconsPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15" {...props}><path fill="currentColor" fillRule="evenodd" d="M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8z" clipRule="evenodd"></path></svg>
  )
}
