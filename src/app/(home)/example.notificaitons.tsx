import { cn } from "lazy-cn"
import { useArrayDemo } from "../(updates)/shared"
import { AnimateChildren } from "../../../lib/AnimateChildren/src"
import type { SVGProps } from "react"

export function NotificationExample() {

  const demo = useArrayDemo(5)

  const remove = (item: number) => {
    demo.remove(item)
    setTimeout(() => {
      demo.addFirst()
    }, 2000)
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

      <div className="h-80 overflow-auto stable-scrollbar">
        <AnimateChildren stagger={50} useAbsolutePositionOnDelete>
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
                onClick={() => remove(item)}
                className="self-center p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-100">
                <RadixIconsArchive className="text-lg" />
              </button>
            </div>
          ))}
        </AnimateChildren>
      </div>

      <div className="flex gap-2 items-center justify-center p-3 text-sm hover:bg-[var(--bg-light-2)] cursor-pointer font-medium border-t border-[var(--border-light)]"
        onClick={() => {
          demo.arr.forEach((item, index) => {
            setTimeout(() => {
              remove(item)
            }, index * 100)
          })
        }}
      >
        Archive All
      </div>
    </div>
  )
}


export function RadixIconsGear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15" {...props}><path fill="currentColor" fillRule="evenodd" d="M7.07.65a.85.85 0 0 0-.828.662l-.238 1.05q-.57.167-1.08.448l-.91-.574a.85.85 0 0 0-1.055.118l-.606.606a.85.85 0 0 0-.118 1.054l.574.912q-.28.509-.447 1.079l-1.05.238a.85.85 0 0 0-.662.829v.857a.85.85 0 0 0 .662.829l1.05.238q.166.57.448 1.08l-.575.91a.85.85 0 0 0 .118 1.055l.607.606a.85.85 0 0 0 1.054.118l.911-.574q.51.28 1.079.447l.238 1.05a.85.85 0 0 0 .829.662h.857a.85.85 0 0 0 .829-.662l.238-1.05q.57-.166 1.08-.447l.911.574a.85.85 0 0 0 1.054-.118l.606-.606a.85.85 0 0 0 .118-1.054l-.574-.911q.282-.51.448-1.08l1.05-.238a.85.85 0 0 0 .662-.829v-.857a.85.85 0 0 0-.662-.83l-1.05-.237q-.166-.57-.447-1.08l.574-.91a.85.85 0 0 0-.118-1.055l-.606-.606a.85.85 0 0 0-1.055-.118l-.91.574a5.3 5.3 0 0 0-1.08-.448l-.239-1.05A.85.85 0 0 0 7.928.65zM4.92 3.813a4.5 4.5 0 0 1 1.795-.745L7.071 1.5h.857l.356 1.568a4.5 4.5 0 0 1 1.795.744l1.36-.857l.607.606l-.858 1.36c.37.527.628 1.136.744 1.795l1.568.356v.857l-1.568.355a4.5 4.5 0 0 1-.744 1.796l.857 1.36l-.606.606l-1.36-.857a4.5 4.5 0 0 1-1.795.743L7.928 13.5h-.857l-.356-1.568a4.5 4.5 0 0 1-1.794-.744l-1.36.858l-.607-.606l.858-1.36a4.5 4.5 0 0 1-.744-1.796L1.5 7.93v-.857l1.568-.356a4.5 4.5 0 0 1 .744-1.794L2.954 3.56l.606-.606zM9.026 7.5a1.525 1.525 0 1 1-3.05 0a1.525 1.525 0 0 1 3.05 0m.9 0a2.425 2.425 0 1 1-4.85 0a2.425 2.425 0 0 1 4.85 0" clipRule="evenodd"></path></svg>
  )
}

export function RadixIconsArchive(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15" {...props}><path fill="currentColor" fillRule="evenodd" d="M3.309 1a1 1 0 0 0-.894.553L1.053 4.276A.5.5 0 0 0 1 4.5V13a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.053-.224l-1.362-2.723A1 1 0 0 0 11.691 1zm0 1H7v2H2.309zM8 4V2h3.691l1 2zm-.5 1H13v8H2V5zm-2 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" clipRule="evenodd"></path></svg>
  )
}


export function LucideTriangleAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01"></path></svg>
  )
}