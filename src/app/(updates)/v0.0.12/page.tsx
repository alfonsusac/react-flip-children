"use client"

import { Geist_Mono, Kanit } from "next/font/google"
import { MagicCode } from "../code"
import { useRef, useState, type ComponentProps } from "react"
import { cn } from "lazy-cn"
import { AnimateChildren } from "../../../../lib/AnimateChildren/src"
import Link from "next/link"

const geistmono = Geist_Mono({
  subsets: ["latin"],
  variable: "--geist-mono",
})

export default function UpdatePage() {

  const lastIdRef = useRef(10)
  const [arr, setArr] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

  const shuffle = () => setArr(prev => prev.toSorted(() => Math.random() - 0.5))
  const add = () => {
    const newArr = [...arr]
    newArr.splice(Math.floor(Math.random() * arr.length), 0, ++lastIdRef.current)
    setArr(newArr)
  }
  const remove = (key: number) => setArr(prev => prev.filter(e => e !== key))



  const [tab, setTab] = useState<1 | 2 | 3>(1)
  const goToTab = (tab: 1 | 2 | 3) => () => setTab(tab)

  const code = getCode(
    "<div>",
    `  <AnimateChildren${ tab === 3 ? ` delayDeletion={0}` : `` }/>`,
    "    {arr.map(el => (",
    "      <MyCard key={el} className={cn(",
    "        'card',",
    tab === 1 ? "        'data-[adding]:opacity-0'," : "",
    tab === 1 ? "        'data-[deleting]:opacity-0'," : "",
    "      )}>{el}</MyCard>",
    "    ))}",
    "  <AnimateChildren/>",
    "</div>"
  )



  return <div className={`min-h-screen bg-zinc-800 p-4`}>


    <div className="max-w-[38rem] mx-auto my-20">
      <LinkButton href="/" className="inline-block mb-10">Back to Home Page</LinkButton>
      <div className="font-semibold text-zinc-600 text-xl tracking-tight leading-none">
        React Flip Children v0.0.12
      </div>
      <div className="font-semibold text-slate-300 text-5xl tracking-tight leading-none">
        Entry/Exit Animation
      </div>
    </div>

    <div className="max-w-[50rem] mx-auto flex gap-4">


      <div className="grow flex-1 flex flex-col gap-2">

        <div className="flex gap-2">
          <Tab onClick={goToTab(1)} data-selected={tab === 1 ? "" : undefined}>1.tsx</Tab>
          <Tab onClick={goToTab(2)} data-selected={tab === 2 ? "" : undefined}>2.tsx</Tab>
          <Tab onClick={goToTab(3)} data-selected={tab === 3 ? "" : undefined}>3.tsx</Tab>
        </div>

        <div className={cn(
          `${ geistmono.className } font-[family-name:var(--geist-mono)]`,
          `font-semibold whitespace-pre`,
          `text-sm leading-relaxed`,
          `*:will-change-transform`,
          `*:transform-gpu`,
          `*:transition-all`,
          `*:duration-500`,
          `data-[adding]:*:opacity-0`,
          `data-[deleting]:*:opacity-0`,
        )}>
          <MagicCode code={code} />
        </div>

      </div>
      <div className="grow flex-1 flex flex-col gap-2">

        <div className="flex gap-2">
          <Button onClick={shuffle}>Shuffle</Button>
          <Button onClick={add}>Add</Button>
        </div>

        <div className="flex flex-wrap gap-1">
          <AnimateChildren
            delayDeletion={tab === 3 ? 0 : undefined}
          >
            {arr.map(el => (
              <div
                key={el}
                className={cn(
                  "text-xl w-12 h-12",
                  "bg-zinc-700 rounded-lg p-2",
                  "leading-none",
                  "cursor-pointer",
                  "shadow-[inset_0_1px_0px_0_#fff1,_0_2px_2px_0_#0003]",
                  "hover:shadow-[inset_0_1px_0px_0_#fff1,_0_6px_3px_0_#0003]",
                  "transition-all duration-500",
                  "hover:-translate-y-1",
                  tab === 1 && "data-[deleting]:opacity-0",
                  tab === 1 && "data-[adding]:opacity-0",
                  "opacity-100",
                )}
                onClick={() => remove(el)}
                style={{ zIndex: el }}
              >
                {el}
              </div>
            ))}
          </AnimateChildren>
        </div>



      </div>


    </div>

  </div>
}


function Button(
  { className, ...props }: ComponentProps<"button">
) {
  return <button {...props} className={cn(
    `bg-zinc-700 border border-zinc-600/20 px-4 py-2 rounded-lg`,
    `text-sm font-semibold`,
    `shadow-[inset_0_-4px_2px_0_#0003]`,
    `active:shadow-[inset_0_-2px_2px_0_#0003]`,
    `active:translate-y-0.5`,
    `transition-all duration-100`,
    className
  )} />
}

function LinkButton(
  { className, ...props }: ComponentProps<"a">
) {
  return <a {...props} className={cn(
    `bg-zinc-800 border border-zinc-700/50 hover:bg-zinc-700/20 p-2 px-3 leading-none rounded-lg`,
    `text-xs font-medium`,
    `text-zinc-400`,
    // `shadow-[inset_0_-4px_2px_0_#0001]`,
    // `active:shadow-[inset_0_-2px_2px_0_#0003]`,
    `active:translate-y-0.5`,
    `transition-all duration-100`,
    className
  )} />
}

function Tab(
  { className, children, ...props }: ComponentProps<"button">
) {
  return <button {...props} className={cn(
    "my-1",
    `bg-zinc-800`,
    `text-sm font-semibold`,
    `transition-all duration-100`,

    `grow`,
    `flex flex-col items-center gap-1`,

    "font-bold",
    "text-zinc-600",
    "data-[selected]:text-zinc-400",
    "hover:text-zinc-300",

    `group`,
    className
  )}>
    {children}
    <div className={cn(
      "w-full h-1 rounded-full",

      "transition-all",
      "bg-zinc-600",
      "group-data-[selected]:bg-zinc-400",
      "group-hover:bg-zinc-400",
    )} />
  </button>
}

function getCode(...args: string[]) {
  return args.filter(Boolean).join("\n")
}