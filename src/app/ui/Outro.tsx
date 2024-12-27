"use client"

import { cn } from "lazy-cn"
import { useEffect, useRef, useState, type ComponentProps, type SVGProps } from "react"

export function Outro() {

  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const labRef = useRef<HTMLDivElement>(null)
  const forLearnerRef = useRef<HTMLSpanElement>(null)
  const alwaysRef = useRef<HTMLSpanElement>(null)

  const [closing, isClosing] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isClosing(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!closing) return
    const container = containerRef.current
    const bg = bgRef.current
    const logo = logoRef.current

    document.body.style.overflow = 'hidden'

    container?.animate(
      [
        { opacity: 0, scale: 1.5 },
        { opacity: 1, scale: 1 }
      ],
      {
        duration: 1000,
        iterations: 1,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    )

    bg?.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 1000,
      iterations: 1,
      easing: 'ease-in-out',
      fill: 'forwards'
    })

    logo?.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 1000,
      delay: 1000,
      easing: 'ease-in-out',
      fill: 'both'
    })

    labRef.current?.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 1000,
      delay: 1000,
      easing: 'ease-in-out',
      fill: 'both'
    })

    forLearnerRef.current?.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 1000,
      delay: 2000,
      easing: 'ease-in-out',
      fill: 'forwards'
    })

    alwaysRef.current?.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 1000,
      delay: 3000,
      easing: 'ease-in-out',
      fill: 'forwards'
    })

    containerRef.current?.animate([
      { filter: "brightness(1)" },
      { filter: "brightness(0)" }
    ], {
      duration: 1000,
      delay: 5000,
      easing: 'ease-in-out',
      fill: 'forwards'
    })

  }, [closing])

  if (!closing) return null

  return (
    <div ref={containerRef} className="absolute inset-0 z-20">
      <div ref={bgRef} className="absolute inset-0 bg-[#D4420D] bg-grid"></div>
      <div ref={imgRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-24 items-center w-full">
        <div className="relative">
          <Logo className="opacity-0 z-10" ref={logoRef} />
          <Outline className="absolute top-0 left-0 -z-10" />
          <div ref={labRef} className="-rotate-6 absolute -right-10 -bottom-10 text-2xl font-black tracking-wider p-3 px-6 bg-[#171F2B] rounded-full flex gap-4 items-center">
            LAB
            <FluentBeaker20Filled className="w-8 h-8 -m-2 rotate-12" />
          </div>
        </div>
        <div className="text-[#FFD271] text-5xl font-semibold">
          <span ref={forLearnerRef} className="opacity-0">
            For Learners.{' '}
          </span>
          <span ref={alwaysRef} className="opacity-0">
            Always.
          </span>
        </div>
      </div>
    </div>
  )
}

function Logo(
  { className, ...props }: ComponentProps<"svg">
) {
  return (
    <svg width={148 * 3} height={60 * 3} viewBox="0 0 148 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className)} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M45.5 47L34.5 25L17 60H39L45.5 47Z" fill="#F85B27" />
      <path fillRule="evenodd" clipRule="evenodd" d="M45.5 47L34.5 25L17 60H39L45.5 47Z" fill="#F85B27" />
      <path fillRule="evenodd" clipRule="evenodd" d="M77 60L47 0L34.5 25L52 60H77Z" fill="#FFD271" />
      <path fillRule="evenodd" clipRule="evenodd" d="M116.5 47L105.5 25L88 60H110L116.5 47Z" fill="#F85B27" />
      <path fillRule="evenodd" clipRule="evenodd" d="M116.5 47L105.5 25L88 60H110L116.5 47Z" fill="#F85B27" />
      <path fillRule="evenodd" clipRule="evenodd" d="M148 60L118 0L105.5 25L123 60H148Z" fill="#FFD271" />
      <path fillRule="evenodd" clipRule="evenodd" d="M81.5 13L70.5 35L53 0H75L81.5 13Z" fill="#F85B27" />
      <path fillRule="evenodd" clipRule="evenodd" d="M81.5 13L70.5 35L53 0H75L81.5 13Z" fill="#F85B27" />
      <path fillRule="evenodd" clipRule="evenodd" d="M113 0L83 60L70.5 35L88 0H113Z" fill="#FFD271" />
      <path fillRule="evenodd" clipRule="evenodd" d="M18 0H0V60H3.00098V60.0001L18 60H39.0003L45.5003 47L45.5006 47.0007V47H45.5003L18 47V0Z" fill="#FFD271" />
    </svg>
  )
}

function Outline(
  { className, ...props }: ComponentProps<"svg">
) {



  return (
    <svg width={148 * 3} height={60 * 3} viewBox="0 0 148 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={cn("logo-outline-animation", className)} {...props}
    >
      <path d="M18.618 59L34.5 27.2361L44.382 47L38.382 59H18.618Z" stroke="#F85B27" strokeWidth="2" />
      <path d="M35.618 25L47 2.23607L75.382 59H52.618L35.618 25Z" stroke="#FFD271" strokeWidth="2" />
      <path d="M89.618 59L105.5 27.2361L115.382 47L109.382 59H89.618Z" stroke="#F85B27" strokeWidth="2" />
      <path d="M106.618 25L118 2.23607L146.382 59H123.618L106.618 25Z" stroke="#FFD271" strokeWidth="2" />
      <path d="M74.382 1L80.382 13L70.5 32.7639L54.618 1H74.382Z" stroke="#F85B27" strokeWidth="2" />
      <path d="M88.618 1H111.382L83 57.7639L71.618 35L88.618 1Z" stroke="#FFD271" strokeWidth="2" />
      <path d="M43.8823 48L38.3823 59H1V1H17V47V48H18L43.8823 48Z" stroke="#FFD271" strokeWidth="2" />
    </svg>
  )
}


function FluentBeaker20Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" {...props}><path fill="currentColor" d="M5.5 3.5A.5.5 0 0 1 6 3h8a.5.5 0 0 1 0 1h-.996v4.684c0 .58.144 1.15.42 1.66L14.315 12h-8.63l.89-1.653a3.5 3.5 0 0 0 .42-1.66V4H6a.5.5 0 0 1-.5-.5M5.146 13l-.964 1.79a1.5 1.5 0 0 0 1.32 2.212h8.997a1.5 1.5 0 0 0 1.32-2.212L14.854 13z"></path></svg>
  )
}