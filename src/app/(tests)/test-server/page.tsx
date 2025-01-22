import { Suspense, type ComponentProps } from "react"
import { AnimateChild2 } from "../../ui/Reorder3"
import Link from "next/link"
import { ChildrenPromiseTest } from "./promiseTest"
import { Div, ProcessChildren } from "../children-test/ProcessChildren"

export default async function PageTest(props: {
  searchParams: Promise<{ value: string }>
}) {
  const sp = await props.searchParams
  const values = sp.value?.split(',').map(Number)
  console.log(values)

  // generate randoms string with math.radom
  // const str = Math.random().toString(36).substring(7)

  return (
    <div className="flex flex-col">
      <Link href={`/test-server?value=${ [1, 2, 3, 4, 5].toSorted(() => Math.random() - 0.5) }`}>Shuffle</Link>
      <ProcessChildren>
        {/* <Suspense fallback="Umm..."> */}
        <AsyncComponent>{Math.random().toString(36).substring(7)}</AsyncComponent>
        {values?.map(value => (
          // <div key={value}>
            // <Suspense fallback="Umm...">
              <AsyncComponent key={value}>{value}</AsyncComponent>
            // {/* </Suspense> */}
          // {/* </div> */}
        ))}
      </ProcessChildren>
      {/* <Suspense fallback="Ummmmmmmmmm..."> */}
      {/* <AsyncList values={values} /> */}
      {/* </Suspense> */}
      <div>
        Hello?
      </div>
    </div>
  )
}

async function AsyncList(
  props: { values: number[] }
) {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500))
  return (
    <AnimateChild2>
      <Suspense fallback="Umm...">
        <AsyncComponent>{Math.random().toString(36).substring(7)}</AsyncComponent>
      </Suspense>
      {props.values?.map(value => (
        <div key={value}>
          <Suspense fallback="Umm...">
            <AsyncComponent key={value}>{value}</AsyncComponent>
          </Suspense>
        </div>
      ))}
    </AnimateChild2>
  )
}

async function AsyncComponent(
  props: { children: string | number }
  
) {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500))
  return (
    <Div {...props} />
  )
}