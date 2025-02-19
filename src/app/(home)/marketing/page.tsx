"use client"

import { useArrayArticleDemo, useArrayDemo } from "@/app/(updates)/shared"
import { LucideArrowDown, LucideArrowUp, LucideTrash, RadixIconsPlus, RadixIconsShuffle } from "../assets"
import { AnimateChildren } from "../../../../lib/AnimateChildren/src"
import { cn } from "lazy-cn"

export default function CoverPage() {

  const demo = useArrayArticleDemo(5)

  return (
    <main
      style={{
        //@ts-expect-error custom css props
        "--bg-light": "#fff",
        "--bg-light-2": "#f8f8fc",
        "--bg-light-3": "#f1f1f6",

        "--text-light": "#334",
        "--text-light-2": "#445",
        "--text-light-3": "#778",
        "--text-light-4": "#99a",

        "--text-light-accent": "#61619a",

        "--border-light": "#e3e3ef",
        "--border-light-2": "#ededf8",

        "--padding": "1rem",
      }}
      className={cn(
        "min-h-screen p-[var(--padding)]",
        "font-[family-name:var(--inter)]",

        "bg-[var(--bg-light)]",

        "text-[var(--text-light)]",

        "*:mx-auto *:max-w-[32rem]",

        "root-stable-both-scrollbar",

        "overflow-x-hidden",

        "pt-20"
      )}
    >
      <div className="flex flex-col text-xs ">
        <div className="flex gap-2">
          <button
            onClick={demo.shuffle}
            className="h-8 mb-2 text-sm px-4 rounded-full bg-[var(--bg-light-2)] border border-[var(--border-light))] flex gap-2 items-center tracking-tight text-[var(--text-light)] hover:bg-[var(--bg-light-3)]">
            <RadixIconsShuffle />
            shuffle
          </button>
          <button
            onClick={() => demo.arr.length < 6 && demo.add()}
            className="h-8 mb-2 text-sm px-4 rounded-full bg-[var(--bg-light-2)] border border-[var(--border-light))] flex gap-2 items-center tracking-tight text-[var(--text-light)] hover:bg-[var(--bg-light-3)]">
            <RadixIconsPlus />
            add
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <AnimateChildren
            delayDeletion={10000}
            useAbsolutePositionOnDelete
          >
            {
              demo.arr.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="px-3 rounded-md data-[deleting]:opacity-0 data-[adding]:opacity-0 data-[adding]:z-50 transition-all border h-12 flex gap-1 bg-[var(--bg-light)] group hover:bg-[var(--bg-light-2)] cursor-pointer relative"
                    style={{ zIndex: item.id }}
                  >
                    <div className="py-2 flex flex-col justify-center gap-1 leading-none grow">
                      <div className="font-semibold">
                        {item.title}
                      </div>
                      <div>
                        {item.author}
                      </div>
                    </div>
                    <div className="gap-2 justify-end items-center hidden group-hover:flex text-sm">
                      <button
                        onClick={() => demo.moveUp(item.id)}
                        className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                        <LucideArrowUp />
                      </button>
                      <button
                        onClick={() => demo.moveDown(item.id)}
                        className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                        <LucideArrowDown />
                      </button>
                      <button
                        onClick={() => demo.remove(item.id)}
                        className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                        <LucideTrash />
                      </button>
                    </div>
                  </div>
                )
              })
            }
          </AnimateChildren>
        </div>

      </div>
    </main>
  )
}


const libraries: {
  name: string
  author: string
  description: string
  latestVersion: string
  stars: number
}[] = [
    {
      name: "React",
      author: "Facebook",
      description: "A JavaScript library for building user interfaces",
      latestVersion: "18.2.0",
      stars: 212000,
    },
    {
      name: "Tailwind CSS",
      author: "Adam Wathan",
      description: "A utility-first CSS framework for rapid UI development",
      latestVersion: "3.4.0",
      stars: 80000,
    },
    {
      name: "Tailwind CSS",
      author: "Adam Wathan",
      description: "A utility-first CSS framework for rapid UI development",
      latestVersion: "3.4.0",
      stars: 80000,
    },
  ]