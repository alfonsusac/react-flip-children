"use client"

import { LinkButton } from "@/app/ui/Button"
import { useTabs } from "@/app/ui/Tabs"
import { cn } from "lazy-cn"
import { useRef, useState, type ComponentProps, type SVGProps } from "react"
import { AnimateChildren } from "../../../../lib/AnimateChildren/src"
import { useArrayArticleDemo, useGenericArrayDemo } from "@/app/(updates)/shared"
import { MagicCode } from "@/app/(updates)/code"
import { Fira_Code, Space_Grotesk, Space_Mono } from "next/font/google"
import { RootBackground } from "@/app/ui/Background"
import {
  Box,
  Button,
  Card,
  Group,
  Image, MantineProvider,
  Stack,
  Text,
  TextInput
} from "@mantine/core"
import '@mantine/core/styles.css';

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
import {
  Box, Button, Card,
  Group, Image, MantineProvider,
  Stack, Text,
} from "@mantine/core"

<Stack gap={8}>
    {data.map((item, index) => (
      <CartItemCard key={item.id} item={item}/>
    ))}
</Stack>

function CartItemCard<T>({
  item, onDelete, onMoveUp, onMoveDown
}: CartItemCardProps) {
  return (
    <Card key={item.id}
      withBorder
      radius="lg"
      shadow="sm"
    >
      <Group gap={24} wrap="nowrap">
        <Box className="..." >
          <Image
            alt={item.title}
            src={item.image}
          />
        </Box>
        <Box className="grow">
          <Text fw={600}> {item.title}</Text>
          <Text c="dimmed">\${item.price}</Text>
        </Box>
      </Group>
    </Card>
  )
}
  `,
  2: `
import { AnimateChildren } from "react-flip-children"
import {
  Box, Button, Card,
  Group, Image, MantineProvider,
  Stack, Text,
} from "@mantine/core"

<Stack gap={8}>
  <AnimateChildren>
    {data.map((item, index) => (
      <CartItemCard key={item.id} item={item}/>
    ))}
  </AnimateChildren>
</Stack>

function CartItemCard<T>({
  item, onDelete, onMoveUp, onMoveDown, ...props
}: CartItemCardProps & ComponentProps<typeof Card>) {
  return (
    <Card key={item.id}
      withBorder
      radius="lg"
      shadow="sm"
      {...props}
    >
      <Group gap={24} wrap="nowrap">
        <Box className="..." >
          <Image
            alt={item.title}
            src={item.image}
          />
        </Box>
        <Box className="grow">
          <Text fw={600}> {item.title}</Text>
          <Text c="dimmed">\${item.price}</Text>
        </Box>
      </Group>
    </Card>
  )
}
  `,
  3: `
import { AnimateChildren } from "react-flip-children"
import {
  Box, Button, Card,
  Group, Image, MantineProvider,
  Stack, Text,
} from "@mantine/core"

<Stack gap={8}>
  <AnimateChildren>
    {data.map((item, index) => (
      <CartItemCard key={item.id} item={item}/>
    ))}
  </AnimateChildren>
</Stack>

function CartItemCard<T>({
  item, onDelete, onMoveUp, onMoveDown, ...props
}: CartItemCardProps & ComponentProps<typeof Card>) {
  return (
    <Card key={item.id}
      withBorder
      radius="lg"
      shadow="sm"
      className={cn(
        "!transition-all",
        "opacity-100",
        "data-[adding]:opacity-0",
        "data-[deleting]:opacity-0",
      )}
      {...props}
    >
      <Group gap={24} wrap="nowrap">
        <Box className="..." >
          <Image
            alt={item.title}
            src={item.image}
          />
        </Box>
        <Box className="grow">
          <Text fw={600}> {item.title}</Text>
          <Text c="dimmed">\${item.price}</Text>
        </Box>
      </Group>
    </Card>
  )
}`}

export default function HeroUIDemo() {

  const {
    arr,
    add,
    removeFn,
    moveUp,
    moveDown,
    setArr,
  } = useGenericArrayDemo(data.products, 50)

  const {
    gotoTab,
    isTab,
    tab
  } = useTabs(1, 2, 3)

  const [search, setSearch] = useState('')

  const [sortMode, setSortMode] = useState<
    | 'none'
    | 'nameAsc'
    | 'nameDesc'
    | 'priceAsc'
    | 'priceDesc'
  >('none')

  const staggerRef = useRef(30)

  return (
    <MantineProvider>
      <article className={cn(
        "min-h-screen bg-slate-50 text-[#223] p-4 *:mx-auto",
        "font-[family-name:var(--inter)]",
        "dark",
        "selection:bg-blue-500/30"
      )}>
        <RootBackground color="#f8fafc" />

        <header className="max-w-[38rem] pt-4 md:pt-8 mb-8 md:mb-20 relative">
          <HeaderContent />
        </header>
        <section className="max-w-[68rem] min-w-0 flex flex-col sm:flex-row flex-wrap gap-4  sm:items-start">
          <div className="flex-1 min-w-0 self-stretch w-full">
            {/* Tabs */}
            <div className="flex mb-4 min-w-0 flex-wrap sticky top-0 z-10 bg-[#f8fafc] pt-2">
              <Tab onClick={gotoTab(1)} data-selected={tab === 1 ? "" : undefined}>Base</Tab>
              <Tab onClick={gotoTab(2)} data-selected={tab === 2 ? "" : undefined}>Add Animate</Tab>
              <Tab onClick={gotoTab(3)} data-selected={tab === 3 ? "" : undefined}>Add Entry/Exit</Tab>
            </div>

            {/* Code */}
            <div className="overflow-auto w-full relative">
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
                "anchor-none"
              )}>
                <MagicCode
                  code={codes[tab]}
                  theme="github-light"
                  stagger={0} />
              </pre>
            </div>


          </div >
          <div className="flex-1">
            <div className="mb-4 flex gap-1 flex-wrap sticky top-0 z-[9999] pt-2">
              <Button radius="sm" onClick={add}>Add</Button>
              <Button
                onClick={() => {
                  staggerRef.current = 0
                  setSortMode(({
                    'none': 'nameAsc',
                    'nameAsc': 'nameDesc',
                    'nameDesc': 'priceAsc',
                    'priceAsc': 'priceDesc',
                    'priceDesc': 'none',
                  } as const)[sortMode])
                  setTimeout(() => {
                    staggerRef.current = 30
                  })
                }}
                leftSection={{
                  'none': <TablerArrowsSort className="text-lg" />,
                  'nameAsc': <TablerSortAscendingLetters className="text-lg" />,
                  'nameDesc': <TablerSortDescendingLetters className="text-lg" />,
                  'priceAsc': <TablerSortAscendingNumbers className="text-lg" />,
                  'priceDesc': <TablerSortDescendingNumbers className="text-lg" />,
                }[sortMode]}
              >{
                  {
                    'none': "Sort",
                    'nameAsc': "Sort by Name",
                    'nameDesc': "Sort by Name",
                    'priceAsc': "Sort by Price",
                    'priceDesc': "Sort by Price",
                  }[sortMode]
                }</Button>
              <TextInput
                leftSectionPointerEvents="none"
                leftSection={<TablerSearch />}
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
            </div>
            <Stack gap={8}>
              <AnimateChildren
                delayDeletion={150}
                easing="ease-in-out"
                stagger={staggerRef.current}
              >
                {arr.filter(
                  el => el.title.toLowerCase().includes(search.toLowerCase())
                ).sort(
                  (a, b) => {
                    if (sortMode === 'nameAsc') {
                      return a.title.localeCompare(b.title)
                    } else if (sortMode === 'nameDesc') {
                      return b.title.localeCompare(a.title)
                    } else if (sortMode === 'priceAsc') {
                      return a.price - b.price
                    } else if (sortMode === 'priceDesc') {
                      return b.price - a.price
                    } else {
                      return 0
                    }
                  }
                ).map((el, index) =>
                  <CartItemCard
                    key={el.id}
                    enableMove={sortMode === 'none'}
                    item={{
                      id: el.id,
                      image: el.thumbnail,
                      title: el.title,
                      price: el.price,
                    }}
                    onDelete={removeFn(el.id)}
                    onMoveUp={() => moveUp(el.id)}
                    onMoveDown={() => moveDown(el.id)}
                  />
                )}
              </AnimateChildren>
            </Stack>
          </div>
        </section>


        <section className="h-80 mt-16 !-mx-4 py-8 overflow-clip p-4">
          <div className="max-w-[60rem] mx-auto flex gap-4 items-center h-full">

            <div className="flex-1 text-black">
              <div className="text-3xl sm:text-5xl tracking text-pretty mt-2 font-semibold tracking-tighter">
                Animate Children with Ease.
              </div>
              <pre className={cn(
                "block rounded-md text-lg sm:text-2xl -tracking-widest mt-2",
              )}>
                npm i react-flip-children
              </pre>
              <LinkButton href="/docs#overview" className="inline-block mt-6 text-base px-4 bg-[#fff] border-[#ddd] text-[#777] hover:bg-[#eee]">
                Get Started {'->'}
              </LinkButton>
            </div>
          </div>
        </section>

        <footer className="py-20 text-sm text-center opacity-60">
          &copy; {new Date().getUTCFullYear()} Alfonsus Ardani. All rights reserved.
        </footer>


      </article>
    </MantineProvider>
  )

}

function CartItemCard({
  item, onDelete, onMoveUp, onMoveDown, enableMove, ...props
}: ComponentProps<typeof Card>
  & {
    item: {
      id: number,
      image: string,
      title: string,
      price: number,
    },
    enableMove: boolean,
    onDelete?: () => void,
    onMoveUp?: () => void,
    onMoveDown?: () => void,
  }) {
  return (
    <Card
      withBorder
      key={item.id}
      style={{ zIndex: item.id }}
      radius="md"
      shadow="sm"
      className={cn(
        "group relative",
        "!transition-all",
        "opacity-100",
        "data-[adding]:opacity-0",
        "data-[deleting]:opacity-0",
      )}
      {...props}
    >
      <Box className="!shrink flex flex-col [@media(min-width:400px)]:flex-row">
        <Box className="flex grow">
          <Box className="rounded-full overflow-hidden w-16 h-16 shrink-0" >
            <Image
              alt={item.title}
              src={item.image}
            />
          </Box>
          <Box className="grow ml-4">
            <Text fw={600} className="break-normal"> {item.title}</Text>
            <Text c="dimmed" className="break-normal">${item.price}</Text>
          </Box>
        </Box>
        <Group className="self-end" gap={0} wrap="nowrap">
          {
            enableMove && (
              <>
                <Button px={12} mx={-4} radius="xl" onClick={onMoveUp} size="xs" variant="subtle">
                  <TablerArrowUp className="text-xl" />
                </Button>
                <Button px={12} mx={-4} radius="xl" onClick={onMoveDown} size="xs" variant="subtle">
                  <TablerArrowDown className="text-xl" />
                </Button>
              </>
            )
          }
          <Button px={12} mx={-4} radius="xl" onClick={onDelete} size="xs" variant="subtle" color="red">
            <TablerTrash className="text-xl" />
          </Button>
        </Group>
      </Box>
    </Card>
  )
}



function HeaderContent() {
  return (
    <>
      <LinkButton
        href="/docs#heroui"
        className="bg-[#fff] border-[#ddd] text-[#777] hover:bg-[#eee] inline-block mb-2 md:mb-12"
      >{'<-'} Back to Docs</LinkButton><br />

      <div className="w-52 h-52 block absolute right-0 bottom-0 text-[#228be6]">
        <TablerBrandMantine className="w-52 h-52 opacity-30" />
      </div>

      <span className="text-lg font-bold">v0.1.3</span>
      <h1 className="text-3xl font-bold tracking-tighter pb-10 leading-none">
        React Flip Children<br /> Integration Guide
      </h1>


      <div className="mb-2">
        <MantineText className="w-[32%] h-[32%]" />
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
    `flex flex-col items-center gap-2`,

    // "font-medium",
    "text-[#ccd]",
    "data-[selected]:text-[#334]",

    `group`,
    className
  )}>
    {children}
    <div className={cn(
      "w-full h-[0.15rem]",

      "transition-all",
      "bg-[#ccd]",
      "group-data-[selected]:bg-[#228be6]",
    )} />
  </button>
}


function MantineText(props: ComponentProps<"svg">) {
  return (
    <svg {...props} width="395" height="92" viewBox="0 0 395 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M63.736 90.644C65.72 90.644 67.559 90.21 69.254 89.342C70.949 88.474 71.796 87.213 71.796 85.56V8.06C71.796 5.084 70.969 2.997 69.316 1.798C67.663 0.599 65.803 0 63.736 0C61.835 0 60.181 0.206999 58.776 0.619999C57.371 1.033 56.11 1.86 54.994 3.1C53.878 4.34 52.576 6.159 51.088 8.556L35.836 36.332L20.708 8.556C19.385 6.159 18.125 4.34 16.926 3.1C15.727 1.86 14.446 1.033 13.082 0.619999C11.718 0.206999 10.044 0 8.06 0C6.076 0 4.23701 0.6 2.54201 1.798C0.847007 2.997 0 5.084 0 8.06V85.56C0 87.213 0.847007 88.474 2.54201 89.342C4.23701 90.21 6.076 90.644 8.06 90.644C10.127 90.644 11.987 90.21 13.64 89.342C15.293 88.474 16.12 87.213 16.12 85.56V31.248L30.38 58.032C31.124 59.272 31.971 60.119 32.922 60.574C33.872 61.029 34.802 61.256 35.712 61.256C36.704 61.256 37.696 61.008 38.688 60.512C39.68 60.016 40.548 59.189 41.292 58.032L55.676 32.24V85.56C55.676 87.213 56.523 88.474 58.218 89.342C59.913 90.21 61.752 90.644 63.736 90.644ZM98.111 91.76C102.409 91.76 106.067 90.768 109.085 88.784C112.102 86.8 114.727 84.527 116.959 81.964V85.56C116.959 86.965 117.641 88.164 119.005 89.156C120.369 90.148 122.085 90.644 124.151 90.644C126.383 90.644 128.243 90.148 129.731 89.156C131.219 88.164 131.963 86.966 131.963 85.56V55.18C131.963 50.964 131.074 47.037 129.297 43.4C127.519 39.763 124.688 36.787 120.803 34.472C116.917 32.157 111.751 31 105.303 31C102.409 31 99.433 31.372 96.375 32.116C93.316 32.86 90.733 33.914 88.625 35.278C86.517 36.642 85.463 38.192 85.463 39.928C85.463 41.747 85.938 43.524 86.889 45.26C87.839 46.996 89.183 47.864 90.919 47.864C91.993 47.864 92.985 47.534 93.895 46.872C94.805 46.211 96.106 45.57 97.801 44.95C99.495 44.33 101.913 44.02 105.055 44.02C107.865 44.02 110.035 44.599 111.565 45.756C113.095 46.913 114.21 48.36 114.913 50.096C115.607 51.7881 115.965 53.5991 115.967 55.428V57.04H110.883C105.179 57.04 100.157 57.577 95.817 58.652C91.477 59.727 88.087 61.587 85.649 64.232C83.21 66.877 81.991 70.556 81.991 75.268C81.991 80.889 83.582 85.043 86.765 87.73C89.947 90.417 93.729 91.76 98.111 91.76ZM104.559 79.856C102.74 79.856 101.19 79.319 99.909 78.244C98.627 77.169 97.987 75.474 97.987 73.16C97.987 70.845 98.751 69.13 100.281 68.014C101.811 66.898 103.815 66.174 106.295 65.844C108.775 65.514 111.379 65.348 114.107 65.348H115.967V67.952C115.967 69.936 115.367 71.837 114.169 73.656C112.97 75.475 111.503 76.963 109.767 78.12C108.031 79.277 106.295 79.856 104.559 79.856ZM188.728 90.644C190.795 90.644 192.655 90.21 194.308 89.342C195.961 88.474 196.788 87.213 196.788 85.56V56.172C196.788 51.542 195.817 47.327 193.874 43.524C191.931 39.721 189.348 36.684 186.124 34.41C182.9 32.137 179.345 31 175.46 31C171.327 31 167.834 31.971 164.982 33.914C162.13 35.857 160.084 38.027 158.844 40.424V36.704C158.844 35.216 158.162 34.017 156.798 33.108C155.434 32.198 153.76 31.744 151.776 31.744C149.461 31.744 147.56 32.199 146.072 33.108C144.584 34.018 143.84 35.216 143.84 36.704V85.56C143.84 86.8 144.584 87.957 146.072 89.032C147.56 90.107 149.462 90.644 151.776 90.644C154.008 90.644 155.909 90.107 157.48 89.032C159.05 87.957 159.836 86.8 159.836 85.56V56.172C159.836 53.857 160.332 51.873 161.324 50.22C162.316 48.567 163.597 47.285 165.168 46.376C166.738 45.466 168.351 45.012 170.004 45.012C171.988 45.012 173.807 45.57 175.46 46.686C177.113 47.802 178.415 49.186 179.366 50.84C180.307 52.4587 180.8 54.2994 180.792 56.172V85.56C180.792 87.213 181.66 88.474 183.396 89.342C185.132 90.21 186.909 90.644 188.728 90.644ZM236.16 90.644C238.475 90.644 240.19 89.941 241.306 88.536C242.422 87.131 242.98 85.56 242.98 83.824C242.98 82.171 242.422 80.641 241.306 79.236C240.19 77.831 238.475 77.128 236.16 77.128H231.324C228.761 77.128 226.964 76.632 225.93 75.64C224.897 74.648 224.38 72.953 224.38 70.556V43.4H239.012C240.335 43.4 241.347 42.8 242.05 41.602C242.753 40.403 243.104 39.06 243.104 37.572C243.104 36.084 242.753 34.741 242.05 33.542C241.347 32.343 240.335 31.744 239.012 31.744H224.38V10.416C224.38 8.928 223.533 7.729 221.838 6.82C220.143 5.91 218.304 5.456 216.32 5.456C214.501 5.456 212.724 5.911 210.988 6.82C209.252 7.73 208.384 8.928 208.384 10.416V70.556C208.384 77.5 210.347 82.584 214.274 85.808C218.201 89.032 223.884 90.644 231.324 90.644H236.16ZM259.232 18.6C261.629 18.6 263.675 17.794 265.37 16.182C267.065 14.57 267.912 12.772 267.912 10.788C267.912 8.638 267.065 6.799 265.37 5.27C263.675 3.74 261.63 2.976 259.232 2.976C256.835 2.976 254.768 3.741 253.032 5.27C251.296 6.8 250.428 8.639 250.428 10.788C250.428 12.772 251.296 14.57 253.032 16.182C254.768 17.794 256.835 18.6 259.232 18.6ZM259.232 90.644C261.464 90.644 263.365 90.107 264.936 89.032C266.506 87.957 267.292 86.8 267.292 85.56V36.704C267.292 35.216 266.507 34.017 264.936 33.108C263.366 32.198 261.464 31.744 259.232 31.744C256.917 31.744 255.016 32.199 253.528 33.108C252.04 34.018 251.296 35.216 251.296 36.704V85.56C251.296 86.8 252.04 87.957 253.528 89.032C255.016 90.107 256.918 90.644 259.232 90.644ZM324.479 90.644C326.545 90.644 328.405 90.21 330.059 89.342C331.712 88.474 332.539 87.213 332.539 85.56V56.172C332.539 51.542 331.567 47.327 329.625 43.524C327.682 39.721 325.099 36.684 321.875 34.41C318.651 32.137 315.096 31 311.211 31C307.077 31 303.585 31.971 300.733 33.914C297.881 35.857 295.835 38.027 294.595 40.424V36.704C294.595 35.216 293.913 34.017 292.549 33.108C291.185 32.198 289.511 31.744 287.527 31.744C285.212 31.744 283.311 32.199 281.823 33.108C280.335 34.018 279.591 35.216 279.591 36.704V85.56C279.591 86.8 280.335 87.957 281.823 89.032C283.311 90.107 285.213 90.644 287.527 90.644C289.759 90.644 291.66 90.107 293.231 89.032C294.801 87.957 295.587 86.8 295.587 85.56V56.172C295.587 53.857 296.083 51.873 297.075 50.22C298.067 48.567 299.348 47.285 300.919 46.376C302.489 45.466 304.101 45.012 305.755 45.012C307.739 45.012 309.557 45.57 311.211 46.686C312.864 47.802 314.166 49.186 315.117 50.84C316.058 52.4587 316.551 54.2994 316.543 56.172V85.56C316.543 87.213 317.411 88.474 319.147 89.342C320.883 90.21 322.66 90.644 324.479 90.644ZM372.159 91.76C376.623 91.76 380.487 91.202 383.753 90.086C387.018 88.97 389.539 87.606 391.317 85.994C393.094 84.382 393.983 82.874 393.983 81.468C393.983 80.641 393.735 79.67 393.239 78.554C392.749 77.4456 392.03 76.4527 391.131 75.64C390.221 74.813 389.147 74.4 387.907 74.4C386.749 74.4 385.509 74.772 384.187 75.516C382.864 76.26 381.293 77.046 379.475 77.872C377.656 78.699 375.383 79.112 372.655 79.112C368.356 79.112 364.863 78.017 362.177 75.826C359.49 73.636 358.147 70.763 358.147 67.208V65.348H383.319C385.22 65.348 387.059 65.162 388.837 64.79C390.614 64.418 392.081 63.467 393.239 61.938C394.396 60.408 394.975 57.867 394.975 54.312C394.975 49.682 393.776 45.632 391.379 42.16C388.981 38.688 385.861 35.96 382.017 33.976C378.173 31.992 373.937 31 369.307 31C364.264 31 359.697 32.137 355.605 34.41C351.513 36.683 348.247 39.7 345.809 43.462C343.37 47.223 342.151 51.336 342.151 55.8V66.34C342.151 71.383 343.432 75.826 345.995 79.67C348.557 83.514 352.091 86.49 356.597 88.598C361.102 90.706 366.289 91.76 372.159 91.76ZM376.251 55.924H358.147V52.452C358.147 50.468 358.663 48.752 359.697 47.306C360.73 45.859 362.073 44.743 363.727 43.958C365.38 43.173 367.157 42.78 369.059 42.78C371.043 42.78 372.861 43.193 374.515 44.02C376.168 44.847 377.491 46.004 378.483 47.492C379.475 48.98 379.971 50.675 379.971 52.576C379.971 53.899 379.702 54.787 379.165 55.242C378.627 55.697 377.656 55.924 376.251 55.924Z"
        fill="black"
      />
    </svg>

  )
}


function TablerBrandMantine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"></path><path d="M11 16a4.97 4.97 0 0 0 2-4a5.01 5.01 0 0 0-2-4m3 1h-2m2 6h-2m-2-3h.01"></path></g></svg>
  )
}




function TablerArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m6-8l-6-6m-6 6l6-6"></path></svg>
  )
}


function TablerArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m6-6l-6 6m-6-6l6 6"></path></svg>
  )
}


function TablerTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path></svg>
  )
}


function TablerSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"></path></svg>
  )
}


function TablerSortAscendingLetters(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10V5c0-1.38.62-2 2-2s2 .62 2 2v5m0-3h-4m4 14h-4l4-7h-4M4 15l3 3l3-3M7 6v12"></path></svg>
  )
}

function TablerSortAscendingNumbers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m4 15l3 3l3-3M7 6v12M17 3a2 2 0 0 1 2 2v3a2 2 0 1 1-4 0V5a2 2 0 0 1 2-2m-2 13a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M19 16v3a2 2 0 0 1-2 2h-1.5"></path></g></svg>
  )
}

function TablerSortDescendingLetters(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 21v-5c0-1.38.62-2 2-2s2 .62 2 2v5m0-3h-4m4-8h-4l4-7h-4M4 15l3 3l3-3M7 6v12"></path></svg>
  )
}

function TablerSortDescendingNumbers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m4 15l3 3l3-3M7 6v12m10-4a2 2 0 0 1 2 2v3a2 2 0 1 1-4 0v-3a2 2 0 0 1 2-2m-2-9a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M19 5v3a2 2 0 0 1-2 2h-1.5"></path></g></svg>
  )
}

function TablerArrowsSort(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 9l4-4l4 4M7 5v14m14-4l-4 4l-4-4m4 4V5"></path></svg>
  )
}


const data = {
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
      "category": "beauty",
      "price": 9.99,
      "discountPercentage": 7.17,
      "rating": 4.94,
      "stock": 5,
      "tags": [
        "beauty",
        "mascara"
      ],
      "brand": "Essence",
      "sku": "RCH45Q1A",
      "weight": 2,
      "dimensions": {
        "width": 23.17,
        "height": 14.43,
        "depth": 28.01
      },
      "warrantyInformation": "1 month warranty",
      "shippingInformation": "Ships in 1 month",
      "availabilityStatus": "Low Stock",
      "reviews": [
        {
          "rating": 2,
          "comment": "Very unhappy with my purchase!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "John Doe",
          "reviewerEmail": "john.doe@x.dummyjson.com"
        },
        {
          "rating": 2,
          "comment": "Not as described!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "Nolan Gonzalez",
          "reviewerEmail": "nolan.gonzalez@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Very satisfied!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "Scarlett Wright",
          "reviewerEmail": "scarlett.wright@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 24,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.618Z",
        "updatedAt": "2024-05-23T08:56:21.618Z",
        "barcode": "9164035109868",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
    },
    {
      "id": 2,
      "title": "Eyeshadow Palette with Mirror",
      "description": "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
      "category": "beauty",
      "price": 19.99,
      "discountPercentage": 5.5,
      "rating": 3.28,
      "stock": 44,
      "tags": [
        "beauty",
        "eyeshadow"
      ],
      "brand": "Glamour Beauty",
      "sku": "MVCFH27F",
      "weight": 3,
      "dimensions": {
        "width": 12.42,
        "height": 8.63,
        "depth": 29.13
      },
      "warrantyInformation": "1 year warranty",
      "shippingInformation": "Ships in 2 weeks",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Very satisfied!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "Liam Garcia",
          "reviewerEmail": "liam.garcia@x.dummyjson.com"
        },
        {
          "rating": 1,
          "comment": "Very disappointed!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "Nora Russell",
          "reviewerEmail": "nora.russell@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Highly impressed!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "Elena Baker",
          "reviewerEmail": "elena.baker@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 32,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.618Z",
        "updatedAt": "2024-05-23T08:56:21.618Z",
        "barcode": "2817839095220",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png"
    },
    {
      "id": 3,
      "title": "Powder Canister",
      "description": "The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.",
      "category": "beauty",
      "price": 14.99,
      "discountPercentage": 18.14,
      "rating": 3.82,
      "stock": 59,
      "tags": [
        "beauty",
        "face powder"
      ],
      "brand": "Velvet Touch",
      "sku": "9EN8WLT2",
      "weight": 8,
      "dimensions": {
        "width": 24.16,
        "height": 10.7,
        "depth": 11.07
      },
      "warrantyInformation": "2 year warranty",
      "shippingInformation": "Ships in 1-2 business days",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Very happy with my purchase!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "Ethan Thompson",
          "reviewerEmail": "ethan.thompson@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Great value for money!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "Levi Hicks",
          "reviewerEmail": "levi.hicks@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Highly impressed!",
          "date": "2024-05-23T08:56:21.618Z",
          "reviewerName": "Hazel Gardner",
          "reviewerEmail": "hazel.gardner@x.dummyjson.com"
        }
      ],
      "returnPolicy": "60 days return policy",
      "minimumOrderQuantity": 25,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.618Z",
        "updatedAt": "2024-05-23T08:56:21.618Z",
        "barcode": "0516267971277",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png"
    },
    {
      "id": 4,
      "title": "Red Lipstick",
      "description": "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.",
      "category": "beauty",
      "price": 12.99,
      "discountPercentage": 19.03,
      "rating": 2.51,
      "stock": 68,
      "tags": [
        "beauty",
        "lipstick"
      ],
      "brand": "Chic Cosmetics",
      "sku": "O5IF1NTA",
      "weight": 5,
      "dimensions": {
        "width": 14.37,
        "height": 13.94,
        "depth": 14.6
      },
      "warrantyInformation": "Lifetime warranty",
      "shippingInformation": "Ships in 2 weeks",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Great product!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Leo Rivera",
          "reviewerEmail": "leo.rivera@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Oscar Powers",
          "reviewerEmail": "oscar.powers@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Carter Rivera",
          "reviewerEmail": "carter.rivera@x.dummyjson.com"
        }
      ],
      "returnPolicy": "90 days return policy",
      "minimumOrderQuantity": 6,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.619Z",
        "updatedAt": "2024-05-23T08:56:21.619Z",
        "barcode": "9444582199406",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png"
    },
    {
      "id": 5,
      "title": "Red Nail Polish",
      "description": "The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.",
      "category": "beauty",
      "price": 8.99,
      "discountPercentage": 2.46,
      "rating": 3.91,
      "stock": 71,
      "tags": [
        "beauty",
        "nail polish"
      ],
      "brand": "Nail Couture",
      "sku": "YUIIIP4W",
      "weight": 9,
      "dimensions": {
        "width": 8.11,
        "height": 10.89,
        "depth": 29.06
      },
      "warrantyInformation": "1 year warranty",
      "shippingInformation": "Ships in 1 week",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Leo Rivera",
          "reviewerEmail": "leo.rivera@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Great product!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Evan Reed",
          "reviewerEmail": "evan.reed@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Highly recommended!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Evelyn Sanchez",
          "reviewerEmail": "evelyn.sanchez@x.dummyjson.com"
        }
      ],
      "returnPolicy": "No return policy",
      "minimumOrderQuantity": 46,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.619Z",
        "updatedAt": "2024-05-23T08:56:21.619Z",
        "barcode": "3212847902461",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png"
    },
    {
      "id": 7,
      "title": "Chanel Coco Noir Eau De",
      "description": "Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.",
      "category": "fragrances",
      "price": 129.99,
      "discountPercentage": 18.64,
      "rating": 2.76,
      "stock": 41,
      "tags": [
        "fragrances",
        "perfumes"
      ],
      "brand": "Chanel",
      "sku": "K71HBCGS",
      "weight": 4,
      "dimensions": {
        "width": 21.27,
        "height": 28,
        "depth": 11.89
      },
      "warrantyInformation": "1 week warranty",
      "shippingInformation": "Ships in 1 month",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 1,
          "comment": "Disappointing product!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Lincoln Kelly",
          "reviewerEmail": "lincoln.kelly@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Great product!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Lincoln Kelly",
          "reviewerEmail": "lincoln.kelly@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Excellent quality!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Lucas Allen",
          "reviewerEmail": "lucas.allen@x.dummyjson.com"
        }
      ],
      "returnPolicy": "60 days return policy",
      "minimumOrderQuantity": 5,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.619Z",
        "updatedAt": "2024-05-23T08:56:21.619Z",
        "barcode": "1435582999795",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png",
        "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/2.png",
        "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/3.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/thumbnail.png"
    },
    {
      "id": 8,
      "title": "Dior J'adore",
      "description": "J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.",
      "category": "fragrances",
      "price": 89.99,
      "discountPercentage": 17.44,
      "rating": 3.31,
      "stock": 91,
      "tags": [
        "fragrances",
        "perfumes"
      ],
      "brand": "Dior",
      "sku": "E70NB03B",
      "weight": 10,
      "dimensions": {
        "width": 21.51,
        "height": 7,
        "depth": 26.51
      },
      "warrantyInformation": "Lifetime warranty",
      "shippingInformation": "Ships in 2 weeks",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Fast shipping!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Zoe Nicholson",
          "reviewerEmail": "zoe.nicholson@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Excellent quality!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Addison Wright",
          "reviewerEmail": "addison.wright@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.619Z",
          "reviewerName": "Clara Berry",
          "reviewerEmail": "clara.berry@x.dummyjson.com"
        }
      ],
      "returnPolicy": "7 days return policy",
      "minimumOrderQuantity": 8,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.619Z",
        "updatedAt": "2024-05-23T08:56:21.619Z",
        "barcode": "0887083199279",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/1.png",
        "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/2.png",
        "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/3.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/thumbnail.png"
    },
    {
      "id": 10,
      "title": "Gucci Bloom Eau de",
      "description": "Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.",
      "category": "fragrances",
      "price": 79.99,
      "discountPercentage": 8.9,
      "rating": 2.69,
      "stock": 93,
      "tags": [
        "fragrances",
        "perfumes"
      ],
      "brand": "Gucci",
      "sku": "FFKZ6HOF",
      "weight": 10,
      "dimensions": {
        "width": 22.28,
        "height": 17.81,
        "depth": 27.18
      },
      "warrantyInformation": "No warranty",
      "shippingInformation": "Ships in 2 weeks",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Great value for money!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Aria Parker",
          "reviewerEmail": "aria.parker@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Excellent quality!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Natalie Harris",
          "reviewerEmail": "natalie.harris@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Fast shipping!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Ava Harris",
          "reviewerEmail": "ava.harris@x.dummyjson.com"
        }
      ],
      "returnPolicy": "No return policy",
      "minimumOrderQuantity": 10,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "8232190382069",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/1.png",
        "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/2.png",
        "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/3.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/thumbnail.png"
    },
    {
      "id": 11,
      "title": "Annibale Colombo Bed",
      "description": "The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.",
      "category": "furniture",
      "price": 1899.99,
      "discountPercentage": 0.29,
      "rating": 4.14,
      "stock": 47,
      "tags": [
        "furniture",
        "beds"
      ],
      "brand": "Annibale Colombo",
      "sku": "4KMDTZWF",
      "weight": 3,
      "dimensions": {
        "width": 28.75,
        "height": 26.88,
        "depth": 24.47
      },
      "warrantyInformation": "2 year warranty",
      "shippingInformation": "Ships overnight",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Great value for money!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Julian Newton",
          "reviewerEmail": "julian.newton@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Madison Collins",
          "reviewerEmail": "madison.collins@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Clara Berry",
          "reviewerEmail": "clara.berry@x.dummyjson.com"
        }
      ],
      "returnPolicy": "7 days return policy",
      "minimumOrderQuantity": 1,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "7113807059215",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/1.png",
        "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/2.png",
        "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/3.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png"
    },
    {
      "id": 12,
      "title": "Annibale Colombo Sofa",
      "description": "The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.",
      "category": "furniture",
      "price": 2499.99,
      "discountPercentage": 18.54,
      "rating": 3.08,
      "stock": 16,
      "tags": [
        "furniture",
        "sofas"
      ],
      "brand": "Annibale Colombo",
      "sku": "LUU95CQP",
      "weight": 3,
      "dimensions": {
        "width": 20.97,
        "height": 19.11,
        "depth": 25.81
      },
      "warrantyInformation": "1 month warranty",
      "shippingInformation": "Ships overnight",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Very satisfied!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Tyler Davis",
          "reviewerEmail": "tyler.davis@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Excellent quality!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Hannah Robinson",
          "reviewerEmail": "hannah.robinson@x.dummyjson.com"
        },
        {
          "rating": 3,
          "comment": "Waste of money!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Madison Collins",
          "reviewerEmail": "madison.collins@x.dummyjson.com"
        }
      ],
      "returnPolicy": "7 days return policy",
      "minimumOrderQuantity": 1,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "0426785817074",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png",
        "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/2.png",
        "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/3.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/thumbnail.png"
    },
    {
      "id": 13,
      "title": "Bedside Table African Cherry",
      "description": "The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.",
      "category": "furniture",
      "price": 299.99,
      "discountPercentage": 9.58,
      "rating": 4.48,
      "stock": 16,
      "tags": [
        "furniture",
        "bedside tables"
      ],
      "brand": "Furniture Co.",
      "sku": "OWPLTZYX",
      "weight": 10,
      "dimensions": {
        "width": 25.43,
        "height": 20.2,
        "depth": 24.95
      },
      "warrantyInformation": "6 months warranty",
      "shippingInformation": "Ships in 1-2 business days",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Very happy with my purchase!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "John Doe",
          "reviewerEmail": "john.doe@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Highly recommended!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Avery Carter",
          "reviewerEmail": "avery.carter@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Evelyn Sanchez",
          "reviewerEmail": "evelyn.sanchez@x.dummyjson.com"
        }
      ],
      "returnPolicy": "No return policy",
      "minimumOrderQuantity": 5,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "2913244159666",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/furniture/Bedside%20Table%20African%20Cherry/1.png",
        "https://cdn.dummyjson.com/products/images/furniture/Bedside%20Table%20African%20Cherry/2.png",
        "https://cdn.dummyjson.com/products/images/furniture/Bedside%20Table%20African%20Cherry/3.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/furniture/Bedside%20Table%20African%20Cherry/thumbnail.png"
    },
    {
      "id": 14,
      "title": "Knoll Saarinen Executive Conference Chair",
      "description": "The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.",
      "category": "furniture",
      "price": 499.99,
      "discountPercentage": 15.23,
      "rating": 4.11,
      "stock": 47,
      "tags": [
        "furniture",
        "office chairs"
      ],
      "brand": "Knoll",
      "sku": "RKHVJ4FE",
      "weight": 3,
      "dimensions": {
        "width": 16.59,
        "height": 21.46,
        "depth": 29.07
      },
      "warrantyInformation": "Lifetime warranty",
      "shippingInformation": "Ships in 3-5 business days",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Very happy with my purchase!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Leah Gutierrez",
          "reviewerEmail": "leah.gutierrez@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Nolan Gonzalez",
          "reviewerEmail": "nolan.gonzalez@x.dummyjson.com"
        },
        {
          "rating": 2,
          "comment": "Waste of money!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Stella Morris",
          "reviewerEmail": "stella.morris@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 5,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "0726316339746",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/1.png",
        "https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/2.png",
        "https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/3.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/thumbnail.png"
    },
    {
      "id": 15,
      "title": "Wooden Bathroom Sink With Mirror",
      "description": "The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.",
      "category": "furniture",
      "price": 799.99,
      "discountPercentage": 11.22,
      "rating": 3.26,
      "stock": 95,
      "tags": [
        "furniture",
        "bathroom"
      ],
      "brand": "Bath Trends",
      "sku": "7OLTIEVO",
      "weight": 6,
      "dimensions": {
        "width": 7.32,
        "height": 22.64,
        "depth": 12.37
      },
      "warrantyInformation": "6 months warranty",
      "shippingInformation": "Ships in 3-5 business days",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Highly recommended!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Charlotte Lopez",
          "reviewerEmail": "charlotte.lopez@x.dummyjson.com"
        },
        {
          "rating": 1,
          "comment": "Would not recommend!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "William Gonzalez",
          "reviewerEmail": "william.gonzalez@x.dummyjson.com"
        },
        {
          "rating": 2,
          "comment": "Not worth the price!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Ava Harrison",
          "reviewerEmail": "ava.harrison@x.dummyjson.com"
        }
      ],
      "returnPolicy": "7 days return policy",
      "minimumOrderQuantity": 1,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "7839797529453",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/furniture/Wooden%20Bathroom%20Sink%20With%20Mirror/1.png",
        "https://cdn.dummyjson.com/products/images/furniture/Wooden%20Bathroom%20Sink%20With%20Mirror/2.png",
        "https://cdn.dummyjson.com/products/images/furniture/Wooden%20Bathroom%20Sink%20With%20Mirror/3.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/furniture/Wooden%20Bathroom%20Sink%20With%20Mirror/thumbnail.png"
    },
    {
      "id": 16,
      "title": "Apple",
      "description": "Fresh and crisp apples, perfect for snacking or incorporating into various recipes.",
      "category": "groceries",
      "price": 1.99,
      "discountPercentage": 1.97,
      "rating": 2.96,
      "stock": 9,
      "tags": [
        "fruits"
      ],
      "sku": "QTROUV79",
      "weight": 8,
      "dimensions": {
        "width": 8.29,
        "height": 5.58,
        "depth": 12.41
      },
      "warrantyInformation": "2 year warranty",
      "shippingInformation": "Ships in 2 weeks",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Great product!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Logan Lee",
          "reviewerEmail": "logan.lee@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Great product!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Elena Long",
          "reviewerEmail": "elena.long@x.dummyjson.com"
        },
        {
          "rating": 1,
          "comment": "Not as described!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Grayson Coleman",
          "reviewerEmail": "grayson.coleman@x.dummyjson.com"
        }
      ],
      "returnPolicy": "60 days return policy",
      "minimumOrderQuantity": 44,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "2517819903837",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Apple/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png"
    },
    {
      "id": 17,
      "title": "Beef Steak",
      "description": "High-quality beef steak, great for grilling or cooking to your preferred level of doneness.",
      "category": "groceries",
      "price": 12.99,
      "discountPercentage": 17.99,
      "rating": 2.83,
      "stock": 96,
      "tags": [
        "meat"
      ],
      "sku": "BWWA2MSO",
      "weight": 9,
      "dimensions": {
        "width": 23.35,
        "height": 13.48,
        "depth": 26.4
      },
      "warrantyInformation": "1 month warranty",
      "shippingInformation": "Ships overnight",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Ethan Martinez",
          "reviewerEmail": "ethan.martinez@x.dummyjson.com"
        },
        {
          "rating": 3,
          "comment": "Disappointing product!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Owen Fisher",
          "reviewerEmail": "owen.fisher@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Very happy with my purchase!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Scarlett Wright",
          "reviewerEmail": "scarlett.wright@x.dummyjson.com"
        }
      ],
      "returnPolicy": "90 days return policy",
      "minimumOrderQuantity": 21,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "8335515097879",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Beef%20Steak/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Beef%20Steak/thumbnail.png"
    },
    {
      "id": 18,
      "title": "Cat Food",
      "description": "Nutritious cat food formulated to meet the dietary needs of your feline friend.",
      "category": "groceries",
      "price": 8.99,
      "discountPercentage": 9.57,
      "rating": 2.88,
      "stock": 13,
      "tags": [
        "pet supplies",
        "cat food"
      ],
      "sku": "C3F8QN6O",
      "weight": 9,
      "dimensions": {
        "width": 15.4,
        "height": 13.97,
        "depth": 25.13
      },
      "warrantyInformation": "3 months warranty",
      "shippingInformation": "Ships in 1-2 business days",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Mateo Bennett",
          "reviewerEmail": "mateo.bennett@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Aurora Barnes",
          "reviewerEmail": "aurora.barnes@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Great value for money!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Ellie Stewart",
          "reviewerEmail": "ellie.stewart@x.dummyjson.com"
        }
      ],
      "returnPolicy": "7 days return policy",
      "minimumOrderQuantity": 48,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "5503491330693",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Cat%20Food/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Cat%20Food/thumbnail.png"
    },
    {
      "id": 20,
      "title": "Cooking Oil",
      "description": "Versatile cooking oil suitable for frying, sautéing, and various culinary applications.",
      "category": "groceries",
      "price": 4.99,
      "discountPercentage": 18.89,
      "rating": 4.01,
      "stock": 22,
      "tags": [
        "cooking essentials"
      ],
      "sku": "Q6ZP1UY8",
      "weight": 8,
      "dimensions": {
        "width": 8.18,
        "height": 27.45,
        "depth": 27.88
      },
      "warrantyInformation": "Lifetime warranty",
      "shippingInformation": "Ships in 1 month",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Mason Parker",
          "reviewerEmail": "mason.parker@x.dummyjson.com"
        },
        {
          "rating": 3,
          "comment": "Poor quality!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Jonathan Pierce",
          "reviewerEmail": "jonathan.pierce@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Alexander Hernandez",
          "reviewerEmail": "alexander.hernandez@x.dummyjson.com"
        }
      ],
      "returnPolicy": "60 days return policy",
      "minimumOrderQuantity": 2,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "6707669443381",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Cooking%20Oil/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Cooking%20Oil/thumbnail.png"
    },
    {
      "id": 21,
      "title": "Cucumber",
      "description": "Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.",
      "category": "groceries",
      "price": 1.49,
      "discountPercentage": 11.44,
      "rating": 4.71,
      "stock": 22,
      "tags": [
        "vegetables"
      ],
      "sku": "6KGF2K6Z",
      "weight": 9,
      "dimensions": {
        "width": 11.04,
        "height": 20.5,
        "depth": 8.18
      },
      "warrantyInformation": "5 year warranty",
      "shippingInformation": "Ships overnight",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Very satisfied!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Elijah Hill",
          "reviewerEmail": "elijah.hill@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Fast shipping!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Liam Garcia",
          "reviewerEmail": "liam.garcia@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Excellent quality!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Ella Cook",
          "reviewerEmail": "ella.cook@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 7,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "2597004869708",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Cucumber/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Cucumber/thumbnail.png"
    },
    {
      "id": 22,
      "title": "Dog Food",
      "description": "Specially formulated dog food designed to provide essential nutrients for your canine companion.",
      "category": "groceries",
      "price": 10.99,
      "discountPercentage": 18.15,
      "rating": 2.74,
      "stock": 40,
      "tags": [
        "pet supplies",
        "dog food"
      ],
      "sku": "A6QRCH37",
      "weight": 2,
      "dimensions": {
        "width": 29.39,
        "height": 29.77,
        "depth": 20.54
      },
      "warrantyInformation": "1 year warranty",
      "shippingInformation": "Ships in 1 month",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Highly impressed!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Leo Rivera",
          "reviewerEmail": "leo.rivera@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Highly recommended!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Alexander Jones",
          "reviewerEmail": "alexander.jones@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Addison Wright",
          "reviewerEmail": "addison.wright@x.dummyjson.com"
        }
      ],
      "returnPolicy": "90 days return policy",
      "minimumOrderQuantity": 29,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "7957222289508",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Dog%20Food/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Dog%20Food/thumbnail.png"
    },
    {
      "id": 23,
      "title": "Eggs",
      "description": "Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.",
      "category": "groceries",
      "price": 2.99,
      "discountPercentage": 5.8,
      "rating": 4.46,
      "stock": 10,
      "tags": [
        "dairy"
      ],
      "sku": "YA617RI7",
      "weight": 4,
      "dimensions": {
        "width": 12.3,
        "height": 10.99,
        "depth": 15.53
      },
      "warrantyInformation": "3 year warranty",
      "shippingInformation": "Ships overnight",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 2,
          "comment": "Very unhappy with my purchase!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Mateo Perez",
          "reviewerEmail": "mateo.perez@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Very happy with my purchase!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Cameron Perez",
          "reviewerEmail": "cameron.perez@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Very happy with my purchase!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Aurora Barnes",
          "reviewerEmail": "aurora.barnes@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 43,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "7095702028776",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Eggs/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Eggs/thumbnail.png"
    },
    {
      "id": 24,
      "title": "Fish Steak",
      "description": "Quality fish steak, suitable for grilling, baking, or pan-searing.",
      "category": "groceries",
      "price": 14.99,
      "discountPercentage": 7,
      "rating": 4.83,
      "stock": 99,
      "tags": [
        "seafood"
      ],
      "sku": "XNIH1MTA",
      "weight": 8,
      "dimensions": {
        "width": 20.14,
        "height": 8.4,
        "depth": 10.01
      },
      "warrantyInformation": "1 year warranty",
      "shippingInformation": "Ships in 1 month",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Great value for money!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Michael Johnson",
          "reviewerEmail": "michael.johnson@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Julian Newton",
          "reviewerEmail": "julian.newton@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Excellent quality!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Lila Hudson",
          "reviewerEmail": "lila.hudson@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 49,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "4250692197342",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Fish%20Steak/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Fish%20Steak/thumbnail.png"
    },
    {
      "id": 25,
      "title": "Green Bell Pepper",
      "description": "Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.",
      "category": "groceries",
      "price": 1.29,
      "discountPercentage": 15.5,
      "rating": 4.28,
      "stock": 89,
      "tags": [
        "vegetables"
      ],
      "sku": "HU7S7VQ0",
      "weight": 7,
      "dimensions": {
        "width": 7.32,
        "height": 14.31,
        "depth": 21.38
      },
      "warrantyInformation": "5 year warranty",
      "shippingInformation": "Ships overnight",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Excellent quality!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Maya Reed",
          "reviewerEmail": "maya.reed@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Madison Collins",
          "reviewerEmail": "madison.collins@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Would buy again!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Ethan Thompson",
          "reviewerEmail": "ethan.thompson@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 1,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "7583442707568",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Green%20Bell%20Pepper/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Green%20Bell%20Pepper/thumbnail.png"
    },
    {
      "id": 26,
      "title": "Green Chili Pepper",
      "description": "Spicy green chili pepper, ideal for adding heat to your favorite recipes.",
      "category": "groceries",
      "price": 0.99,
      "discountPercentage": 18.51,
      "rating": 4.43,
      "stock": 8,
      "tags": [
        "vegetables"
      ],
      "sku": "Y4RM3JCB",
      "weight": 2,
      "dimensions": {
        "width": 18.67,
        "height": 21.17,
        "depth": 25.26
      },
      "warrantyInformation": "No warranty",
      "shippingInformation": "Ships in 1-2 business days",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 2,
          "comment": "Disappointing product!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Mateo Bennett",
          "reviewerEmail": "mateo.bennett@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Natalie Price",
          "reviewerEmail": "natalie.price@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Very satisfied!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Avery Barnes",
          "reviewerEmail": "avery.barnes@x.dummyjson.com"
        }
      ],
      "returnPolicy": "30 days return policy",
      "minimumOrderQuantity": 43,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "8400326844874",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Green%20Chili%20Pepper/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Green%20Chili%20Pepper/thumbnail.png"
    },
    {
      "id": 27,
      "title": "Honey Jar",
      "description": "Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.",
      "category": "groceries",
      "price": 6.99,
      "discountPercentage": 1.91,
      "rating": 3.5,
      "stock": 25,
      "tags": [
        "condiments"
      ],
      "sku": "BTBNIIOU",
      "weight": 9,
      "dimensions": {
        "width": 26.53,
        "height": 27.11,
        "depth": 6.63
      },
      "warrantyInformation": "2 year warranty",
      "shippingInformation": "Ships overnight",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Fast shipping!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Nicholas Bailey",
          "reviewerEmail": "nicholas.bailey@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Awesome product!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Gabriel Hayes",
          "reviewerEmail": "gabriel.hayes@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Highly impressed!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "James Garcia",
          "reviewerEmail": "james.garcia@x.dummyjson.com"
        }
      ],
      "returnPolicy": "90 days return policy",
      "minimumOrderQuantity": 1,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "0668665656044",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Honey%20Jar/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Honey%20Jar/thumbnail.png"
    },
    {
      "id": 28,
      "title": "Ice Cream",
      "description": "Creamy and delicious ice cream, available in various flavors for a delightful treat.",
      "category": "groceries",
      "price": 5.49,
      "discountPercentage": 7.58,
      "rating": 3.77,
      "stock": 76,
      "tags": [
        "desserts"
      ],
      "sku": "VEZMU1EQ",
      "weight": 5,
      "dimensions": {
        "width": 17.66,
        "height": 24.49,
        "depth": 25.98
      },
      "warrantyInformation": "2 year warranty",
      "shippingInformation": "Ships in 2 weeks",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Great product!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Elena Baker",
          "reviewerEmail": "elena.baker@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Highly impressed!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Madeline Simpson",
          "reviewerEmail": "madeline.simpson@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Very happy with my purchase!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Caleb Nelson",
          "reviewerEmail": "caleb.nelson@x.dummyjson.com"
        }
      ],
      "returnPolicy": "No return policy",
      "minimumOrderQuantity": 19,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "9603960319256",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Ice%20Cream/1.png",
        "https://cdn.dummyjson.com/products/images/groceries/Ice%20Cream/2.png",
        "https://cdn.dummyjson.com/products/images/groceries/Ice%20Cream/3.png",
        "https://cdn.dummyjson.com/products/images/groceries/Ice%20Cream/4.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Ice%20Cream/thumbnail.png"
    },
    {
      "id": 29,
      "title": "Juice",
      "description": "Refreshing fruit juice, packed with vitamins and great for staying hydrated.",
      "category": "groceries",
      "price": 3.99,
      "discountPercentage": 5.45,
      "rating": 3.41,
      "stock": 99,
      "tags": [
        "beverages"
      ],
      "sku": "M2K19S06",
      "weight": 2,
      "dimensions": {
        "width": 8.97,
        "height": 12.26,
        "depth": 15.05
      },
      "warrantyInformation": "1 week warranty",
      "shippingInformation": "Ships in 1-2 business days",
      "availabilityStatus": "In Stock",
      "reviews": [
        {
          "rating": 4,
          "comment": "Very satisfied!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Leo Rivera",
          "reviewerEmail": "leo.rivera@x.dummyjson.com"
        },
        {
          "rating": 2,
          "comment": "Not worth the price!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Ethan Martinez",
          "reviewerEmail": "ethan.martinez@x.dummyjson.com"
        },
        {
          "rating": 4,
          "comment": "Excellent quality!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Max Parker",
          "reviewerEmail": "max.parker@x.dummyjson.com"
        }
      ],
      "returnPolicy": "90 days return policy",
      "minimumOrderQuantity": 26,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "8546824122355",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Juice/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Juice/thumbnail.png"
    },
    {
      "id": 30,
      "title": "Kiwi",
      "description": "Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.",
      "category": "groceries",
      "price": 2.49,
      "discountPercentage": 10.32,
      "rating": 4.37,
      "stock": 1,
      "tags": [
        "fruits"
      ],
      "sku": "0X3NORB9",
      "weight": 8,
      "dimensions": {
        "width": 27.3,
        "height": 7.48,
        "depth": 15.08
      },
      "warrantyInformation": "6 months warranty",
      "shippingInformation": "Ships in 3-5 business days",
      "availabilityStatus": "Low Stock",
      "reviews": [
        {
          "rating": 5,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Nora Russell",
          "reviewerEmail": "nora.russell@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Very pleased!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Dylan Wells",
          "reviewerEmail": "dylan.wells@x.dummyjson.com"
        },
        {
          "rating": 5,
          "comment": "Great product!",
          "date": "2024-05-23T08:56:21.620Z",
          "reviewerName": "Noah Hernandez",
          "reviewerEmail": "noah.hernandez@x.dummyjson.com"
        }
      ],
      "returnPolicy": "7 days return policy",
      "minimumOrderQuantity": 8,
      "meta": {
        "createdAt": "2024-05-23T08:56:21.620Z",
        "updatedAt": "2024-05-23T08:56:21.620Z",
        "barcode": "3325493172934",
        "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
      },
      "images": [
        "https://cdn.dummyjson.com/products/images/groceries/Kiwi/1.png"
      ],
      "thumbnail": "https://cdn.dummyjson.com/products/images/groceries/Kiwi/thumbnail.png"
    }
  ],
  "total": 194,
  "skip": 0,
  "limit": 30
}