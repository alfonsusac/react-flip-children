"use client"

import { Children, cloneElement, createRef, Fragment, isValidElement, useEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactElement, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom"
import { isFragment } from "react-is"
import { Div, ProcessChildren } from "./ProcessChildren"
import { AnimateChildren } from "../lib/AnimateChildren"

export default function ChildrenTestClientPage() {

  const [arr, setArr] = useState([1, 2, 3, 4, 5])

  const ocl = () => setArr(prev => prev.toReversed())
  const ocl2 = () => setArr([1, 2, 3, 4, 5])

  const portalRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="">

      <div>
        <h1 className="font-black">React Children Test</h1>
        <br />
        This is a proof-of-concept of how you can add delayed deletion using ReactChildren methods.
        <br />
        Try pressing the blue boxes to remove them.
      </div>

      <div className="flex">
        <button onClick={ocl} className="p-2 border-2 border-white/20">Sort</button>
        <button onClick={ocl2} className="p-2 border-2 border-white/20">Restart</button>
      </div>

      {/* <ProcessChildren> */}
      <AnimateChildren>
        {true}
        {false}
        {null}
        {undefined}
        {2}
        {"This is to test"}
        {4}
        {"for if the children are primitive values."}
        <Div />
        <Div>1</Div>
        {
          [
            <Div key={"1"}>2</Div>,
            <Div key="2">3</Div>,
            [
              <Div key="1">4</Div>,
              <Div key="2">5</Div>,
              arr.map((el, index) => <Div className="bg-blue-950 cursor-pointer" key={el} onClick={() => setArr(prev => prev.filter(e => e !== el))} >{el}</Div>)
            ]
          ]
        }
        <>
        </>
        <>
          <Div>6</Div>
          <Div>7</Div>
          {
            arr.map((el, index) => <Div className="bg-blue-950 cursor-pointer" key={el} onClick={() => setArr(prev => prev.filter(e => e !== el))} >{el}</Div>)
          }
        </>
        <Fragment>
          <Div>8</Div>
          <Div>9</Div>
          {
            arr.map((el, index) => <Div className="bg-blue-950 cursor-pointer" key={el} onClick={() => setArr(prev => prev.filter(e => e !== el))} >{el}</Div>)
          }
        </Fragment>
        <Fragment key="FR">
          <Div>10</Div>
          <Div>11</Div>
          {
            arr.map((el, index) => <Div className="bg-blue-950 cursor-pointer" key={el} onClick={() => setArr(prev => prev.filter(e => e !== el))} >{el}</Div>)
          }
          {/* {typeof document !== "undefined" ? createPortal(
            <Div className="*:p-2 *:inline-block font-mono font-bold text-white text-sm">
              <Div className="!block">Portal Test</Div>
              <ProcessChildren>
                {
                  arr.map((el, index) => <Div className="bg-blue-950 cursor-pointer" key={el} onClick={() => setArr(prev => prev.filter(e => e !== el))} >{el}</Div>)
                }
              </ProcessChildren>
            </Div>,
            document.body
          ) : null} */}
        </Fragment>
      </AnimateChildren>
      {/* </ProcessChildren> */}
      <Div id="portal" />
    </div>
  )
}
