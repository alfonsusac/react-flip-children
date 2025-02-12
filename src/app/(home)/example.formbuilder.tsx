import { cn } from "lazy-cn"
import { useArrayDemo } from "../(updates)/shared"
import { AnimateChildren } from "../../../lib/AnimateChildren/src"
import type { SVGProps } from "react"

export function FormBuilderExample() {

  const demo = useArrayDemo(3)

  return (
    <div className="flex flex-col">

      <div className="overflow-visible flex flex-col gap-2">
        <AnimateChildren duration={300} useAbsolutePositionOnDelete>
          {demo.arr.map((item) => (
            <div
              key={item}
              className={cn(
                "bg-[var(--bg-light)]",
                "p-4 rounded-lg",
                "border border-[var(--border-light)]",
                "flex flex-col gap-2 text-sm",
                "group",
                "[&_b]:font-semibold",
                "transition-all",
                "opacity-100",
                "data-[adding]:opacity-0",
                "data-[deleting]:opacity-0",
                "data-[deleting]:translate-x-10",
              )}>
              <div className="flex gap-2">
                <input
                  defaultValue={defaultQuestions[item % defaultQuestions.length].label}
                  className="p-1 px-1.5 min-w-0 text-lg bg-[var(--bg-light)] rounded-md border-b border-[var(--border-light-2)] grow rounded-b-none focus:outline-none focus:border-b-[var(--text-light)]"
                />
                <select
                  className="p-1 px-1.5 self-stretch text-sm bg-[var(--bg-light)] rounded-md border border-[var(--border-light-2)]"
                >
                  <option>Text</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => demo.moveUp(item)}
                  className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                  <LucideArrowUp />
                </button>
                <button
                  onClick={() => demo.moveDown(item)}
                  className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                  <LucideArrowDown />
                </button>
                <button
                  onClick={() => demo.remove(item)}
                  className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                  <LucideTrash />
                </button>
              </div>
            </div>
          ))}
          <button
            disabled={demo.arr.length >= 5}
            onClick={() => demo.addLast()}
            className={cn(
              "text-[var(--text-light)]",
              "border border-[var(--border-light)]",
              "text-sm p-2 rounded-md text-center bg-[var(--bg-light-2)] hover:bg-[var(--bg-light-3)] cursor-pointer active:bg-[var(--bg-light-3)] select-none transition-all",
              demo.arr.length >= 5 && "opacity-0 pointer-events-none"
            )}>
            Add Question
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

const defaultQuestions = [
  {
    type: "text",
    label: "What is your name?",
  },
  {
    type: "number",
    label: "How old are you?",
  },
  {
    type: "date",
    label: "When were you born?",
  },
  {
    type: "text",
    label: "What is your favorite color?",
  },
]