"use client"

import { Children, createContext, Fragment, isValidElement, Suspense, use, useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { Div } from "../children-test/ProcessChildren";
import { createPortal } from "react-dom";

export function ClientList() {

  useEffect(() => {
    console.log("Mounted")
  }, [])

  useEffect(() => {
    console.log("Hi")
  })

  return (
    <ChildrenTest>
      {/* {true}{undefined}{null}
      {2}{"Hello World"}{50n} */}
      {/* {getNull()}
      {getFourtyTwo()} */}
      {/* <Div /> */}
      {/* <Div>1</Div> */}
      {/* {[
        <Div key="Hello">2</Div>,
        <Div key="World">3</Div>,
      ]} */}
      {/* <>
        <Div>4</Div>
        <Div>5</Div>
      </> */}
      {/* <Fragment>
        <Div>6</Div>
        <Div>7</Div>
      </Fragment> */}
      {/* <Portal /> */}
      {/* <MyContext value="Hello World">
        <Div>8</Div>
        <Div>9</Div>
      </MyContext> */}
      <Suspense fallback="Hmm">
        <DivWithUse>Yes</DivWithUse>
      </Suspense>
    </ChildrenTest>
  )
}

export const MyContext = createContext("Hello World")


export const Portal = () => createPortal("Portals are cool", document.body)


export function ChildrenTest(
  props: {
    children?: ReactNode
  }
) {
  const [rendered, setRendered] = useState<ReactNode[]>([])
  useEffect(() => {
    const arr = Children.toArray(props.children)
    arr.forEach(child => {
      console.log(isValidElement(child), child)
    })
    console.log(arr)
  }, [props.children])
  return props.children
}



// async get funciton to return null, wait 1s
async function getNull() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return null
}
async function getFourtyTwo() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 42
}

// await 1s
const createwait1sPromise = () => new Promise(resolve => setTimeout(resolve, 5_000))

export default function DivWithUse(
  props: ComponentProps<"div">
) {
  const albums = use(createwait1sPromise());
  return (
    <div {...props} />
  );
}
