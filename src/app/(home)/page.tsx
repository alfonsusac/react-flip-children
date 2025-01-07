import { Kanit } from "next/font/google"
import { PackageName, TestPage } from "./client"
import { Button } from "./homeui/button"
import type { SVGProps } from "react"

const titleFont = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})


export default function HomePage() {
  return (
    <div className={`bg-[#FEF7E3] min-h-screen flex flex-col p-8 items-center *:w-full *:max-w-screen-sm text-[#147457] ${ titleFont.className }`}>
      <div className="pt-20" />
      <header className="flex flex-col items-center gap-2">
        <div className="text-center text-lg font-bold bg-[#DF7174] !w-[unset] rounded-lg text-white px-4">
          v0.0.1-not-even-released
        </div>
        <h1 className={`${ titleFont.className } text-[#147457] text-center text-6xl sm:text-7xl font-extrabold tracking-tight leading-none`}>
          Animate Arrays<br /> with Ease
        </h1>
        <div className="text-center text-2xl my-1 font-bold text-[#147457bb]">Add, remove, and reorder array elements smoothly</div>
      </header>
      <div className="pt-10" />
      <div className="flex gap-2 justify-center">
        {/* <Button onClick={copyToClipboard} className="bg-[#9C8660] text-white font-mono flex items-center">
          react-flip-array
        </Button> */}
        <PackageName />
        <button className="mx-4 w-8 aspect-square text-[#9C8660] hover:brightness-125 cursor-pointer">
          <MdiGithub className="w-full h-full" />
        </button>
      </div>

      <div className="pt-32" />
      <div className="text-center font-extrabold text-3xl">Usage</div>
      <div className="pt-4" />
      <TestPage />
      <div className="pt-40" />
      <div className="text-center font-extrabold text-3xl my-4">How it works</div>
      <div className="text-center font-bold text-xl text-[#147457bb]">
        React FLIP Array uses the FLIP technique to animate array elements. It calculates the position of each element before and after the array changes, then animates the elements to their new positions.
        <br />
        <br />
        The component uses the <code className="p-1 px-2 text-[0.8em] bg-[#9C866022] rounded-md ">key</code> prop to identify each element. When the array changes, the component will animate the elements to their new positions.
      </div>
      <div className="pt-4" />
      <div className="pt-40" />
      <div className="text-center font-extrabold text-3xl">Footer</div>
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


function MdiNpmVariant(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path d="M20 4H4v16h8V8h4v12h4V4" fill="currentColor"></path></svg>
  )
}

function LineiconsPnpm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M21 8.626h-5.625V3H21zm-6.188 0H9.187V3h5.625zm-6.187 0H3V3h5.625zM21 14.813h-5.625V9.188H21zm-6.188 0H9.187V9.188h5.625zm0 6.187H9.187v-5.625h5.625zM21 21h-5.625v-5.625H21zM8.625 21H3v-5.625h5.625z"></path></svg>
  )
}


function TablerBrandYarn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.845 19.308c-1.268.814-2.41 1.254-3.845 1.692c-.176.21-.645.544-.912.588A43 43 0 0 1 8.59 22c-.812.006-1.31-.214-1.447-.554c-.115-.279.336-2.054.298-1.964c-.157.392-.575 1.287-.997 1.72c-.579.6-1.674.4-2.322.051c-.71-.386-.07-1.28-.346-1.267S3 18.5 3 17.75c0-.828.622-1.674 1.235-2.211a6.8 6.8 0 0 1 .46-3.143a7.4 7.4 0 0 1 2.208-2.615S5.55 8.247 6.054 6.869c.328-.902.46-.895.567-.935c.38-.12.727-.33 1.013-.612c.78-.88 1.96-1.438 3.116-1.322c0 0 .781-2.43 1.533-1.936c.415.653.671 1.218.967 1.936c0 0 1.15-.7 1.25-.5c.514 1.398.487 3.204.211 4.67c-.324 1.408-.84 2.691-1.711 3.83c-.094.16.98.705 1.722 2.812c.686 1.928.278 2.438.278 2.688s.716.144 2.296-.855A5.85 5.85 0 0 1 20.28 15.5c.735-.066.988-.035 1.22 1s-.346 1.406-.744 1.506c0 0-2.09.675-2.911 1.302"></path></svg>
  )
}
