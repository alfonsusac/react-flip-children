/* eslint-disable react/jsx-key */
"use client"

import { useEffect, useImperativeHandle, useRef, useState, type ComponentProps, type ReactNode, type SVGProps } from "react"
import { Button } from "../ui/Button"
import { ReorderArray } from "../ui/Reorder"
import { useKeycap } from "../ui/Keyboard"
import type { ThemedToken } from "shiki"
import { AnimateCode } from "../ui/AnimateCode"
import { cn } from "lazy-cn"
import { DragArea } from "../ui/DragArea"
import BackCard from "../ui/backcard.png"
import { AnimateChild } from "../ui/Reorder2"


export function Client(props: {
  code: ThemedToken[][][],
}) {

  const [arr, setArr] = useState(Array.from({ length: 5 }, (_, i) => i + 1))
  const idRef = useRef(arr.length + 1)

  const [isFixedSpeed, setFixedSpeed] = useState(true)
  const [useEaseInOut, setUseEaseInOut] = useState(false)

  const [example, setExample] = useState(0)
  const gotoExample = (ex: number) => () => setExample(ex)

  const [duration, setDuration] = useState(500)
  const [speed, setSpeed] = useState(1)

  const shuffle = () => setArr([...arr].sort(() => Math.random() - 0.5))
  const reverse = () => setArr([...arr].reverse())
  const add = () => setArr([...arr, idRef.current++])
  const deleteHalfRandom = () => {
    const newArr = [...arr]
    for (let i = 0; i < newArr.length / 2; i++) {
      const index = Math.floor(Math.random() * newArr.length)
      newArr.splice(index, 1)
    }
    setArr(newArr)
  }
  const deleteRandom = () => {
    const index = Math.floor(Math.random() * arr.length)
    setArr(arr.filter((_, i) => i !== index))
  }
  useKeycap("s", "shuffle", undefined, shuffle)
  useKeycap("r", "reverse", undefined, reverse)
  useKeycap("a", "add", undefined, add)
  useKeycap("d", "delete", undefined, deleteRandom)
  useKeycap("t", "thanos", undefined, deleteHalfRandom)

  const cardProps = (item: number) => ({
    style: { zIndex: item },
    onDelete: () => setArr(arr.filter((i) => i !== item)),
    onLeft: () => {
      const index = arr.indexOf(item)
      if (index > 0) {
        const newArr = [...arr]
        newArr[index] = arr[index - 1]
        newArr[index - 1] = item
        setArr(newArr)
      }
    },
    onRight: () => {
      const index = arr.indexOf(item)
      if (index < arr.length - 1) {
        const newArr = [...arr]
        newArr[index] = arr[index + 1]
        newArr[index + 1] = item
        setArr(newArr)
      }
    },
    children: item
  })

  return (
    <div className="flex flex-col  items-start [&_h2]:my-4 [&_h2]:text-xl [&_h2]:font-semibold w-full h-screen  py-10">

      <div className="flex w-full gap-8">
        <div className="flex flex-col items-start gap-2">
          <div>
            <h1 className="text-4xl font-light mb-1 text-zinc-300 blur-[0.4px] leading-none">Array FLIP Animation</h1>
            <div className="font-normal text-zinc-400 blur-[0.4px]">site by <a href="https://x.com/alfonsusac">@alfonsusac</a> | <a href="https://github.com/alfonsusac/react-flip-array">repo</a></div>
          </div>

          <div className="flex mb-4 gap-3">
            <div className="flex gap-[3px] p-0.5 relative">
              <div className="bg-black h-[4.3rem] absolute -top-[1px] -left-[1px] -right-[1px] rounded-[6] shadow-[0_1px_0_0_#fff2]" />
              <Button
                data-selected={isFixedSpeed}
                onClick={() => setFixedSpeed(!isFixedSpeed)}>
                <ButtonIndicator selected={isFixedSpeed} />
                Fixed Speed
              </Button>
              <Button
                data-selected={useEaseInOut}
                onClick={() => setUseEaseInOut(!useEaseInOut)}>
                <ButtonIndicator selected={useEaseInOut} />
                Use Ease-In-Out
              </Button>

            </div>
            <div className="rounded-[3px] p-2 z-10 flex flex-col">
              {
                !isFixedSpeed ? (
                  <div className="flex flex-col gap-1 grow">
                    <ButtonLabel>Duration</ButtonLabel>
                    <input value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="grow w-32 bg-black/50 px-4 flex items-center justify-end rounded-md font-mono shadow-[inset_0_0_10px_0_#000,_0_1px_0_0_#fff1] text-white/70">
                    </input>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 grow">
                    <ButtonLabel>Speed Multiplier</ButtonLabel>
                    <input type="number" value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="grow w-32 bg-black/50 px-4 flex items-center justify-end rounded-md font-mono shadow-[inset_0_0_10px_0_#000,_0_1px_0_0_#fff1] text-white/70">
                    </input>
                  </div>
                )
              }
            </div>
          </div>

        </div>


        <pre className="grow p-3 border whitespace-pre  border-white/10 bg-black rounded-md self-start relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 glass z-10 m-[1px] pointer-events-none" />
          <div className={cn(
            "relative w-[48rem] h-[8.5rem] font-medium font-mono",
            "[&_span]:transition-all",
            "[&_span]:duration-700",
            "[&_span]:opacity-100",
            "[&_span]:inline-block",
            "[&_span]:absolute",
            "data-[adding=true]:[&_span]:opacity-0",
            "data-[adding=true]:[&_span]:duration-0",
            "data-[deleting=true]:[&_span]:opacity-0",
            "data-[deleting=true]:[&_span]:blur-sm",
          )}>
            <AnimateCode
              charHeight={24}
              charWidth={9.8}
              state={isFixedSpeed ? 0 : 1}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              tokens={props.code as any}
            />
          </div>
        </pre>
      </div>

      <div className="flex self-stretch gap-4">
        <div className="flex mb-3 gap-[3px] relative p-0.5">
          <div className="bg-black h-[4.3rem] absolute -top-[1px] -left-[1px] -right-[1px] rounded-[6] shadow-[0_1px_0_0_#fff2]" />
          {
            [<>Fixed<br />Width</>,
            <>Changing<br />Width</>,
            <>Varying<br />Width</>,
            <>Vertical<br />List</>,
            <>🃏 Balatro</>].map((t, i) => {
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Button onClick={gotoExample(i)} data-selected={example === i}>
                    <ButtonIndicator selected={example === i} />
                    {i}
                  </Button>
                  <ButtonLabel>{t}</ButtonLabel>
                </div>
              )
            })
          }
        </div>
        <div className="grow flex gap-[3px] relative p-0.5">
          <div className="bg-black h-[4.3rem] absolute -top-[1px] -left-[1px] -right-[1px] rounded-[6] shadow-[0_1px_0_0_#fff2]" />
          {
            ([
              [shuffle, "shuffle", "S", <>Shuffle</>],
              [reverse, "reverse", "R", <>Reverse</>],
              [add, "add", "A", <>Add</>],
              [deleteRandom, "delete", "D", <>Delete<br />Random</>],
              [deleteHalfRandom, "thanos", "T", <>Thanos<br />Snap 🫰</>],
            ] as const).map(([fn, id, key, label]) => {
              return (
                <div key={id} className="flex flex-col items-center gap-2">
                  <Button onClick={fn} id={id}>{key}</Button>
                  <ButtonLabel>{label}</ButtonLabel>
                </div>
              )
            })
          }
          <DragArea
            onMoveRight={() => setArr([...arr, idRef.current++])}
            onMoveLeft={() => setArr(arr.slice(0, arr.length - 1))}
            className="bg-[#333] rounded-[8px] h-[4rem] w-[18rem] z-10 shadow-[inset_0_1px_0_0_#fff2] flex items-center justify-center font-mono text-white/30 font-semibold text-xs select-none cursor-pointer">
            {`<-- remove last ··· insert last -->`}
          </DragArea>
          <DragArea
            onMoveRight={() => {
              // log added elements
              const id = idRef.current++
              console.log("added", id)
              setArr([id, ...arr])
            }}
            onMoveLeft={() => {
              // log removed elements
              console.log("removed", arr[0])
              setArr(arr.slice(1))
            }}
            className="bg-[#333] rounded-[8px] h-[4rem] w-[18rem] z-10 shadow-[inset_0_1px_0_0_#fff2] flex items-center justify-center font-mono text-white/30 font-semibold text-xs select-none cursor-pointer">
            {`<-- remove first ··· insert first -->`}
          </DragArea>
          <div className="w-40 grow h-[4rem] bg-black z-10 rounded-md shadow-[inset_1px_1px_1px_0_#fff4] p-2 flex flex-col items-end">
            <div className="text-zinc-600/60 text-xs font-bold">COUNT</div>
            <div className="relative">
              <span className="font-digit text-3xl text-[#ff3c3c] relative blur-[0.5px] z-20">{arr.length}</span>
              <span className="font-digit text-3xl text-[#ff0000] absolute right-0 top-0 blur-[10px] scale-y-[1.3] scale-x-[3] z-10 font-semibold">{arr.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className={cn(
        "bg-black/40 rounded-lg flex items-start p-6 overflow-hidden relative shadow-[inset_0_10px_20px_0_#0008]",
        "grow w-full transition-all",
        example === 4 && "bg-green-800 shadow-none"
      )}>
        <div className={cn(
          "flex gap-2 flex-wrap max-h-none w-full self-start",
          example === 3 && "flex-col self-stretch",
          example === 4 && "flex-row self-stretch items-center justify-center flex-nowrap *:shrink *:min-w-0 pr-32"
        )}>
          <AnimateChild
            usingFixedSpeed={isFixedSpeed}
            animationOptions={{
              easing: useEaseInOut ? "ease-in-out" : "ease-out",
            }}
            speed={speed}
            duration={duration}
            exitAnimation={example === 3 ? [
              [
                { opacity: 1, transform: "translateX(0)" },
                { opacity: 0, transform: "translateX(100%)" },
              ],
              undefined
            ] : example === 4 ? [
              [
                { transform: "translateX(0)" },
                { transform: "translateY(60vh) rotateY(80deg)" },
              ],
              undefined
            ] : undefined}
          >
            {example === 0 &&
              arr.map(item => <Card key={item} {...cardProps(item)} />)}
            {example === 1 &&
              arr.map(item => <Card key={item} {...cardProps(item)} className="grow bg-emerald-700 border-emerald-600"
                style={{ width: `${ ~~(item * Math.PI % 4) * 100 + 100 }px` }} />)}
            {example === 2 &&
              arr.map(item => <Card key={item} {...cardProps(item)} className="bg-yellow-600 border-yellow-400 data-[adding=true]:!-translate-x-[10rem]"
                style={{ width: `${ ~~(item * Math.PI % 4) * 100 + 100 }px` }} />)}
            {example === 3 &&
              arr.map(item => <Card key={item} {...cardProps(item)}
                className="bg-zinc-800 border-none self-center p-3 px-5 h-auto w-full max-w-96 rounded-lg [&_.db]:top-2.5 [&_.db]:right-2 [&_.rb]:top-2.5 [&_.rb]:right-[2rem] [&_.rb]:rotate-90 [&_.lb]:right-[3.5rem] [&_.lb]:left-[unset] [&_.lb]:top-2.5 [&_.lb]:rotate-90 flex-row items-start gap-3 relative shadow-[inset_0_1px_0_0_#fff2,_inset_0_-1px_0_0_#0002]">
                {~~(item * Math.PI % 4) > 1
                  ? (<div className="w-4 h-4 mt-1 shrink-0 rounded-md bg-lime-600 relative after:w-1 after:h-1 after:bg-zinc-200 after:absolute after:rounded-md after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2" />)
                  : (<div className="w-4 h-4 mt-1 shrink-0 rounded-md bg-white/5" />)}
                <div className="flex flex-col gap-1">
                  {todoList[item % todoList.length][0]}
                  <span className="text-sm">
                    {todoList[item % todoList.length][1]}
                  </span>
                </div>
              </Card>)}
            {example === 4 &&
              arr.map((item, index) => <PlayingCard itemId={item} key={item} {...cardProps(item)} zIndex={index} length={arr.length} />)}
          </AnimateChild>
        </div>
      </div>
    </div>
  )
}

function ButtonLabel(props: {
  children: ReactNode
}) {
  return (
    <div className="text-zinc-500 font-semibold text-[0.6rem] leading-none">{props.children}</div>
  )
}

function ButtonIndicator(props: {
  selected: boolean
}) {

  return (
    <div
      className={cn(
        "w-1.5 h-1.5 rounded-full absolute top-3 left-3",
        "transition-all",
        props.selected ? [
          "bg-[#0f0]",
          "shadow-[inset_0_0_3px_#0006,_inset_-1px_-1px_1px_2px_#0fa91200,_0_0_10px_2px_#0f0f]",
        ] : [
          "bg-[#0002]",
          "shadow-[inset_0_0_3px_#0006,_inset_-1px_-1px_1px_2px_#0fa91200]",
        ]
      )}
    />
  )

}

function PlayingCard(
  { className, itemId, onLeft, onRight, onDelete, length, ref: _ref, zIndex, style, ...props }: ComponentProps<"div"> & {
    onLeft: () => void
    onRight: () => void
    onDelete: () => void,
    itemId: number,
    zIndex: number,
    length: number,
  }
) {
  const rank = playingCards[itemId % playingCards.length].rank
  const suit = playingCards[itemId % playingCards.length].suit
  const isRed = suit === "♥" || suit === "♦"
  const isJoker = suit.startsWith("J")

  const [hover, setHover] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  useImperativeHandle(_ref, () => ref.current!)
  useEffect(() => {
    if (hover) {
      ref.current?.setAttribute("data-hover", "true")
      setTimeout(() => {
        ref.current?.classList.add("top")
      }, 100)
    }
    if (!hover) {
      const timer = setTimeout(() => {
        ref.current?.removeAttribute("data-hover")
        ref.current?.classList.remove("top")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [hover])

  return (
    <div className={cn(
      "group/card pcard relative",
      "data-[adding=true]:duration-0",
    )}
      onMouseEnter={(e) => {
        setHover(true)
      }}
      onMouseLeave={(e) => {
        setHover(false)
      }}
      ref={ref}
      style={{
        ...style,
        zIndex: zIndex,
        // Create an arc based on the length of the array
        top: `${ (() => {
          return Math.round((160 / (((length - 1) / 2) ** 2)) * (zIndex - ((length - 1) / 2)) ** 2);
        })() }px`,
        // perspective: "10000px",
      }}
      {...props}
    >
      <div className={cn(
        "pcard-display w-36",
        // !hover && "animate-sway",
      )}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="animate-sway"
          style={{
            transformStyle: "preserve-3d",
            // based on index
            animationDelay: `-${ itemId * 0.4 }s`,
          }}
        >
          <Card
            style={{
              backfaceVisibility: "hidden",
            }}
            className={cn(
              "front",
              "bg-[#eee] border-none text-black aspect-[1_/_1.4] h-full w-36",
              "[&_.sb]:text-zinc-500 hover:[&_.sb]:text-zinc-800 hover:[&_.sb]:bg-zinc-400/20",
              "relative select-none",

              "[&_.lb]:top-1/2 [&_.lb]:-translate-y-1/2",
              "[&_.rb]:top-1/2 [&_.rb]:-translate-y-1/2",
              // "relative select-none !transition-all !scale-100 will-change-auto hover:!scale-105 hover:!rotate-2",
            )}
            onLeft={onLeft}
            onRight={onRight}
            onDelete={onDelete}
          >
            {
              isJoker
                ? (
                  <>
                    <div className="w-4 break-words leading-none absolute top-2 left-2">JOKER</div>
                    <div className="w-4 break-words leading-none absolute bottom-2 right-2 rotate-180">JOKER</div>
                    <TwemojiJoker className="w-32 h-32 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-6" />
                  </>
                )
                : (
                  <>
                    <div className="absolute top-2 left-2 text-3xl font-normal leading-none">{rank}</div>
                    <div className={cn(
                      "absolute top-10 left-2.5 text-2xl font-normal leading-none",
                      isRed ? "text-red-600" : "text-black"
                    )}>{suit}</div>
                    <div className="absolute bottom-2 right-2 text-3xl font-normal leading-none rotate-180">{rank}</div>
                    <div className={cn(
                      "absolute bottom-10 right-2.5 text-2xl font-normal leading-none rotate-180",
                      isRed ? "text-red-600" : "text-black"
                    )}>{suit}</div>

                    <div className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[4rem] font-normal leading-none",
                      isRed ? "text-red-600" : "text-black"
                    )}>{suit}</div>
                  </>
                )
            }
          </Card >
          <div className="back bg-[#eee] w-full h-full absolute inset-0 rounded-md shadow-[0_0_2px_1px_#0004]"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <img src={BackCard.src} className="w-full h-full brightness-95" />
          </div>
        </div>
      </div>
    </div>
  )
}


function Card(
  { className, children, onLeft, onRight, onDelete, ...props }: ComponentProps<"div"> & {
    onLeft: () => void
    onRight: () => void
    onDelete: () => void
  }
) {

  return (
    <div
      className={cn(
        "data-[adding=true]:duration-0",
        "data-[adding=true]:opacity-0",
        "relative w-20 h-20 p-2 border border-indigo-700 bg-indigo-800 shadow-xl rounded-md group flex flex-col",
        "transition-all duration-1000",
        "group",
        className,
      )}
      {...props}
    >
      {children}
      <CardButton onClick={onDelete} className="right-1 top-1 db sb">
        <MaterialSymbolsCloseRounded className="w-full h-full" />
      </CardButton>
      <CardButton onClick={onLeft} className="left-1 bottom-1 lb sb">
        <MaterialSymbolsArrowLeftAlt className="w-full h-full" />
      </CardButton>
      <CardButton onClick={onRight} className="right-1 bottom-1 rb sb">
        <MaterialSymbolsArrowRightAlt className="w-full h-full" />
      </CardButton>
    </div>
  )
}

function CardButton(
  { className, ...props }: ComponentProps<"button">
) {
  return (<button className={cn("opacity-0 group-hover:opacity-100 absolute  w-7 h-7 p-1 text-white/40 hover:text-white/80 hover:bg-white/10 rounded-md", className)}  {...props} />)
}

function MaterialSymbolsCloseRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"></path></svg>
  )
}

function MaterialSymbolsArrowLeftAlt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55z"></path></svg>
  )
}

function MaterialSymbolsArrowRightAlt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z"></path></svg>
  )
}

function pseudoRandom(index: number): boolean {
  return Math.sin(index * Math.PI) % 1 > 0.5;
}

// normal todo list items with description and varying length, sometimes 2 sentences, sometimes 1, rarely with emoji
const todoList = [
  ["Buy groceries", "Pick up fruits, vegetables, and snacks from the store."],
  ["Finish report", "Complete the monthly financial report for the team."],
  ["Call mom", "Catch up and check how she’s doing."],
  ["Book dentist appointment", "Schedule a routine cleaning for next week."],
  ["Water plants", "Ensure all indoor plants are hydrated and healthy."],
  ["Read a book", "Finish at least one chapter of the novel I started."],
  ["Organize desk", "Sort through papers and declutter the workspace."],
  ["Plan weekend trip", "Choose a destination and book accommodations."],
  ["Clean the kitchen", "Wipe down counters and clean the sink."],
  ["Review code", "Go through pull requests and leave comments."],
  ["Send invoices", "Email out the pending invoices to clients."],
  ["Check car oil", "Ensure the car oil levels are good for the road trip."],
  ["Update portfolio", "Add recent projects to the portfolio website."],
  ["Exercise", "Do a 30-minute workout or a brisk walk outside."],
  ["Prepare for meeting", "Review the agenda and draft key discussion points."],
  ["Meditate", "Spend 10 minutes in mindfulness and deep breathing."],
  ["Reply to emails", "Respond to pending messages in the inbox."],
  ["Fix the leaky faucet", "Replace washers to stop the dripping in the bathroom."],
  ["Write a blog post", "Draft and publish an article on the topic of the week."],
  ["Declutter closet", "Donate clothes I no longer wear to charity."],
  ["Schedule a haircut", "Call the salon and find a time that works this week."],
  ["Watch tutorial", "Learn about the new design tool I’ve been wanting to explore."],
  ["Buy gift", "Pick something nice for Sarah’s birthday next weekend."],
  ["Take out the trash", "Dispose of all garbage and recyclables."],
  ["Plan meals", "Decide what to cook for the week and make a list of ingredients."],
  ["Backup files", "Save important documents and photos to the cloud."],
  ["Research camera options", "Find the best DSLR for beginner photography."],
  ["Practice piano", "Spend an hour working on Clair de Lune."],
  ["Renew subscription", "Update payment info for the monthly service."],
  ["Check bank balance", "Review recent transactions and ensure everything is in order."],
  ["Repair bike", "Fix the flat tire and adjust the brakes."],
  ["Write thank-you notes", "Send appreciation messages to friends and colleagues."],
  ["Study vocabulary", "Review the new words from my language class."],
  ["Install updates", "Ensure all devices are running the latest software."],
  ["Make coffee", "Brew a fresh cup to kickstart the day ☕."],
  ["Brainstorm ideas", "Come up with topics for the next project."],
  ["Go for a walk", "Take a relaxing stroll in the park to clear my head."],
  ["Organize photo album", "Sort pictures into folders by date and event."],
  ["Cook dinner", "Try a new recipe for a homemade pizza."],
  ["Prepare tax documents", "Gather all receipts and forms for filing taxes."],
  ["Practice guitar", "Learn the chords to a new song and improve finger strength."],
  ["Renew library books", "Avoid late fees by renewing borrowed items online."],
  ["Buy stationery", "Pick up pens, notebooks, and sticky notes for work."],
  ["Plan budget", "Reassess spending for the month and set financial goals."],
  ["Schedule doctor’s visit", "Check availability for an annual check-up."],
  ["Organize pantry", "Sort out spices and label containers for easy access."],
  ["Explore hobbies", "Research pottery classes in my area."],
  ["Update resume", "Polish and add recent achievements to my CV."],
  ["Fix computer issue", "Troubleshoot and solve the freezing problem."],
  ["Try a new cafe", "Visit the cozy place recommended by friends 🍰."]
];


// generate all 52 playing cards + jokers, as objects
const playingCards = [
  { suit: "♠", rank: "A" }, { suit: "♠", rank: "2" }, { suit: "♠", rank: "3" }, { suit: "♠", rank: "4" }, { suit: "♠", rank: "5" }, { suit: "♠", rank: "6" }, { suit: "♠", rank: "7" }, { suit: "♠", rank: "8" }, { suit: "♠", rank: "9" }, { suit: "♠", rank: "10" }, { suit: "♠", rank: "J" }, { suit: "♠", rank: "Q" }, { suit: "♠", rank: "K" },
  { suit: "♣", rank: "A" }, { suit: "♣", rank: "2" }, { suit: "♣", rank: "3" }, { suit: "♣", rank: "4" }, { suit: "♣", rank: "5" }, { suit: "♣", rank: "6" }, { suit: "♣", rank: "7" }, { suit: "♣", rank: "8" }, { suit: "♣", rank: "9" }, { suit: "♣", rank: "10" }, { suit: "♣", rank: "J" }, { suit: "♣", rank: "Q" }, { suit: "♣", rank: "K" },
  { suit: "♥", rank: "A" }, { suit: "♥", rank: "2" }, { suit: "♥", rank: "3" }, { suit: "♥", rank: "4" }, { suit: "♥", rank: "5" }, { suit: "♥", rank: "6" }, { suit: "♥", rank: "7" }, { suit: "♥", rank: "8" }, { suit: "♥", rank: "9" }, { suit: "♥", rank: "10" }, { suit: "♥", rank: "J" }, { suit: "♥", rank: "Q" }, { suit: "♥", rank: "K" },
  { suit: "♦", rank: "A" }, { suit: "♦", rank: "2" }, { suit: "♦", rank: "3" }, { suit: "♦", rank: "4" }, { suit: "♦", rank: "5" }, { suit: "♦", rank: "6" }, { suit: "♦", rank: "7" }, { suit: "♦", rank: "8" }, { suit: "♦", rank: "9" }, { suit: "♦", rank: "10" }, { suit: "♦", rank: "J" }, { suit: "♦", rank: "Q" }, { suit: "♦", rank: "K" },
  { suit: "Jred", rank: "Joker" }, { suit: "Jblack", rank: "Joker" }
]

// can u give me all the card suits here>?
// sure, here are all the card suits: ♠ ♣ ♥ ♦ 🃏



function TwemojiJoker(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36" {...props}><path fill="transparent" d="M32 32a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4z"></path><path fill="#DD2E44" d="M11 7c-2.519 0-4.583 1.87-4.929 4.293A3.98 3.98 0 0 1 9 10a4 4 0 0 1 4 4c0 2 1.497 2.198.707 2.929C16.13 16.583 16 14.519 16 12a5 5 0 0 0-5-5"></path><path fill="#55ACEE" d="M23 14a4 4 0 0 1 4-4c1.161 0 2.198.503 2.929 1.293C29.583 8.87 27.52 7 25 7a5 5 0 0 0-5 5c0 2.519-.131 4.583 2.293 4.929C21.503 16.198 23 16 23 14"></path><path fill="#FFAC33" d="M14 12c0-4.971 4-9 4-9s4 4.029 4 9s-1.791 9-4 9s-4-4.029-4-9"></path><path fill="#553788" d="M11.707 21.071A3.98 3.98 0 0 1 13 24a4 4 0 0 1-4 4a3.98 3.98 0 0 1-2.929-1.293C6.417 29.131 8.481 31 11 31a5 5 0 0 0 5-5c0-2.52-1.87-4.583-4.293-4.929M27 28a4 4 0 0 1-4-4c0-1.161.503-2.198 1.293-2.929C21.869 21.417 20 23.48 20 26a5 5 0 0 0 5 5c2.52 0 4.583-1.869 4.929-4.293A3.98 3.98 0 0 1 27 28"></path><path fill="#9266CC" d="M14 24c0 4.971 3 9 4 9s4-4.029 4-9c0-.874-.055-1.719-.159-2.519C21.357 17.737 19.82 15 18 15s-3.357 2.737-3.841 6.481c-.104.8-.159 1.645-.159 2.519"></path><path fill="#EDBB9F" d="M13 17c0-3.866 3-4 5-4s5 .134 5 4s-2.238 7-5 7s-5-3.135-5-7"></path><circle cx="16" cy="17" r="1" fill="#662113"></circle><circle cx="20" cy="17" r="1" fill="#662113"></circle><path fill="#662113" d="M18 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2"></path><circle cx="6" cy="11" r="1" fill="#A0041E"></circle><circle cx="30" cy="11" r="1" fill="#269"></circle><circle cx="18" cy="3" r="1" fill="#DD2E44"></circle></svg>
  )
}