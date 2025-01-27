"use client"

import { cn } from "lazy-cn"
import { useState, type ComponentProps } from "react"
import { MagicCode } from "../code"
import { Geist_Mono } from "next/font/google"
import { AnimateChildren } from "../../../../lib/AnimateChildren/src"
import { useArrayDemo } from "../shared"

export default function Version010Page() {

  const {
    add,
    arr,
    remove,
    shuffle,
    reverse,
  } = useArrayDemo()

  const [tab, setTab] = useState<1 | 2 | 3>(1)
  const goToTab = (tab: 1 | 2 | 3) => () => setTab(tab)

  const code = getCode(
    `<AnimateChildren${ tab >= 2 ? `` : `>` }`,
    tab >= 2 ? `  stagger={${tab === 2 ? `10` : `100`}}` : ``,
    tab >= 2 ? `>` : ``,
    "  {arr.map(el => (",
    "    <MyCard key={el}>{el}</MyCard>",
    "  ))}",
    "<AnimateChildren/>",
  )

  return (
    <div className="min-h-screen bg-[#334] test-[#99a] p-8 flex flex-col gap-12">
      <header className="max-w-[50rem] mx-auto w-full">
        <LinkButton className="inline-block my-8"
          href="/"
        >
          Back to Home Page
        </LinkButton>
        <h1 className="text-lg font-semibold text-[#667] leading-none">React Flip Children Version 0.1.1</h1>
        <h2 className="text-5xl font-semibold text-[#bbc] leading-none">Stagger Animation</h2>
      </header>
      <section className="max-w-[50rem] mx-auto w-full flex gap-4">
        <div className="flex-1 grow flex flex-col gap-2">
          <div className="flex gap-2">
            <Tab onClick={goToTab(1)} data-selected={tab === 1 ? "" : undefined}>1.tsx</Tab>
            <Tab onClick={goToTab(2)} data-selected={tab === 2 ? "" : undefined}>2.tsx</Tab>
            <Tab onClick={goToTab(3)} data-selected={tab === 3 ? "" : undefined}>3.tsx</Tab>
          </div>
          <div className={cn(
            `font-[family-name:var(--geist-mono)]`,
            `font-semibold whitespace-pre`,
            `text-sm leading-relaxed`,
            `*:will-change-transform`,
            `*:transform-gpu`,
            `*:transition-all`,
            `*:duration-500`,
            `data-[adding]:*:opacity-0`,
            `data-[deleting]:*:opacity-0`,
          )}>
            <MagicCode code={code} theme={"poimandres"} />
          </div>
        </div>
        <div className="flex-1 grow flex flex-col gap-2">

          <div className="flex gap-2">
            <Button onClick={shuffle}>Shuffle</Button>
            <Button onClick={reverse}>Reverse</Button>
            <Button onClick={add}>Add</Button>
          </div>

          <div className="flex flex-wrap gap-1 overflow-clip">
            <AnimateChildren
              stagger={
                tab === 1 ? 0 :
                tab === 2 ? 10 :
                100
              }
            >
              {arr.map(el => (
                <div
                  key={el}
                  className={cn(
                    "text-xl w-12 h-12",
                    "bg-[#445] rounded-lg p-2",
                    "leading-none",
                    "cursor-pointer",
                    "shadow-[inset_0_1px_0px_0_#fff1,_0_2px_2px_0_#0003]",
                    "hover:shadow-[inset_0_1px_0px_0_#fff1,_0_6px_3px_0_#0003]",
                    "transition-all duration-500",
                    "hover:-translate-y-1",
                    "data-[deleting]:opacity-0",
                    "data-[adding]:opacity-0",
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
      </section>
    </div>
  )
}




function Button(
  { className, ...props }: ComponentProps<"button">
) {
  return <button {...props} className={cn(
    `bg-[#334] border border-zinc-600/20 px-4 py-2 rounded-lg`,
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
    `bg-[#334] border border-[#445] hover:bg-zinc-700/20 p-2 px-3 leading-none rounded-lg`,
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
    // `bg-zinc-800`,
    `text-sm font-semibold`,
    `transition-all duration-100`,

    `grow`,
    `flex flex-col items-center gap-1`,

    "font-bold",
    "text-[#556]",
    "data-[selected]:text-[#aab]",
    "hover:text-zinc-300",

    `group`,
    className
  )}>
    {children}
    <div className={cn(
      "w-full h-1 rounded-full",

      "transition-all",
      "bg-[#556]",
      "group-data-[selected]:bg-[#aab]",
      "group-hover:bg-zinc-400",
    )} />
  </button>
}

function getCode(...args: string[]) {
  return args.filter(Boolean).join("\n")
}