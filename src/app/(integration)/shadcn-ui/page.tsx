"use client"

import { MagicCode } from "@/app/(updates)/code";
import { useState, type ComponentProps, type SVGProps } from "react";
import { AnimateChildren } from "../../../../lib/AnimateChildren/src";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { cn } from "lazy-cn";
import { exampleArticles, useArrayArticleDemo, useArrayDemo } from "@/app/(updates)/shared";
import { AButton, Button } from "./button";
import { LinkButton } from "@/app/ui/Button";

export default function ShadCNDemo() {

  const {
    arr,
    add,
    removeFn,
    moveUp,
    moveDown,
    reverse,
    shuffle,
  } = useArrayArticleDemo()

  const [tab, setTab] = useState<1 | 2 | 3>(1)
  const goToTab = (tab: 1 | 2 | 3) => () => setTab(tab)

  const code = getCode(
    tab >= 2 ? `import { AnimateChildren } from "react-flip-children";` : ``,
    `import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./card";
import { cn } from "lazy-cn";

<div className="space-y-2">`,
    tab >= 2 && `  <AnimateChildren delayDeletion={150}>`,

    `    {arr.map((el, index) => (
      <Card key={el.id}${ tab < 3 ? `>` : `` }`,

    tab >= 3 ?
      `        className={cn(
          "transition-all",
          "data-[deleting]:opacity-0",
          "data-[adding]:opacity-0"
        )}>` : ``,
    `        <CardHeader>
          <CardTitle>{el.title}</CardTitle>
          <CardDescription>{el.date}</CardDescription>
        </CardHeader>
        <CardFooter>
          <MoveUpButton
            onClick={() => moveUp(el.id)}/>
          <MoveDownButton
            onClick={() => moveDown(el.id)}/>
          <DeleteButton
            onClick={removeFn(el.id)}/>
        </CardFooter>
      </Card>
    ))}`, tab >= 2 && `  </AnimateChildren>`,
    `</div>`
  )

  return (
    <article className={cn(
      "min-h-screen bg-slate-50  text-[#09090b] p-4 *:mx-auto",
      "font-[family-name:var(--inter)]"
    )}>
      <header className="pt-4 md:pt-8 mb-8 md:mb-20 relative max-w-[38rem]">

        <LinkButton
          href="/docs#shadcn-ui"
          className="bg-white border-[#ccc] text-[#445] hover:bg-[#efefef] inline-block mb-2 md:mb-12"
        >{'<-'} Back to Docs</LinkButton><br />

        <SimpleIconsShadcnui className="w-52 h-52 block absolute right-0 bottom-0 text-slate-200 mix-blend-darken" />

        <span className="text-lg font-bold">v0.1.3</span>
        <h1 className="text-3xl font-bold tracking-tighter pb-10 leading-none">
          React Flip Children<br /> Integration Guide
        </h1>

        <h2 className="text-6xl font-bold tracking-tighter">shadcn/ui</h2>
        <span className="font-semibold tracking-tight">Last Updated: {new Date().toISOString().split('T')[0]}</span>
      </header>

      <section className="max-w-[62rem] min-w-0 flex flex-col sm:flex-row flex-wrap gap-4 ">

        <div className="flex-1 overflow-hidden min-w-0 flex flex-col w-full">
          <div className="flex gap-2 mb-4 min-w-0">
            <Tab onClick={goToTab(1)} data-selected={tab === 1 ? "" : undefined}>1.tsx</Tab>
            <Tab onClick={goToTab(2)} data-selected={tab === 2 ? "" : undefined}>2.tsx</Tab>
            <Tab onClick={goToTab(3)} data-selected={tab === 3 ? "" : undefined}>3.tsx</Tab>
          </div>
          <pre className={cn(
            "font-[family-name:var(--geist-mono)]",
            "text-sm",
            "font",
            "selection:bg-slate-200",
            "*:transition-all",
            "*:delay-500",
            "*:duration-500",
            "data-[adding]:*:opacity-0",
            "data-[deleting]:*:opacity-0",
            "data-[deleting]:*:delay-0",
          )}>
            <MagicCode code={code} theme="min-light" stagger={
              tab === 3 ? 5 : 10
            } />
          </pre>


        </div>

        <div className="flex-1">
          <div className="mb-2 flex gap-1">
            <Button variant="outline" onClick={add}>Add</Button>
            <Button variant="outline" onClick={reverse}>Reverse</Button>
            <Button variant="outline" onClick={shuffle}>Shuffle</Button>
          </div>
          <div className="space-y-2">
            <AnimateChildren
              delayDeletion={150}
            >
              {arr.map((el, index) => (
                <Card
                  key={el.id}
                  className={cn(
                    "transition-all",
                    "data-[deleting]:opacity-0",
                    "data-[adding]:opacity-0"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="text-pretty">{el.title}</CardTitle>
                    <CardDescription className="">
                      <span className="font-medium">{el.author}</span>
                      <br />{el.date}</CardDescription>
                  </CardHeader>
                  <CardFooter className="-mt-12 justify-end -mx-4 -mb-4">
                    <Button variant="ghost" size="icon" onClick={() => moveUp(el.id)}>
                      <LucideArrowUp />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => moveDown(el.id)}>
                      <LucideArrowDown />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={removeFn(el.id)}>
                      <LucideTrash2 className="!text-red-600" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </AnimateChildren>
          </div>
        </div>
        
      </section>

      <section className="bg-zinc-800 h-80 mt-16 !-mx-4 py-8 overflow-clip p-4">
        <div className="max-w-[60rem] mx-auto font-bold flex gap-4 items-center h-full">

          <div className="flex-1 text-white">
            <div className="text-5xl sm:text-6xl tracking-tighter text-pretty">
              Animate Children
              with Ease
            </div>
            <AButton href="/docs" variant="secondary" className="mt-4">
              Get Started
            </AButton>
          </div>

          <div className="flex-1 flex flex-col gap-2 scale-75 min-w-0">
            {[0, 1, 4, 6, 8].map(e => ({ id: e, ...exampleArticles[e % exampleArticles.length] })).map((el, index) => (
              <Card
                key={el.id}
                className={cn(
                  "min-w-[20rem]",
                  "transition-all",
                  "data-[deleting]:opacity-0",
                  "data-[adding]:opacity-0"
                )}
              >
                <CardHeader>
                  <CardTitle className="text-pretty">{el.title}</CardTitle>
                  <CardDescription className="">
                    <span className="font-medium">{el.author}</span>
                    <br />{el.date}</CardDescription>
                </CardHeader>
                <CardFooter className="-mt-12 justify-end -mx-4 -mb-4">
                  <Button variant="ghost" size="icon">
                    <LucideArrowUp />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <LucideArrowDown />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <LucideTrash2 className="!text-red-600" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 text-sm text-center opacity-60">
        &copy; {new Date().getUTCFullYear()} Alfonsus Ardani. All rights reserved.
      </footer>


    </article>
  )
}




function SimpleIconsShadcnui({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className} {...props}><rect width="256" height="256" fill="none"></rect><line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></line><line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></line></svg>
  )
}


function LucideTrash2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"></path></svg>
  )
}


function LucideArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12l7-7l7 7m-7 7V5"></path></svg>
  )
}


function LucideArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7l-7 7l-7-7"></path></svg>
  )
}

function Tab(
  { className, children, ...props }: ComponentProps<"button">
) {
  return <button {...props} className={cn(
    "my-1",
    // `bg-zinc-800`,
    `text-sm`,
    `transition-all duration-100`,

    `grow`,
    `flex flex-col items-center gap-1`,

    "font-medium",
    "text-[hsl(215.4_16.3%_46.9%)]",
    "data-[selected]:text-[hsl(222.2_47.4%_11.2%)]",

    `group`,
    className
  )}>
    {children}
    <div className={cn(
      "w-full h-[0.2rem] rounded-full",

      "transition-all",
      "bg-[hsl(205_16%_47%_/_0.3)]",
      "group-data-[selected]:bg-[hsl(222.2_47.4%_11.2%)]",
    )} />
  </button>
}

function getCode(...args: (string | boolean)[]) {
  return args.filter(Boolean).join("\n")
}

