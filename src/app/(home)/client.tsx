"use client"

import { cn } from "lazy-cn"
import { LinkButton2 } from "../ui/Button"
import { useEffect, useState, type ComponentProps, type SVGProps } from "react"
import { Footer } from "../ui/Footer"
import { CodeBlock } from "../docs/ui/code"
import { NotificationExample } from "./example.notifications"
import { FormBuilderExample } from "./example.formbuilder"
import { GalleryExample } from "./example.gallery"
import { APIKeysExample } from "./example.apikeys"
import { TitleExample } from "./example.title"
import { MultiStepExample } from "./example.multistep"
import type { Codes } from "./page"
import { AnimateChildren } from "../../../lib/AnimateChildren/src"
import { AccordionExample } from "./example.accordion"
import { PlaylistExample } from "./example.playlist"
import Image from "next/image"

export default function Home(
  props: {
    version: string,
    codes: Codes
  }
) {


  return (
    <main
      style={{
        //@ts-expect-error custom css props
        "--bg-dark": "#151519",
        "--bg-dark-2": "#21212a",
        "--bg-dark-3": "#2f2f3d",

        "--bg-light": "#fff",
        "--bg-light-2": "#f8f8fc",
        "--bg-light-3": "#f1f1f6",

        "--text-dark": "#eef",
        "--text-dark-2": "#ccd",
        "--text-dark-3": "#aab",
        "--text-dark-4": "#889",

        "--text-light": "#334",
        "--text-light-2": "#445",
        "--text-light-3": "#778",
        "--text-light-4": "#889",

        "--text-light-accent": "#61619a",
        "--text-dark-accent": "#a4a4e6",

        "--border-dark": "#36364c",
        "--border-dark-2": "#27272d",

        "--border-light": "#e3e3ef",
        "--border-light-2": "#ededf8",

        "--padding": "1rem",
      }}
      className={cn(
        "min-h-screen p-[var(--padding)]",
        "font-[family-name:var(--inter)]",

        "bg-[var(--bg-light)]",

        "text-[var(--text-light)]",

        "*:mx-auto *:max-w-[30rem]",

        "root-stable-both-scrollbar",

        "overflow-x-hidden",

        '[&_*[class*="--text-light-4"]]:opacity-[0.9]'
      )}
    >
      <header className="pt-20">
        {/* Badge */}
        <div className={cn(
          "inline-block",
          "p-1 px-3 rounded-xl",
          "bg-[var(--bg-light-3)]",

          "text-[var(--text-light-accent)]",

          "font-semibold tracking-tight leading-none  text-sm")}>
          v{props.version}
        </div>


        <h1 className="mt-4 text-6xl font-semibold tracking-tighter text-pretty
              pt-4
            ">
          <TitleExample />
          {/* Animate Children with Ease */}
        </h1>
        <div aria-hidden="true" role="presentation" className="mt-3 text-xl text-[var(--text-light-4)] text-pretty leading-tight font-medium tracking-tight">
          A fully open-source component to animate your child elements with <MyIcon className="inline w-[1em] h-[1em]" /> <span className="text-pretty text-[var(--text-light-2)] ">React Flip Children</span>
        </div>

        <div className="pt-8 text-xl flex *:flex-1 text-center mb-2 flex-wrap gap-2">
          <LargeButton
            href="#"
            onClick={() => {
              // @ts-expect-error global function
              window.shuffle()
            }}
            className="flex gap-2 items-center justify-center">
            <RadixIconsShuffle />
            Shuffle
          </LargeButton>
          <LargeButton
            href="/docs"
          >Documentation {'->'}</LargeButton>
        </div>
        <LargeButton
          href="/playground"
          className="flex gap-2 items-center justify-center">
          <RadixIconsMix className="text-lg" />
          Playground {'->'}</LargeButton>
      </header>

      <section className={cn(
        "my-40",

        "[&_p]:my-2",

        "[&_h2]:mt-40",
        "[&_h2]:text-lg",
        "[&_h2]:font-semibold",

        // "[&_h3]:my-10",
        "[&_h3]:mt-28",
        "[&_h3]:text-[var(--text-light-2)]",
        "[&_h3]:font-semibold",
        "[&_h3]:text-sm",

        "[&_code]:text-sm",

        "[&_pre]:whitespace-pre-wrap",
        "[&_pre]:text-sm",

        "[&_pre]:p-2",
        "[&_pre]:p-4",
        "[&_pre]:my-4",
        "[&_pre]:rounded-md",

        "[&_pre]:border",
        "[&_pre]:border-[var(--border-light-2)]",

        "[&_header]:mb-10",
      )}>

        <h2>Installation</h2>
        <CodeBlock
          lang="bash"
          className="!py-3"
          code={`npm install react-flip-children`}
          lightTheme="github-light"
        />

        <h2>Usage</h2>
        <p>
          Simply wrap the children you want to animate with the <code>AnimateChildren</code> component.
        </p>
        <CodeBlock
          className="[&_code]:text-[0.95em]"
          code={`
import { AnimateChildren } from 'react-flip-children'

function App() {
  return (
    <AnimateChildren>
      <div>Child 1</div>
      <div>Child 2</div>
      <div>Child 3</div>
    </AnimateChildren>
  )
}
              `}
          lightTheme="min-light"
        />

        <h2>Examples</h2>
        <p>
          Here are some examples of what you can do with <code>AnimateChildren</code>.
        </p>

        <h3>API Keys</h3>
        <CodePreview code={props.codes.apikeys} />
        <br />
        <APIKeysExample />

        <h3>Song Playlist</h3>
        <CodePreview code={props.codes.playlist} />
        <br />
        <PlaylistExample />

        <h3>Notification List</h3>
        <CodePreview code={props.codes.notifications} />
        <br />
        <NotificationExample />

        <h3>Form Builder</h3>
        <CodePreview code={props.codes.formbuilder} />
        <br />
        <FormBuilderExample />

        <h3>Accordion</h3>
        <CodePreview code={props.codes.accordion} />
        <br />
        <AccordionExample />


        <h3>Gallery <span className="font-normal">(Advanced)</span></h3>
        <CodePreview code={props.codes.gallery} />
        <br />
        <GalleryExample />

        <h3>Multistep Tabs <span className="font-normal">(Advanced)</span></h3>
        <CodePreview code={props.codes.multistep} />
        <br />
        <MultiStepExample />

      </section>

      <Footer />
    </main>
  )
}

function LargeButton(
  { className, ...props }: ComponentProps<typeof LinkButton2>
) {
  return (
    <LinkButton2
      {...props}
      className={cn(
        "",
        "text-base py-2.5 rounded-lg text-[var(--text-light-2)] ",
        className,
      )}
    />
  )
}


function RadixIconsShuffle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15" {...props}><path fill="currentColor" fillRule="evenodd" d="M12.354 1.146a.5.5 0 0 0-.708.708L12.793 3H12c-1.296 0-2.289.584-3.128 1.39c-.671.644-1.279 1.467-1.877 2.278q-.197.269-.395.532C5.109 9.188 3.49 11 .5 11a.5.5 0 0 0 0 1c3.51 0 5.391-2.188 6.9-4.2l.42-.565c.597-.808 1.14-1.544 1.745-2.124C10.289 4.416 11.046 4 12 4h.793l-1.147 1.146a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708zM.5 3c2.853 0 4.63 1.446 6.005 3.067l-.129.176a79 79 0 0 1-.484.65C4.573 5.293 3.026 4 .5 4a.5.5 0 0 1 0-1m8.372 7.61c-.5-.479-.963-1.057-1.414-1.655Q7.74 8.597 8 8.25l.09-.12c.494.664.963 1.268 1.475 1.76c.724.694 1.481 1.11 2.435 1.11h.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L12.793 12H12c-1.296 0-2.289-.584-3.128-1.39" clipRule="evenodd"></path></svg>
  )
}

function RadixIconsMix(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.15 4a1.85 1.85 0 1 1 3.7 0a1.85 1.85 0 0 1-3.7 0M4 1.25a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M5.82 11L2.5 12.837V9.163zM2.64 8.212a.7.7 0 0 0-1.039.612v4.352a.7.7 0 0 0 1.039.613l3.933-2.176a.7.7 0 0 0 0-1.225zM8.3 9a.7.7 0 0 1 .7-.7h4a.7.7 0 0 1 .7.7v4a.7.7 0 0 1-.7.7H9a.7.7 0 0 1-.7-.7zm.9.2v3.6h3.6V9.2zm4.243-7.007a.45.45 0 0 0-.636-.636L11 3.364L9.193 1.557a.45.45 0 1 0-.636.636L10.364 4L8.557 5.807a.45.45 0 1 0 .636.636L11 4.636l1.807 1.807a.45.45 0 0 0 .636-.636L11.636 4z" clipRule="evenodd"></path></svg>
  )
}

function CodePreview(
  props: {
    code: string
  }
) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setOpen(!open)}
        className={cn(
          "text-sm text-[var(--text-light-3)] hover:text-[var(--text-light)] cursor-pointer",
        )}>
        {open ? "hide" : "view code"}
      </div>
      <div className={cn(
        "overflow-hidden w-[calc(100vw_-_30px)] relative -translate-x-1/2  left-1/2  text-sm !max-w-none",
        "bg-[var(--bg-dark-2)] rounded-xl",
        "[&_pre]:border-none",
        "[&_pre]:!my-0",
        "[&_pre]:!px-4",
      )}>
        <div>
          <AnimateChildren
            delayDeletion={1000}
            duration={1000}
            useAbsolutePositionOnDelete
            disableScaleAnimation
          >
            {
              open &&
              <div key="code" className={cn(
                "overflow-x-auto"
              )}>
                <div className="min-w-max">
                  <CodeBlock key="code" code={props.code} lightTheme="vesper" />
                </div>
              </div>
            }
            <div />
          </AnimateChildren>
        </div>
      </div>
    </>

  )
}



function MyIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="18" y="1.5" width="19" height="19" rx="3" fill="#FCD732" />
      <rect x="3" y="5.5" width="19" height="18" rx="3" fill="#FB4949" />
      <rect y="12.5" width="19" height="19" rx="3" fill="#498DFB" />
      <rect x="16" y="16.5" width="18" height="19" rx="3" fill="#43D4AD" />
    </svg>
  )
}