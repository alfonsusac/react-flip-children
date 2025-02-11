/* eslint-disable @next/next/no-img-element */


"use client"

import { useState } from "react";
import { Button2 } from "../ui/Button";
import { cn } from "lazy-cn";
import type { ThemedToken } from "shiki";
import { AnimateCode, type GetPossibleLengths } from "../ui/AnimateCode";
import { diffLines, diffWordsWithSpace } from "diff";

export default function Client<T extends ThemedToken[][][]>(props: {
  tokens: T
}) {
  const [token, setToken] = useState(0 as GetPossibleLengths<T>)
  const [selected, setSelected] = useState(1)
  const [byLine, setByLine] = useState(false)


  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-6xl font-semibold mb-2">Code FLIP Animation ✨</h1>
        <div className="font-mono font-bold mb-8">site by <a href="https://x.com/alfonsusac">@alfonsusac</a> | <a href="https://github.com/alfonsusac/react-flip-array">repo</a></div>
      </div>
      <div className="flex gap-8">

        <div className="flex p-2 bg-black/60 self-start rounded-lg gap-1">
          {
            props.tokens.map((_, i) => {
              return (
                <Button2 onClick={() => {
                  setToken(i as GetPossibleLengths<T>)
                  setSelected(i + 1)
                }} key={i} className="" data-selected={selected === i + 1} >{i + 1}</Button2>
              )
            })
          }
        </div>

        <div className="flex p-2 bg-black/60 self-start rounded-lg gap-1">
          <Button2 onClick={() => {
            setByLine(false)
          }} className="" data-selected={!byLine} >By Word</Button2>
          <Button2 onClick={() => {
            setByLine(true)
          }} className="" data-selected={byLine} >By Line</Button2>
        </div>

      </div>
      <div className="w-[60rem] h-[30rem] border-8 border-black/40 rounded-2xl mt-4 p-4 px-6 bg-[#171F2B] shadow-[0_2px_0_0_#fff2]">
        <div className={cn(
          "will-change-[filter]",
          "transform-gpu",
          "whitespace-pre relative",
          "relative text-xl font-mono w-full h-full",
          "[&_span]:transition-all",
          "[&_span]:duration-700",
          "[&_span]:opacity-100",
          "[&_span]:inline-block",
          "[&_span]:absolute",
          "data-[adding=true]:[&_span]:opacity-0",
          "data-[adding=true]:[&_span]:duration-0",
          "data-[adding=true]:[&_span]:absolute",
          "data-[deleting=true]:[&_span]:opacity-0",
          "data-[deleting=true]:[&_span]:blur-[2px]",
        )}>
          <AnimateCode
            state={token}
            tokens={props.tokens}
            diffFunction={
              byLine ? diffLines : diffWordsWithSpace
            }
          />
          <img className="absolute bottom-0 right-0 opacity-20 hue-rotate-180" src="/logo.svg" alt="" />
        </div>
      </div>
    </div>
  )
}