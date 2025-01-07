"use client"

import { useEffect, useRef, useState, type JSX, type SVGProps } from "react"
import { ReorderArray } from "../ui/Reorder"
import { codeToToken } from "../codeToken"
import { Geist_Mono, Reddit_Mono, Roboto_Mono, Ubuntu_Sans_Mono } from "next/font/google"
import { appExample } from "./examples/apps"
import { notificationsExample } from "./examples/notifications"

const mono = Roboto_Mono({
  variable: "--font-geist-mono",
})

export function TestPage() {


  const examples = {
    "apps.tsx": appExample,
    "notifications.tsx": notificationsExample,
  } as const

  const [currentExample, setCurrentTab] = useState<keyof typeof examples>("apps.tsx")

  return (
    <div className="text-lg flex flex-col !max-w-lg">

      <div className="h-10 bg-[#393327] sm:rounded-t-lg flex -mx-8 sm:mx-0 overflow-auto">
        {Object.entries(examples).map(([key, value]) => {
          return (
            <div key={key} className="p-2 px-6 text-white/60 hover:text-white data-[selected=true]:text-white text-base font-bold tracking-wide flex items-center cursor-pointer hover:bg-white/10 data-[selected=true]:bg-white/10 overflow-hidden min-w-0 truncate"
              onClick={() => setCurrentTab(key as keyof typeof examples)}
              data-selected={key === currentExample ? "true" : "false"}
            >{key}</div>
          )
        })}
      </div>
      <pre className={`whitespace-pre overflow-auto font-mono bg-[#393327] text-white py-6 px-4 sm:px-6 -mx-8 sm:mx-0 sm:rounded-b-lg text-base font-bold ${ mono.variable } tracking-normal`}>
        <ClientCode code={examples[currentExample].code} />
      </pre>

      {examples[currentExample].render}

    </div>
  )
}

function ClientCode(
  props: {
    code: string
  }
) {
  const [rendered, setRendered] = useState<JSX.Element>()
  useEffect(() => {
    const higlightCode = async () => {
      const code = await codeToToken(props.code)
      // delay 1s
      setRendered(
        <>
          {code.map((line, index) => (
            <div key={index} className="">
              {line.map((token, tokenIndex) => (
                <span className="animate-appear" key={tokenIndex} style={{
                  color: token.color,
                  animationDelay: `${ (index * 50 + tokenIndex * 10) * 2 }ms`,
                }}>{token.content}</span>
              ))}
            </div>
          ))}
        </>
      )
    }
    const promise = higlightCode()
  }, [props.code])
  return (
    <pre>
      {rendered || <span className="opacity-0">{props.code}</span>}
    </pre>
  )
}


export function copyPackageNameToClipboard() {
  navigator.clipboard.writeText("react-flip-array")
}

export function PackageName() {
  return (
    <span className="p-3 px-7 rounded-md font-black bg-[#9C8660] text-white font-mono flex items-center" onClick={copyPackageNameToClipboard}>
      npm i react-flip-array
    </span>
  )
}