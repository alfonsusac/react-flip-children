import Link from "next/link";
import ChildrenTestClientPage from "./client";
import { Div, ProcessChildren } from "./ProcessChildren";
import { Suspense, type ComponentProps } from "react";

export default function Page() {

  // Random number between 3 - 10
  const start = Math.floor(Math.random() * 20) + 3
  const num = Math.floor(Math.random() * 20) + 3



  return (
    <div className="p-8 flex flex-col gap-4 items-start font-mono tracking-tight font-bold text-white/80 *:p-1 *:leading-4">
      <ChildrenTestClientPage />
      <div className="p-8 pt-0 font-mono text-bold">
        <div>Server Test</div>
        <div className="*:inline-block">
          <Link href="/children-test" className="text p-1 border-2 border-white/20">Generate new array with random length</Link>
        </div>
        {/* <div className="relative">
          Shuffle thing
          <ProcessChildren>
            {[...Array.from({ length: num })].map((_, i) => (
              <div key={i + start}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: `${ (i + start) * 2 }rem`,
                }}>
                  {i + start}
                </div>
              </div>
            ))}
          </ProcessChildren>
        </div>
        Async Thing with Suspense
        <ProcessChildren>
          {[...Array.from({ length: num })].map((_, i) => (
            <Suspense key={i + start} fallback={
              <div style={{
                position: "absolute",
                top: 0,
                left: `${ (i + start) * 2 }rem`,
              }}>
                .
              </div>
            }>
              <AsyncComp style={{
                position: "absolute",
                top: 0,
                left: `${ (i + start) * 2 }rem`,
              }}>
                {i + start}
              </AsyncComp>
            </Suspense>
          ))}
        </ProcessChildren>
        <br />
        <br /> */}
        {/* Async Thing withOUT Suspense
        <ProcessChildren>
          {[...Array.from({ length: num })].map((_, i) => (
            // <Suspense  fallback=".">
              <AsyncComp key={i + start} style={{
                position: "absolute",
                top: 0,
                left: `${ (i + start) * 2 }rem`,
              }}>
                {i + start}
              </AsyncComp>
            // </Suspense>
          ))}
        </ProcessChildren> */}
      </div>
    </div>
  )
}

