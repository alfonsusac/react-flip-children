import { Fragment, Suspense, type ComponentProps } from "react";
import { Div } from "../children-test/ProcessChildren";
import DivWithUse, { ChildrenTest, ClientList, MyContext, Portal } from "./client";

export default async function Page() {
  return (
    <div className="p-4">
      <h1>Children Test 2</h1>
      <div>Client</div>
      <ClientList />
      <div>Server</div>
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
        {/* <AsyncDiv>20</AsyncDiv>
        <AsyncDiv key="HUH?">20</AsyncDiv>
        {
          [
            <AsyncDiv key="HELLO">10</AsyncDiv>,
            <AsyncDiv key="WORLD">20</AsyncDiv>,
          ]
        }
        <Suspense>
          <AsyncDiv key="YOO">10</AsyncDiv>
        </Suspense> */}
        <Suspense fallback="Hmm">
          <DivWithUse>Yes</DivWithUse>
        </Suspense>
      </ChildrenTest>
    </div>
  )
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
async function AsyncDiv(
  props: ComponentProps<"div">
) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return <Div {...props} />
}