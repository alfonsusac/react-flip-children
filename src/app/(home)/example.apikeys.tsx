import { cn } from "lazy-cn"
import { useArrayDemo } from "../(updates)/shared"
import { AnimateChildren } from "../../../lib/AnimateChildren/src"
import { LucideTrash, RadixIconsPlus } from "./assets"

export function APIKeysExample() {

  const demo = useArrayDemo(3)

  return (
    <div className="flex flex-col text-xs">

      <div className="flex flex-col gap-2 text-[var(--text-light-3)]">
        <div className="flex gap-2">
          <div className="grow flex-1">Key</div>
          <div className="grow flex-1">Value</div>
          <div className="w-8 shrink-0"/>
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
                  className="p-1 w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-[var(--bg-light-2)] hover:bg-[var(--bg-light-3)] cursor-pointer active:bg-[var(--bg-light-3)] select-none transition-all text-[var(--text-light)] border border-[var(--border-light)]">
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


