"use client"

import { cn } from "lazy-cn"
import { useEffect, useRef, useState, type SVGProps } from "react"


type HeaderData = {
  id: string,
  text: string | null,
  level: number,
  code?: boolean,
}


export function Sidebar() {

  const [headers, setHeaders] = useState<HeaderData[]>([])

  const [visible, setVisible] = useState<string | null>()

  useEffect(() => {
    const headers = document.querySelectorAll("h2, h3, h4, h5, h6")
    const newHeaders: HeaderData[] = []
    const observers: IntersectionObserver[] = []
    headers.forEach(header => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(header.id)
          }
        })
      }, {
        root: null,
        rootMargin: "0% 0% -80% 0%",
        threshold: 1,
      })

      observer.observe(header)
      observers.push(observer)


      newHeaders.push({
        id: header.id,
        text: header.textContent?.trimStart().trimEnd().replace(/#/g, "") || null,
        level: Number(header.tagName[1]),  // h2 -> 2
        code: header.hasAttribute("data-code-heading") ? true : false
      })
    })
    setHeaders(newHeaders)

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  const [open, setOpen] = useState(false)


  return (
    <>
      <div className={cn(
        "fixed top-0 left-0 right-0 h-20 z-40",
        "pointer-events-none",
        "bg-gradient-to-b from-[#151519] to-[#15151900]",
        "top-fade-mask",
      )}>
      </div>
      <div className={cn(
        "fixed top-4 left-4 z-50 p-2 bg-[#151519]",
        "px-3",
        "rounded-lg",
        "border border-[#223]",
        "[@media(pointer:fine)]:hover:border-[#445]",
        "active:border-[#445]",
        "text-sm",
        "cursor-pointer select-none",
        "shadow-[0_0px_5px_0_#334]",
        "flex items-center gap-1",
        "transition-all",
        open && "shadow-none border-transparent",
        "group",
        "touch-none",
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
        "shrink-0",
        "bg-[#151519]",
        "w-80",
        "fixed",
        "z-40",
        "top-0",
        "left-0",
        "-bottom-2 rounded-br-xl",
        // "p-8",
        "transition-all",
        open ? "left-0 shadow-[0_0_40px_0_#223]" : "-left-80",
        "flex flex-col",
      )}
      >
        <div
          className={cn(
            "flex flex-col  overflow-auto",
            // "-mx-8",
            "px-4",
            "mt-12",
            "pt-4",
            "pb-20",

            "sidebar-scrollbar",
          )}>
          <div className="text-sm px-4 opacity-40 hover:opacity-80 select-none">
            {/* "Press Ctrl+F (Windows) or Cmd+F (Mac) to search the page!" */}
            Press <kbd className="text-xs">Ctrl+F</kbd> (Windows) or <kbd className="text-xs">Cmd+F</kbd> (Mac) to search the page!
          </div>
          {
            headers.map((header, index) => (
              <a
                onClick={() => {
                  // check screen width
                  if (window.innerWidth < 1200) {
                    setOpen(false)
                  }
                }}
                href={header.id ? `#${ header.id }` : undefined}
                key={index}
                data-visible={visible === header.id ? "" : undefined}
                className={cn(
                  "animate-appear",
                  "text-sm",
                  "py-2",
                  "cursor-pointer",
                  "!no-underline",
                  "!text-[#aab]",
                  "hover:!text-[#dde]",
                  "outline-none",
                  "outline-transparent",

                  "hover:bg-[#223]",
                  "rounded-md",

                  "relative group",
                  "data-[visible]:!text-[#88f]",

                  "truncate",
                  "shrink-0",

                  header.level === 2 && "pl-3  py-2 mt-3 !font-semibold",
                  header.level === 3 && "pl-7  py-[0.35rem] -my-0.5",
                  header.level === 4 && "pl-12 py-[0.35rem] -my-[0.1rem] text-xs",
                  header.level === 5 && "pl-12 py-[0.35rem] -my-[0.1rem] text-xs",
                )}>
                {header.level !== 2 && (
                  <div className="absolute left-4 w-0.5 top-0 bottom-0 bg-[#252540]">
                    <div className="absolute left-0 w-0.5 top-1 bottom-1 group-data-[visible]:bg-[#77c]" />
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