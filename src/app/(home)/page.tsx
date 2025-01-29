import { Kanit } from "next/font/google"
import { PackageName, TestPage } from "./client"
import { Button } from "./homeui/button"
import type { SVGProps } from "react"
import Link from "next/link"
import { RootBackground } from "../ui/Background"

const kanit = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})


export default function HomePage() {
  
  return (
    <div className={`bg-[#FEF7E3] min-h-screen flex flex-col p-8 items-center *:w-full *:max-w-screen-sm text-[#147457] ${ kanit.className }`}>
      <RootBackground color="#FEF7E3" />
      <div className="pt-20" />
      <header className="flex flex-col items-center gap-2">
        <div className="text-center text-lg font-bold bg-[#f48052] !w-[unset] rounded-lg text-white px-4">
          v0.0.5 pre-release
        </div>
        <h1 className={`text-[#147457] text-center text-6xl sm:text-7xl font-extrabold tracking-tight leading-none`}>
          Animate Arrays<br /> with Ease
        </h1>
        <div className="text-center text-2xl my-1 font-bold text-[#147457bb]">Add, remove, and reorder array elements smoothly</div>
      </header>
      <div className="pt-10" />
      <div className="flex gap-2 justify-center">
        <PackageName />
        <Link href={"/docs"} className="pt-2 bg-[#9C8660] text-white px-6 font-bold rounded-lg
          border-[#8a7141] border shadow-[inset_0_-2px_3px_0_#0003]
        ">
          Docs
        </Link>
        <button className="mx-4 w-8 aspect-square text-[#9C8660] hover:brightness-125 cursor-pointer">
          <MdiGithub className="w-full h-full" />
        </button>
      </div>



      <div className="pt-32" />
      <h2 className="text-center font-extrabold text-3xl">Usage</h2>
      <div className="pt-4" />
      <TestPage />



      <div className="pt-40" />
      <h2 className="text-center font-extrabold text-3xl my-4">How it works</h2>
      <div className="text-center font-bold text-xl text-[#147457bb]">
        React FLIP Array uses the FLIP technique to animate array elements. It calculates the position of each element before and after the array changes, then animates the elements to their new positions.
        <br />
        <br />
        The component uses the <code className="p-1 px-2 text-[0.8em] bg-[#9C866022] rounded-md ">key</code> prop to identify each element. When the array changes, the component will animate the elements to their new positions.
      </div>



      <div className="pt-40" />
      <h2 className="text-center font-extrabold text-3xl">Footer</h2>
      <div className="pt-4" />
      <footer>
        <div className="text-center text-[#147457bb] text-sm">
          &copy; {new Date().getFullYear()} React Flip Array | built by <a href="" className="underline">@alfonsusac</a>
        </div>
      </footer>
    </div>
  )
}


function MdiGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
  )
}