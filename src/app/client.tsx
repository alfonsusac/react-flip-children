"use client"

import { useState } from "react"
import { Button } from "./ui/Button"
import { ReorderArray } from "./ui/Reorder"
import type { ThemedToken } from "shiki"

export function Client(props: {
  token: ThemedToken[][]
}) {

  const [arr, setArr] = useState(Array.from({ length: 50 }, (_, i) => i + 1))

  const [isFixedSpeed, setFixedSpeed] = useState(false)
  const [isFixedWidth, setFixedWidth] = useState(false)

  // @ts-expect-error (e is not used)
  const shuffle = (e) => {
    e.preventDefault()
    setArr([...arr].sort(() => Math.random() - 0.5))
  }

  // @ts-expect-error (e is not used)
  const reverse = (e) => {
    e.preventDefault()
    setArr([...arr].reverse())
  }

  return (
    <div className="flex flex-col items-start [&_h2]:my-4 [&_h2]:text-xl [&_h2]:font-semibold w-full">

      <div className="flex w-full gap-8">
        <div className="">

          <div>
            <h1 className="text-4xl font-semibold mb-2">Array FLIP Animation ✨</h1>
            <div className="font-mono font-bold mb-8">site by <a href="https://x.com/alfonsusac">@alfonsusac</a> | <a href="https://github.com/alfonsusac/react-flip-array">repo</a></div>
          </div>


          <div className="flex mb-8 gap-2">
            <Button onClick={() => setFixedWidth(true)} className={isFixedWidth ? "bg-white/30" : undefined}>Fixed Width</Button>
            <Button onClick={() => setFixedWidth(false)} className={!isFixedWidth ? "bg-white/30" : undefined}>Varying Width</Button>
          </div>
          <div className="flex mb-8 gap-2">
            <Button onClick={() => setFixedSpeed(true)} className={isFixedSpeed ? "bg-white/30" : undefined}>Fixed Speed</Button>
            <Button onClick={() => setFixedSpeed(false)} className={!isFixedSpeed ? "bg-white/30" : undefined}>Fixed Duration</Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={shuffle} className="mb-4">Shuffle</Button>
            <Button onClick={reverse} className="mb-4">Reverse</Button>
          </div>
        </div>

        <pre className="p-8 border border-white/20 rounded-md self-start">
          {props.token.map((line, i) => {
            return (
              <div key={i}>
                {line.map((token, i) => {
                  return <span key={i} style={{ color: token.color }}>{token.content}</span>
                })}
              </div>
            )
          })}
        </pre>
      </div>
      {
        isFixedWidth && (
          <>
            <h2 className="font-mono">Fixed Width</h2>
            <div className="border border-white/30 rounded-lg self-stretch flex p-2 gap-2 flex-wrap w-full overflow-hidden">
              <ReorderArray fixedSpeed={isFixedSpeed}>
                {
                  arr.map((item) => (
                    <div key={item} className="w-20 h-20 p-2 border border-zinc-600 bg-zinc-800 shadow-xl rounded-md group flex flex-col origin-center">
                      <div className="grow">
                        {item}
                      </div>
                      <div className="flex justify-end transition-all opacity-0 group-hover:opacity-100 [&_button]:p-1 [&_button]:px-3 hover:[&_button]:bg-red-500 [&_button]:rounded-md hover:[&_button]:bg-white/20 [&_button]:transition-all">
                        <button onClick={() => {
                          // Move this item up one index
                          const index = arr.indexOf(item)
                          if (index > 0) {
                            const newArr = [...arr]
                            newArr[index] = arr[index - 1]
                            newArr[index - 1] = item
                            setArr(newArr)
                          }
                        }}>{'<'}</button>
                        <button onClick={() => {
                          // Move this item down one index
                          const index = arr.indexOf(item)
                          if (index < arr.length - 1) {
                            const newArr = [...arr]
                            newArr[index] = arr[index + 1]
                            newArr[index + 1] = item
                            setArr(newArr)
                          }
                        }}>{'>'}</button>
                      </div>
                    </div>
                  ))
                }
              </ReorderArray>
            </div>
          </>
        )
      }
      {
        !isFixedWidth && (
          <>
            <h2 className="font-mono">Varying Width</h2>
            <div className="h-[30rem] border border-white/30 rounded-lg self-stretch flex p-2 gap-2 flex-wrap w-full overflow-hidden">
              <ReorderArray fixedSpeed={isFixedSpeed}>
                {
                  arr.map((item) => (
                    <div key={item} className="w-20 h-20 p-2 border border-white/10 bg-zinc-800 rounded-md grow"
                      style={{ width: `${ 20 + item * 5 }px` }}
                    >{item}</div>
                  ))
                }
              </ReorderArray>
            </div>
          </>
        )
      }
    </div>
  )
}