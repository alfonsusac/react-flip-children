import { cn } from "lazy-cn"
import { useArrayDemo } from "../(updates)/shared"
import { AnimateChildren } from "../../../lib/AnimateChildren/src"
import type { SVGProps } from "react"
import { LucideTriangleAlert, RadixIconsArchive, RadixIconsGear } from "./assets"

export function NotificationExample() {

  const demo = useArrayDemo(5)

  const remove = (item: number) => {
    demo.remove(item)
    setTimeout(() => demo.addFirst(), 2000)
  }

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-[var(--border-light)]">
      <div className="flex gap-4 border-b border-[var(--border-light)] px-4 justify-between">
        <div className="flex gap-4">
          <div className="border-b-2 border-[var(--text-light)] py-3 text-sm cursor-pointer ">Inbox</div>
          <div className="border-b-2 border-transparent         py-3 text-sm cursor-pointer opacity-80 hover:opacity-100">Archive</div>
          <div className="border-b-2 border-transparent         py-3 text-sm cursor-pointer opacity-80 hover:opacity-100">Comments</div>
        </div>
        <div className="p-2 hover:bg-[var(--bg-light-3)] text-[var(--text-light-3)] hover:text-[var(--text-light)] self-center rounded-full cursor-pointer -mr-2">
          <RadixIconsGear className="" />
        </div>
      </div>

      <div className="h-80 overflow-y-scroll overflow-x-hidden relative">
        <AnimateChildren
          disableScaleAnimation
          strategy="interrupt">
          {demo.arr.map((item) => (
            <div
              key={item}
              className={cn(
                "bg-[var(--bg-light)]",
                "p-4",
                "border-b last:border-transparent border-[var(--border-light)]",
                "flex gap-2 text-sm",
                "hover:bg-[var(--bg-light-2)]",
                "group transition-all duration-100 cursor-pointer",
                "[&_b]:font-semibold",
                "transition-all",
                "data-[adding]:opacity-0",
                "data-[deleting]:opacity-0",
                "data-[deleting]:translate-x-10",
              )}>
              <div className="p-2 bg-yellow-500/10 text-orange-500 self-start rounded-full">
                <LucideTriangleAlert className="text-xl" />
              </div>
              <div>
                <div className="leading-tight">
                  <b>react-flip-children</b> failed to deploy in the <b>Production</b> environment
                </div>
                <div className="mt-1 opacity-50">
                  2d ago
                </div>
              </div>
              <button
                aria-label="archive"
                onClick={() => remove(item)}
                className="self-center p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-100">
                <RadixIconsArchive className="text-lg" />
              </button>
            </div>
          ))}
        </AnimateChildren>
      </div>

      <button
        aria-label="archive all"
        className="flex gap-2 items-center justify-center p-3 text-sm hover:bg-[var(--bg-light-2)] cursor-pointer font-medium border-t border-[var(--border-light)]"
        onClick={() => demo.arr.forEach((item, index) => setTimeout(() => remove(item), index * 100))}
      >
        Archive All
      </button>
    </div>
  )
}
