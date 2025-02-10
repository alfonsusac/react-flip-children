"use client"

import { cn } from "lazy-cn"
import { useEffect, useRef, useState, type SVGProps } from "react"
import ReactMarkdown from 'react-markdown'

const scale = 1

export default function ChatPage() {
  const [value, setValue] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submittedMessage, setSubmittedMessage] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [answering, setAnswering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>(null)

  const navRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const replyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (submitted) {

      if (!navRef.current) return
      const anim = navRef.current.animate([
        { translate: "0 0", bottom: "0", top: "auto", borderRadius: "1.5rem 1.5rem 0 0" },
        { translate: "0 100%", bottom: "0", top: "auto", borderRadius: "1.5rem 1.5rem 0 0" },
      ], {
        duration: 500,
        fill: "backwards",
        easing: "cubic-bezier(.8,0,.2,1)",
      })

      anim.onfinish = () => {
        if (!navRef.current) return
        navRef.current.animate([
          { translate: "0 -100%", top: "0", bottom: "auto" },
          { translate: "0 0", top: "0", bottom: "auto" },
        ], {
          delay: 200,
          fill: "backwards",
          duration: 500,
          easing: "cubic-bezier(.8,0,.2,1)",
        })
      }

      messageRef.current?.animate([
        { opacity: 0 },
        { opacity: 1 },
      ], {
        duration: 500,
        // delay: 1000,
        fill: "backwards",
        easing: "cubic-bezier(.8,0,.2,1)",
      })

      let cutoff = 0
      const interval = setInterval(() => {
        if (cutoff < text.length) {
          cutoff += 30
          setReplyMessage(text.slice(0, cutoff))
        } else {
          clearInterval(interval)
          setAnswering(false)
        }
      }, 100)
      intervalRef.current = interval
    }

  }, [submitted])


  return <div className="min-h-screen flex flex-col items-center bg-[#151516]">

    <div className={cn(
      "grow max-w-screen-sm w-full basis-0",
      !submitted && "overflow-hidden",
      submitted && "overflow-visible"
    )}>
      <div ref={messageRef} className="flex flex-col gap-2 mt-20">
        <div className={cn(
          "self-end",
          "p-2 outline outline-1 outline-zinc-800 rounded-xl",
          !submitted && "opacity-0"
        )}>
          {submittedMessage}
        </div>

        <div className={cn(
          "self-start",
          "p-2",
          "flex gap-4",
          !submitted && "opacity-0"
        )}>
          <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 p-1.5">
            <LucideBot className="w-full h-full" />
          </div>
          <div ref={replyRef} className={cn(
            "rounded-xl p-1 leading-relaxed",
            "[&_p]:my-2",

            "[&_h3]:text-xl",
            "[&_h3]:font-semibold",
            "[&_h3]:my-4",

            "[&_ol>li]:list-decimal",
            "[&_ul>li]:list-disc",
            "[&_li]:ml-6",
            "[&_li]:pl-2",
            "[&_li]:my-3",

            "[&_code]:text-sm",
            "[&_code]:bg-white/20",
            "[&_code]:p-1",
            "[&_code]:rounded-md",

          )}>
            <ReactMarkdown>
              {replyMessage}
            </ReactMarkdown>
          </div>

        </div>
      </div>
    </div>

    <div className={cn("max-w-screen-sm w-full flex flex-col gap-8 pb-8 sticky bottom-0",
      // !submitted && "my-auto",
      // submitted && "mt-auto mb-8"
    )}>
      <p className={cn(
        "text-center text-2xl font-bold transition-all",
        submitted && "opacity-0"
      )}>Ask AI.</p>
      <div className={cn(
        "bg-zinc-800 rounded-xl p-3 flex flex-col gap-2",
        "h-32 transition-all",
        "focus-within:ring-2 focus-within:ring-zinc-500 focus-within:ring-opacity-50",
        !submitted && "focus-within:h-52"
      )}>
        <textarea
          disabled={answering}
          value={answering ? "Answering..." : value}
          placeholder="Send a message"
          onChange={e => setValue(e.target.value)}
          className="bg-zinc-800 focus:outline-none grow disabled:opacity-60 disabled:pointer-events-none disabled:italic" />
        <hr className="border-zinc-600" />
        <div className="flex items-center justify-between text-xs">
          <p>{value.length}<span className="opacity-40">/200</span></p>
          {
            answering
              ? <button
                className="p-1.5 px-4 bg-red-500 rounded-full font-medium text-white
               text-sm flex items-center gap-2
            "
                onClick={() => {
                  setAnswering(false)
                  if (intervalRef.current)
                    clearInterval(intervalRef.current)
                }}
              >Abort <LucideLoader className="text-lg animate-spin" /></button>
              : <button
                className="p-2 px-4 bg-white rounded-full font-medium text-zinc-700
              hover:bg-zinc-100 text-sm flex items-center gap-2
            "
                onClick={() => {
                  setSubmitted(true)
                  setSubmittedMessage(value)
                  setAnswering(true)
                  setValue("")
                }}
              >Send <LucideChevronUp /></button>
          }
        </div>
      </div>
    </div>

    <div className={cn(
      "transition-all duration-500 delay-[400ms] ease-[cubic-bezier(.8,0,.2,1)] shrink-0 w-full basis-0 flex-initial",
      !submitted && "grow",
    )}></div>


    {/* navbar */}
    <div ref={navRef} className={cn(
      "flex gap-1 max-w-screen-sm w-full p-3  fixed  bg-zinc-800",
      "transition-all",
      !submitted && "rounded-t-3xl bottom-0",
      submitted && "rounded-b-3xl top-0",
    )}>
      <button
        className="p-2 px-4 bg-white rounded-full font-medium text-zinc-700
              hover:bg-zinc-100 text-sm flex items-center gap-2
            "
      ><LucideLogIn className="" />Login</button>
      <button
        className="p-2 px-4 bg-zinc-700/30 rounded-full font-medium
              text-sm flex items-center gap-2
            "
      >History <span className="opacity-30 ml-2 font-normal">S</span></button>
      <button
        className="p-2 px-4 bg-zinc-700/30 rounded-full font-medium
              text-sm flex items-center gap-2 grow
            "
      ><div className="grow text-left">Llama 3.2</div><LucideChevronDown /></button>
      <button
        className="p-1 bg-zinc-700/30 rounded-full font-medium
              text-sm flex items-center gap-0
            "
      >
        <div className="aspect-square w-6 rounded-full p-1">
          <LucideSun className="w-full h-full aspect-square" />
        </div>
        <div className="aspect-square w-6 rounded-full p-1">
          <LucideMoon className="w-full h-full aspect-square" />
        </div>
        <div className="bg-white/20 aspect-square w-6 rounded-full p-1">
          <LucideMonitor className="w-full h-full aspect-square" />
        </div>
      </button>
    </div>
  </div>
}



function LucideLogIn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4l5-5l-5-5m5 5H3"></path></svg>
  )
}

function LucideChevronUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m18 15l-6-6l-6 6"></path></svg>
  )
}


function LucideChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9l6 6l6-6"></path></svg>
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

function LucideMonitor(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect width="20" height="14" x="2" y="3" rx="2"></rect><path d="M8 21h8m-4-4v4"></path></g></svg>
  )
}
function LucideBot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2m16 0h2m-7-1v2m-6-2v2"></path></g></svg>
  )
}
function LucideLoader(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v4m4.2 1.8l2.9-2.9M18 12h4m-5.8 4.2l2.9 2.9M12 18v4m-7.1-2.9l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9"></path></svg>
  )
}


const text = `Next.js is a **React-based web framework** created by **Vercel** that allows developers to build fast and scalable web applications with features like server-side rendering (SSR), static site generation (SSG), and API routes. It's designed to provide a great developer experience while optimizing performance.

### Key Features of Next.js:
1. **File-based Routing**  
   - Routes are automatically created based on the file structure inside the \`pages\` directory.
   - For example, \`pages/about.js\` becomes \`/about\`.

2. **Rendering Options**  
   - **Server-Side Rendering (SSR):** Generate pages dynamically on each request.  
   - **Static Site Generation (SSG):** Generate pages at build time for better performance.  
   - **Client-Side Rendering (CSR):** Standard React behavior where rendering happens in the browser.  
   - **Incremental Static Regeneration (ISR):** Update static content after deployment without rebuilding the entire app.

3. **API Routes**  
   - You can create serverless API endpoints by adding files to the \`pages/api\` folder.

4. **Built-in CSS and Styling Support**  
   - Supports CSS, Sass, CSS Modules, Tailwind CSS, and more.

5. **Image Optimization**  
   - Provides automatic image optimization with the \`<Image>\` component.

6. **Middleware and Edge Functions**  
   - Middleware allows you to run code before a request is completed, enabling custom logic like redirects and authentication.

7. **Fast Development and Hot Reloading**  
   - Automatic recompilation when changes are made.

8. **Built-in Typescript Support**  
   - It works seamlessly with TypeScript for type-safe development.

### Why Use Next.js?
- **SEO Benefits:** Pages rendered on the server (SSR/SSG) improve SEO.  
- **Great DX (Developer Experience):** Simple routing and configuration.
- **Performance:** Optimized static assets, built-in image and script optimization, etc.  
- **Flexibility:** Choose between SSR, SSG, or hybrid approaches per page.

It's an excellent choice for modern web apps, especially those requiring fast performance, SEO optimization, and a great developer experience.
`