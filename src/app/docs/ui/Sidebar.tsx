"use client"

import { cn } from "lazy-cn"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState, type SVGProps } from "react"


type HeaderData = {
  id: string,
  text: string | null,
  level: number,
  code?: boolean,
}


export function Sidebar() {

  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

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

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const nextTheme = useTheme()

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-hidden", "[@media(min-width:1135px)]:overflow-auto")
    } else {
      document.body.classList.remove("overflow-hidden", "[@media(min-width:1135px)]:overflow-auto")
    }
  }, [sidebarOpen])


  return (
    <>
      <div className={cn(
        "transition-all",
        "fixed top-0 left-0 right-0 h-20 z-40",
        "pointer-events-none",
        "bg-[var(--bg-light)]",
        "dark:bg-[var(--bg-dark)]",
        "top-fade-mask",
      )}>
      </div>
      <div className={cn(
        "select-none",

        "bg-[var(--bg-light)]",
        "dark:bg-[var(--bg-dark)]",

        "fixed top-4 left-4 z-50 p-2",
        "px-3",
        "rounded-lg",

        "border",

        "border-[#dde]",
        "shadow-[0_0px_5px_0_#ddf]",
        "[@media(pointer:fine)]:hover:border-[#99a]",
        "active:border-[#99a]",

        "dark:border-[#334]",
        "dark:shadow-[0_0px_5px_0_#334]",
        "dark:[@media(pointer:fine)]:hover:border-[#445]",
        "dark:active:border-[#445]",

        "text-sm",
        "cursor-pointer select-none",
        "flex items-center gap-1",
        "transition-[border,box-shadow,background-color]",
        sidebarOpen && "shadow-none dark:shadow-none border-transparent dark:border-transparent",
        "group",
        "touch-none",

        "w-52"
      )}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        data-open={sidebarOpen ? "" : undefined}
      >
        <MaterialSymbolsChevronLeftRounded className="w-4 h-4 block opacity-0  transition-all group-data-[open]:opacity-100" />
        <MaterialSymbolsMenuRounded className="w-4 h-4 block -ml-5 opacity-100 transition-all  group-data-[open]:opacity-0" />
        {
          sidebarOpen ? "Hide" : "Show"
        } Table of Contents
      </div>
      {/* Overlay */}
      <div
        className={cn(
          "fixed w-[200vw] h-[200vw]  z-40 transition-all",
          "top-0 left-0",
          sidebarOpen ? [
            "left-0 bg-black/20",
            "backdrop-blur-sm",
            "[@media(min-width:1135px)]:backdrop-blur-none",

            "bg-black/20",
            "[@media(min-width:1135px)]:bg-transparent",

            "[@media(min-width:1135px)]:pointer-events-none",
          ] : "pointer-events-none",
        )}
        onClick={() => {
          window.innerWidth < 1135 &&
            setSidebarOpen(false)
        }}
      />

      <div className={cn(
        "shrink-0",
        "bg-[var(--bg-light)]",
        "dark:bg-[var(--bg-dark)]",
        "w-full",
        "max-w-80",
        "fixed",
        "z-40",
        "top-0",
        "left-0",
        "-bottom-2 rounded-br-xl",
        // "p-8",
        "transition-all",
        sidebarOpen ? [
          "left-0 dark:shadow-[0_0_40px_0_var(--bg-dark)]",
          // "shadow-[0_0_40px_0_var(--bg-light)]",
        ] : "-left-80 opacity-0 blur-md",
        "flex flex-col",
      )}
      >

        {/* Top Bar */}
        <div className="pt-12">

          {/* Content */}
          <div className="px-4 mt-2 flex">


          </div>
        </div>
        <div
          className={cn(
            "flex flex-col  overflow-auto",
            // "-mx-8",
            "px-4",
            // "mt-12",
            // "pt-4",
            "pb-20",

            "sidebar-scrollbar",
          )}>
          {/* Theme Switcher */}
          <div className="rounded-3xl !box-border flex p-0.5 ml-1 mb-2 self-start">
            {
              [
                {
                  content: <LucideSun />,
                  onClick: () => nextTheme.theme === "light"
                    ? nextTheme.setTheme("system")
                    : nextTheme.setTheme("light"),
                  active: nextTheme.theme === "light",
                },
                {
                  content: <LucideMoon />,
                  onClick: () => nextTheme.theme === "dark"
                    ? nextTheme.setTheme("system")
                    : nextTheme.setTheme("dark"),
                  active: nextTheme.theme === "dark",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={item.onClick}
                  className={cn(
                    "w-8 h-8 *:w-full *:h-full p-1.5 rounded-3xl",
                    "border border-transparent",
                    "[@media(pointer:fine)]:hover:border-[#ccd]",
                    "[@media(pointer:fine)]:hover:dark:border-[#445]",

                    "text-[var(--text-light)]",
                    "dark:text-[var(--text-dark)]",

                    mounted && item.active && [
                      "bg-[#ebebef]",
                      "dark:bg-[#334]",

                      "text-[#111]",
                      "dark:text-[#dde]",
                    ],
                  )}
                >
                  {item.content}
                </div>
              ))
            }
          </div>
          <div className="text-sm px-2 opacity-50 select-none">
            Press <kbd className="text-xs">Ctrl+F</kbd> (Windows) or <kbd className="text-xs">Cmd+F</kbd> (Mac) to search the page!
          </div>
          {
            headers.map((header, index) => (
              <a
                onClick={() => {
                  // check screen width
                  if (window.innerWidth < 1135) {
                    setSidebarOpen(false)
                  }
                }}
                href={header.id ? `#${ header.id }` : undefined}
                key={index}
                data-visible={visible === header.id ? "" : undefined}
                className={cn(
                  "select-none",

                  "animate-appear",
                  "text-sm",
                  "py-2",
                  "cursor-pointer",
                  "!no-underline",

                  "text-[#556]",
                  "hover:text-[#334]",
                  
                  "dark:text-[#aab]",
                  "dark:hover:text-[#dde]",

                  "outline-none",
                  "outline-transparent",

                  "hover:bg-[#f6f6ff]",
                  "dark:hover:bg-[#223]",
                  "rounded-md",

                  "relative group",
                  "data-[visible]:text-[#2b2bc6]",
                  "dark:data-[visible]:text-[#88f]",

                  "truncate",
                  "shrink-0",

                  header.level === 2 && "pl-3  py-2 mt-3 font-semibold",
                  header.level === 3 && "pl-7  py-[0.35rem] -my-0.5",
                  header.level === 4 && "pl-12 py-[0.35rem] -my-[0.1rem] text-xs",
                  header.level === 5 && "pl-12 py-[0.35rem] -my-[0.1rem] text-xs",
                )}>
                {header.level !== 2 && (
                  <div className="absolute left-4 w-0.5 top-0 bottom-0 dark:bg-[#252540] bg-[#eef] transition-all">
                    <div className="absolute left-0 w-0.5 top-1 bottom-1 group-data-[visible]:bg-[#77c] transition-all" />
                  </div>
                )}
                {
                  header.code ?
                    <code className="text-[#ccd] dark:group-hover:bg-[#334] group-hover:text-[#88f]">{header.text?.split(':')[0]}</code>
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


function LucideSun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></g></svg>
  )
}


function LucideMoon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"></path></svg>
  )
}