"use client"

import { cn } from "lazy-cn"
import { useEffect, useState } from "react"

export function Sidebar() {

  const [headers, setHeaders] = useState<{
    id: string,
    text: string | null,
    level: number
  }[]>([])

  useEffect(() => {
    const headers = document.querySelectorAll("h2, h3, h4, h5, h6")
    const newHeaders: {
      id: string,
      text: string | null,
      level: number
    }[] = []
    headers.forEach(header => {
      newHeaders.push({
        id: header.id,
        text: header.textContent?.trimStart().trimEnd().replace(/#/g, "") || null,
        level: Number(header.tagName[1])  // h2 -> 2
      })
    })
    setHeaders(newHeaders)
  }, [])

  const [open, setOpen] = useState(false)


  return (
    <>
      <div className={cn(
        "fixed top-4 left-4 z-50 p-2 bg-[#151519]",
        "px-3",
        "rounded-lg",
        "border border-[#445]",
        "text-sm",
        "cursor-pointer select-none",
        "shadow-[0_2px_3px_0_#223]"
      )}
        onClick={() => setOpen(!open)}
      >
        Open Table of Contents
      </div>
      <div className={cn(
        "w-52 shrink-0 p-2",
        "bg-[#151519]",

        // "bg-red-500/50",

        "w-80",
        "fixed",
        "z-40",
        "top-0",
        "left-0",
        "bottom-0",
        "p-8",
        "shadow-[0_0_40px_0_#223]",

        "transition-all",

        open ? "left-0" : "-left-80",

        "pt-12",

      )}
      >

        <div
          tabIndex={0}
          className={cn(
            // open ? "h-auto" : "h-0",
            "flex flex-col  min-h-0 max-h-[calc(100vh)] overflow-auto",
            "-mx-8",
            "px-8",
            "-mt-12",
            "py-12"
          )}>
          {
            headers.map((header, index) => (
              <a href={header.id ? `#${ header.id }` : undefined} key={index} className={cn(
                "animate-appear",
                "text-sm",
                "py-1",
                "cursor-pointer",
                "transition-all",
                "!no-underline",
                // "!text-[#445]",
                // "hover:!text-[#aab]",
                "!text-[#ccd]",
                "hover:!text-[#88f]",
                "outline-none",
                "outline-transparent",
                header.level === 2 && "pl-0 pt-8 !font-semibold",
                header.level === 3 && "pl-4 py-1",
                header.level === 4 && "pl-8",
                header.level === 5 && "pl-12",
              )}>
                {header.text}
              </a>
            ))
          }
        </div>
      </div>
    </>
  )
}