"use client"

import { LinkButton } from "@/app/ui/Button"
import { useTabs } from "@/app/ui/Tabs"
import { Button } from "@heroui/button"
import { cn } from "lazy-cn"
import { type ComponentProps, type SVGProps } from "react"
import { AnimateChildren } from "../../../../lib/AnimateChildren/src"
import { useArrayArticleDemo } from "@/app/(updates)/shared"
import { Card, CardBody, CardFooter, HeroUIProvider, Image } from "@heroui/react"
import { MagicCode } from "@/app/(updates)/code"
import { Fira_Code, Space_Grotesk, Space_Mono } from "next/font/google"
import { AButton } from "../shadcn-ui/button"
import { RootBackground } from "@/app/ui/Background"

const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--fira",
})

const spacemono = Space_Mono({
  subsets: ["latin"],
  variable: "--space-mono",
  weight: ['400', '700']
})

const spacegrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--space-grotesk",
  weight: ['400', '700']
})

const codes = {
  1: `
import { Card, CardBody, CardFooter } from "@heroui/react"

<div className="gap-2 grid grid-cols-3">
    {data.map((item, index) => (
      <Card key={item.id}>
        <CardBody className="...">
          <Card className="..." isPressable>
            <GroceryImage item={item}/>
          </Card>
        </CardBody>
        <CardFooter className="...">
          <b>{item.title}</b>
          <p>{item.price}</p>
          <div className="...">
            <MoveLeftButton onPress={onMoveUp} />
            <MoveRightButton onPress={onMoveDown} />
            <DeleteButton onPress={onDelete} />
          </div>
        </CardFooter>
      </Card>
    ))}
</div>
  `,
  2: `
import { AnimateChildren } from "react-flip-children"
import { Card, CardBody, CardFooter } from "@heroui/react"

<div className="gap-2 grid grid-cols-3">
  <AnimateChildren>
    {data.map((item, index) => (
      <Card key={item.id}
        style={{ zIndex: item.id }}
      >
        <CardBody className="...">
          <Card className="..." isPressable>
            <GroceryImage item={item}/>
          </Card>
        </CardBody>
        <CardFooter className="...">
          <b>{item.title}</b>
          <p>{item.price}</p>
          <div className="...">
            <MoveLeftButton onPress={onMoveUp} />
            <MoveRightButton onPress={onMoveDown} />
            <DeleteButton onPress={onDelete} />
          </div>
        </CardFooter>
      </Card>
    ))}
  </AnimateChildren>
</div>
  `,
  3: `
import { AnimateChildren } from "react-flip-children"
import { Card, CardBody, CardFooter } from "@heroui/react"

<div className="gap-2 grid grid-cols-3">
  <AnimateChildren>
    {data.map((item, index) => (
      <Card key={item.id}
        style={{ zIndex: item.id }}
        className={cn(
          "!transition-all",
          "opacity-100",
          "data-[adding]:opacity-0",
          "data-[deleting]:opacity-0",
        )}
      >
        <CardBody className="...">
          <Card className="..." isPressable>
            <GroceryImage item={item}/>
          </Card>
        </CardBody>
        <CardFooter className="...">
          <b>{item.title}</b>
          <p>{item.price}</p>
          <div className="...">
            <MoveLeftButton onPress={onMoveUp} />
            <MoveRightButton onPress={onMoveDown} />
            <DeleteButton onPress={onDelete} />
          </div>
        </CardFooter>
      </Card>
    ))}
  </AnimateChildren>
</div>
  `,
  4: `
import { AnimateChildren } from "react-flip-children"
import { Card, CardBody, CardFooter } from "@heroui/react"
import { type ComponentProps } from "react"

<div className="gap-2 grid grid-cols-3">
  <AnimateChildren>
    {data.map((item, index) => (
      <GroceryCard key={item.id}
        item={item}
        onDelete={removeFn(item.id)}
        onMoveUp={() => moveUp(item.id)}
        onMoveDown={() => moveDown(item.id)}
      />
    ))}
  </AnimateChildren>
</div>

type GroceryCardProps = ComponentProps<typeof Card> & {
  item: Item,
  onDelete?: () => void,
  onMoveUp?: () => void,
  onMoveDown?: () => void,
}

function GroceryCard({
  item, onDelete, onMoveUp, onMoveDown, ...props
}: GroceryCardProps) {
  return (
    <Card key={item.id}
      style={{ zIndex: item.id }}
      className={cn(
        "!transition-all",
        "opacity-100",
        "data-[adding]:opacity-0",
        "data-[deleting]:opacity-0",
      )}
      {...props} // Important!
    >
      {/* ... */}
    </Card>
  )
}
  `
}

export default function HeroUIDemo() {

  const {
    arr,
    add,
    removeFn,
    moveUp,
    moveDown,
    reverse,
    shuffle,
  } = useArrayArticleDemo()

  const {
    gotoTab,
    isTab,
    tab
  } = useTabs(1, 2, 3, 4)

  return (
    <HeroUIProvider>
      <article className={cn(
        "min-h-screen bg-black text-[#ECEDEE] p-4 *:mx-auto overflow-auto",
        "font-[family-name:var(--inter)]",
        "dark",
        "heroui-bg",
        "selection:bg-white/10"
      )}>
        <RootBackground color="black" />


        <header className="max-w-[38rem] pt-4 md:pt-8 mb-8 md:mb-20 relative">
          <HeaderContent />
        </header>
        <section className="max-w-[68rem] min-w-0 flex flex-col sm:flex-row flex-wrap gap-4  sm:items-start">
          <div className="flex-1 min-w-0 overflow-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 min-w-0 flex-wrap">
              <Tab onClick={gotoTab(1)} data-selected={tab === 1 ? "" : undefined}>Base</Tab>
              <Tab onClick={gotoTab(2)} data-selected={tab === 2 ? "" : undefined}>Add Animate</Tab>
              <Tab onClick={gotoTab(3)} data-selected={tab === 3 ? "" : undefined}>Add Entry/Exit</Tab>
              <Tab onClick={gotoTab(4)} data-selected={tab === 4 ? "" : undefined}>Custom Component</Tab>
            </div>

            {/* Code */}
            <pre className={cn(
              "font-[family-name:var(--geist-mono)]",
              "text-sm",
              "font",
              "selection:bg-slate-200",
              "magic-move-pre",
              "*:transition-all",
              "*:delay-500",
              "*:duration-500",
              "data-[adding]:*:opacity-0",
              "data-[deleting]:*:opacity-0",
              "data-[deleting]:*:delay-0",
              fira.className,
              "pb-4",
            )}>
              <MagicCode
                code={codes[tab]}
                theme="github-dark"
                stagger={0} />
            </pre>


          </div>
          <div className="flex-1">
            <div className="mb-4 flex gap-1">
              <Button radius="sm" onPress={add}>Add</Button>
              <Button radius="sm" onPress={reverse}>Reverse</Button>
              <Button radius="sm" onPress={shuffle}>Shuffle</Button>
            </div>
            <div className={cn(
              "gap-2 grid",
              "grid-cols-1",
              "[@media(min-width:320px)]:grid-cols-2",
              "[@media(min-width:500px)]:grid-cols-3",
              "[@media(min-width:640px)]:grid-cols-2",
              "[@media(min-width:950px)]:grid-cols-3",
            )}>
              <AnimateChildren
                delayDeletion={150}
                easing="ease-in-out"
                stagger={20}
              >
                {arr.map((el, index) => {
                  return (
                    <GroceryCard
                      key={el.id}
                      itemid={el.id}
                      onDelete={removeFn(el.id)}
                      onMoveUp={() => moveUp(el.id)}
                      onMoveDown={() => moveDown(el.id)}
                    />
                  )
                })}
              </AnimateChildren>
            </div>
          </div>
        </section>


        <section className="h-80 mt-16 !-mx-4 py-8 overflow-clip p-4">
          <div className="max-w-[60rem] mx-auto flex gap-4 items-center h-full">

            <div className="flex-1 text-white">
              <div className="text-3xl sm:text-5xl tracking text-pretty mt-2 font-semibold tracking-tighter">
                Animate Children with Ease.
              </div>
              <pre className={cn(
                "block rounded-md text-lg sm:text-2xl -tracking-widest mt-2",
              )}>
                npm i react-flip-children
              </pre>
              <LinkButton href="/docs#overview" className="inline-block mt-6 text-base px-4 bg-[#181826] border-[#272730]">
                Get Started {'->'}
              </LinkButton>
            </div>
          </div>
        </section>

        <footer className="py-20 text-sm text-center opacity-60">
          &copy; {new Date().getUTCFullYear()} Alfonsus Ardani. All rights reserved.
        </footer>


      </article>
    </HeroUIProvider>
  )

}

function GroceryCard({
  itemid, onDelete, onMoveUp, onMoveDown, ...props
}: ComponentProps<typeof Card>
  & {
    itemid: number,
    onDelete?: () => void,
    onMoveUp?: () => void,
    onMoveDown?: () => void,
  }) {
  const image = list[itemid % list.length].img
  const title = list[itemid % list.length].title
  const price = list[itemid % list.length].price
  return (
    <Card
      key={itemid}
      style={{ zIndex: itemid }}
      className={cn(
        "bg-[#27272a] group relative",
        "!transition-all",
        "opacity-100",
        "data-[adding]:opacity-0",
        "data-[deleting]:opacity-0",
      )}
      {...props}
    >
      <CardBody className="overflow-visible p-0">
        <Card
          className="w-full object-cover overflow-visible flex items-stretch"
          isPressable
        >
          <Image
            alt={title}
            className="w-full object-cover h-[140px]"
            radius="lg"
            shadow="sm"
            src={image}
            width="100%"
          />
        </Card>
      </CardBody>
      <CardFooter className="text-small justify-between items-start flex-col w-full">
        <b>{title}</b>
        <p className="text-default-500">{price}</p>
        <div className="w-full flex z-10 group-hover:opacity-100 transition-all justify-end">
          <Button isIconOnly onPress={onMoveUp} size="sm" variant="light">
            <SolarAltArrowLeftBold className="text-xl" />
          </Button>
          <Button isIconOnly onPress={onMoveDown} size="sm" variant="light">
            <SolarAltArrowRightBold className="text-xl" />
          </Button>
          <Button isIconOnly onPress={onDelete} size="sm" variant="light" color="danger">
            <SolarTrashBinTrashBoldDuotone className="text-xl" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}


const list = [
  {
    title: "Orange",
    img: "https://www.heroui.com/images/fruit-1.jpeg",
    price: "$5.50",
  },
  {
    title: "Tangerine",
    img: "https://www.heroui.com/images/fruit-2.jpeg",
    price: "$3.00",
  },
  {
    title: "Raspberry",
    img: "https://www.heroui.com/images/fruit-3.jpeg",
    price: "$10.00",
  },
  {
    title: "Lemon",
    img: "https://www.heroui.com/images/fruit-4.jpeg",
    price: "$5.30",
  },
  {
    title: "Avocado",
    img: "https://www.heroui.com/images/fruit-5.jpeg",
    price: "$15.70",
  },
  {
    title: "Lemon 2",
    img: "https://www.heroui.com/images/fruit-6.jpeg",
    price: "$8.00",
  },
  {
    title: "Banana",
    img: "https://www.heroui.com/images/fruit-7.jpeg",
    price: "$7.50",
  },
  {
    title: "Watermelon",
    img: "https://www.heroui.com/images/fruit-8.jpeg",
    price: "$12.20",
  },
];




function HeaderContent() {
  return (
    <>
      <LinkButton
        href="/docs#heroui"
        className="bg-[#181826] border-[#272730] text-[#d4d4d8] inline-block mb-2 md:mb-12"
      >{'<-'} Back to Docs</LinkButton><br />

      <div className="w-52 h-52 block absolute right-0 bottom-0 text-slate-200">
        <HeroUIIcon className="w-52 h-52 opacity-20" />
      </div>

      <span className="text-lg font-bold">v0.1.3</span>
      <h1 className="text-3xl font-bold tracking-tighter pb-10 leading-none">
        React Flip Children<br /> Integration Guide
      </h1>


      <div className="mb-2">
        <HeroUIText className="w-[32%] h-[32%]" />
      </div>
      <span className="font-semibold tracking-tight">Last Updated: {new Date().toISOString().split('T')[0]}</span>

    </>
  )
}

function Tab(
  { className, children, ...props }: ComponentProps<"button">
) {
  return <button {...props} className={cn(
    "my-1",
    // `bg-zinc-800`,
    `text-sm`,
    `transition-all duration-100`,

    `grow`,
    `flex flex-col items-center gap-1`,

    // "font-medium",
    "text-[#3f3f46]",
    "data-[selected]:text-[#ECEDEE]",

    `group`,
    className
  )}>
    {children}
    <div className={cn(
      "w-full h-[0.15rem]",

      "transition-all",
      "bg-[#3f3f46]",
      "group-data-[selected]:bg-[#ECEDEE]",
    )} />
  </button>
}


function HeroUIText(props: ComponentProps<"svg">) {
  return (
    <svg {...props} width="445" height="109" viewBox="0 0 445 109" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M433.636 106.775V0H444.536V106.775H433.636Z" fill="white" />
      <path d="M369.697 109C361.541 109 354.324 107.319 348.046 103.958C341.817 100.596 336.923 95.8507 333.364 89.721C329.805 83.5913 328.025 76.4235 328.025 68.2177V0.0741531L339 0V66.8088C339 72.3453 339.939 77.1403 341.817 81.1938C343.696 85.1979 346.143 88.5099 349.158 91.1299C352.223 93.7004 355.56 95.6036 359.168 96.8394C362.777 98.0752 366.287 98.6932 369.697 98.6932C373.158 98.6932 376.692 98.0752 380.301 96.8394C383.91 95.6036 387.222 93.7004 390.237 91.1299C393.252 88.5099 395.699 85.1979 397.578 81.1938C399.456 77.1403 400.395 72.3453 400.395 66.8088V0H411.37V68.2177C411.37 76.4235 409.59 83.5913 406.031 89.721C402.472 95.8013 397.553 100.547 391.275 103.958C385.046 107.319 377.854 109 369.697 109Z" fill="white" />
      <path d="M273.703 109C265.745 109 258.948 107.196 253.312 103.587C247.677 99.9785 243.352 94.9857 240.336 88.6089C237.321 82.232 235.813 74.9159 235.813 66.6606C235.813 58.2569 237.345 50.8914 240.41 44.564C243.475 38.2366 247.825 33.318 253.461 29.8082C259.145 26.249 265.893 24.4694 273.703 24.4694C281.712 24.4694 288.533 26.2737 294.169 29.8824C299.854 33.4415 304.179 38.4096 307.145 44.7864C310.16 51.1139 311.668 58.4052 311.668 66.6606C311.668 75.0642 310.16 82.4544 307.145 88.8313C304.129 95.1587 299.779 100.102 294.095 103.661C288.41 107.22 281.613 109 273.703 109ZM273.703 98.5449C282.601 98.5449 289.225 95.6036 293.576 89.7211C297.926 83.7891 300.101 76.1023 300.101 66.6606C300.101 56.9717 297.901 49.2601 293.501 43.5259C289.151 37.7916 282.552 34.9245 273.703 34.9245C267.722 34.9245 262.779 36.2839 258.874 39.0028C255.018 41.6721 252.126 45.4043 250.198 50.1994C248.32 54.9449 247.38 60.432 247.38 66.6606C247.38 76.3 249.605 84.0363 254.054 89.8694C258.503 95.6531 265.053 98.5449 273.703 98.5449Z" fill="white" />
      <path d="M188.271 106.776V26.6939H198.058V45.9728L196.13 43.4517C197.02 41.0789 198.182 38.9039 199.615 36.9266C201.049 34.8998 202.606 33.2438 204.287 31.9585C206.363 30.1295 208.785 28.7454 211.553 27.8062C214.322 26.8175 217.115 26.249 219.932 26.1007C222.75 25.903 225.321 26.1007 227.644 26.6939V36.9266C224.727 36.1851 221.539 36.0121 218.079 36.4075C214.618 36.803 211.43 38.1871 208.513 40.5599C205.844 42.6361 203.842 45.1325 202.507 48.049C201.173 50.9161 200.283 53.981 199.838 57.2436C199.393 60.4567 199.17 63.6451 199.17 66.8089V106.776H188.271Z" fill="white" />
      <path d="M135.408 109C127.597 109 120.825 107.27 115.091 103.81C109.406 100.349 104.982 95.4801 101.818 89.2021C98.6541 82.9241 97.0723 75.5585 97.0723 67.1055C97.0723 58.3558 98.6294 50.7925 101.744 44.4157C104.858 38.0388 109.233 33.1202 114.868 29.6599C120.553 26.1996 127.251 24.4694 134.963 24.4694C142.872 24.4694 149.62 26.2985 155.206 29.9565C160.792 33.5651 165.018 38.7556 167.885 45.5279C170.752 52.3003 172.062 60.3826 171.815 69.7748H160.693V65.9191C160.495 55.5381 158.246 47.703 153.945 42.4136C149.694 37.1243 143.465 34.4796 135.259 34.4796C126.658 34.4796 120.059 37.2726 115.461 42.8585C110.914 48.4445 108.64 56.4032 108.64 66.7347C108.64 76.8191 110.914 84.6542 115.461 90.2402C120.059 95.7766 126.559 98.5449 134.963 98.5449C140.697 98.5449 145.69 97.2349 149.941 94.615C154.242 91.9456 157.628 88.1145 160.099 83.1218L170.258 87.0517C167.094 94.0218 162.423 99.4347 156.244 103.29C150.114 107.097 143.169 109 135.408 109ZM114.7 69.7748V60.6545H165.957V69.7748H114.7Z" fill="white" />
      <path d="M0 106.775V0H10.9V48.1231H69.9231V0H80.7489V106.775H69.9231V58.5782H10.9V106.775H0Z" fill="white" />
    </svg>
  )
}

function HeroUIIcon(props: ComponentProps<"svg">) {
  return (
    <svg {...props} width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M54.35 0.0825195H19.566C8.76 0.0825195 0 8.84252 0 19.6485V54.4325C0 65.2385 8.76 73.9985 19.566 73.9985H54.35C65.156 73.9985 73.916 65.2385 73.916 54.4325V19.6485C73.916 8.84252 65.156 0.0825195 54.35 0.0825195Z" fill="#3f3f46" />
      <path d="M50.6377 52.5665V21.2014H54.5148V52.5665H50.6377Z" fill="black" />
      <path d="M31.7312 53.22C29.3062 53.22 27.1643 52.719 25.3057 51.717C23.447 50.7151 21.9877 49.3138 20.9276 47.5133C19.8821 45.6981 19.3594 43.5708 19.3594 41.1313V21.2232L23.28 21.2014V40.8046C23.28 42.2857 23.5269 43.5781 24.0206 44.6817C24.5288 45.7707 25.1968 46.6783 26.0245 47.4043C26.8521 48.1304 27.7597 48.6749 28.7471 49.0379C29.7491 49.3864 30.7437 49.5607 31.7312 49.5607C32.7331 49.5607 33.735 49.3792 34.737 49.0162C35.7389 48.6531 36.6465 48.1159 37.4597 47.4043C38.2873 46.6783 38.948 45.7635 39.4418 44.6599C39.9355 43.5563 40.1823 42.2712 40.1823 40.8046V21.2014H44.103V41.1313C44.103 43.5563 43.5729 45.6764 42.5129 47.4915C41.4674 49.3066 40.0153 50.7151 38.1567 51.717C36.298 52.719 34.1562 53.22 31.7312 53.22Z" fill="black" />
    </svg>
  )
}


function SolarAltArrowLeftBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m8.165 11.63l6.63-6.43C15.21 4.799 16 5.042 16 5.57v12.86c0 .528-.79.771-1.205.37l-6.63-6.43a.5.5 0 0 1 0-.74"></path></svg>
  )
}


function SolarAltArrowRightBold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M15.835 11.63L9.205 5.2C8.79 4.799 8 5.042 8 5.57v12.86c0 .528.79.771 1.205.37l6.63-6.43a.5.5 0 0 0 0-.74"></path></svg>
  )
}




function SolarTrashBinTrashBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 6.386c0-.484.345-.877.771-.877h2.665c.529-.016.996-.399 1.176-.965l.03-.1l.115-.391c.07-.24.131-.45.217-.637c.338-.739.964-1.252 1.687-1.383c.184-.033.378-.033.6-.033h3.478c.223 0 .417 0 .6.033c.723.131 1.35.644 1.687 1.383c.086.187.147.396.218.637l.114.391l.03.1c.18.566.74.95 1.27.965h2.57c.427 0 .772.393.772.877s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877"></path><path fill="currentColor" fillRule="evenodd" d="M9.425 11.482c.413-.044.78.273.821.707l.5 5.263c.041.433-.26.82-.671.864c-.412.043-.78-.273-.821-.707l-.5-5.263c-.041-.434.26-.821.671-.864m5.15 0c.412.043.713.43.671.864l-.5 5.263c-.04.434-.408.75-.82.707c-.413-.044-.713-.43-.672-.864l.5-5.264c.041-.433.409-.75.82-.707" clipRule="evenodd"></path><path fill="currentColor" d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886" opacity=".5"></path></svg>
  )
}