"use client"

import { cn } from "lazy-cn"
import { useEffect, useState, type SVGProps } from "react"


type HeaderData = {
  id: string,
  text: string | null,
  level: number,
  code?: boolean,
}


export function Sidebar() {

  const [headers, setHeaders] = useState<HeaderData[]>([])

  useEffect(() => {
    const headers = document.querySelectorAll("h2, h3, h4, h5, h6")
    const newHeaders: HeaderData[] = []
    headers.forEach(header => {
      newHeaders.push({
        id: header.id,
        text: header.textContent?.trimStart().trimEnd().replace(/#/g, "") || null,
        level: Number(header.tagName[1]),  // h2 -> 2
        code: header.hasAttribute("data-code-heading") ? true : false
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
        "border border-[#223]",
        "hover:border-[#445]",
        "text-sm",
        "cursor-pointer select-none",
        "shadow-[0_2px_3px_0_#223]",
        "flex items-center gap-1",
        "transition-all",
        open && "shadow-none",
        "group",
      )}
        onClick={() => setOpen(!open)}
        data-open={open ? "" : undefined}
      >
        <MaterialSymbolsChevronLeftRounded className="w-4 h-4 block opacity-0  transition-all group-data-[open]:opacity-100" />
        <MaterialSymbolsMenuRounded className="w-4 h-4 block -ml-5 opacity-100 transition-all  group-data-[open]:opacity-0" />
        {
          open ? "Hide" : "Show"
        } Table of Contents
      </div>
      <div className={cn(
        "w-52 shrink-0",
        "bg-[#151519]",

        "w-80",
        "fixed",
        "z-40",
        "top-0",
        "left-0",
        "bottom-0",
        // "p-8",
        "shadow-[0_0_40px_0_#223]",
        "transition-all",
        open ? "left-0" : "-left-80",
        // "pt-12",
        "flex flex-col",
      )}
      >
        <div
          tabIndex={0}
          className={cn(
            "flex flex-col  overflow-auto",
            // "-mx-8",
            "px-4",
            "mt-12",
            "pt-4",
            "pb-20",

            "sidebar-scrollbar",
          )}>
          {
            headers.map((header, index) => (
              <a href={header.id ? `#${ header.id }` : undefined} key={index} className={cn(
                "animate-appear",
                "text-sm",
                "py-2",
                "cursor-pointer",
                // "transition-all",
                "!no-underline",
                // "!text-[#445]",
                // "hover:!text-[#aab]",
                "!text-[#ccd]",
                "hover:!text-[#88f]",
                "outline-none",
                "outline-transparent",
                "break-all",

                "hover:bg-[#223]",
                "rounded-md",

                "relative group",

                header.level === 2 && "pl-3  py-2 mt-3 !font-medium",
                header.level === 3 && "pl-8  py-1 ",
                header.level === 4 && "pl-12 py-1 text-xs",
                header.level === 5 && "pl-16 py-1 text-xs",
              )}>
                {header.level !== 2 && (
                  <div className="absolute left-4 w-0.5 top-0 bottom-0 bg-[#252540]">
                    <div className="absolute left-0 w-0.5 top-1 bottom-1 group-hover:bg-[#44a]" />
                  </div>
                )}
                {
                  header.code ?
                    <code className="text-[#ccd] group-hover:bg-[#334] group-hover:text-[#88f]">{header.text?.split(':')[0]}</code>
                    : header.text
                }
              </a>
            ))
          }
        </div>
      </div>
    </>
  )
}




function MaterialSymbolsMenuRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"></path></svg>
  )
}

function MaterialSymbolsChevronLeftRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"></path></svg>
  )
}