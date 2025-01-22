"use client"

import { useState, type ReactElement, type ReactNode } from "react"
import { Flipped, Flipper } from "react-flip-toolkit"



export default function Page() {

  const [arr, setArr] = useState([1, 2, 3, 4, 5])
  const [flexdir, setFlexdir] = useState('row' as 'row' | 'column')
  // const [parent, enableAnimations] = useAutoAnimate(/* optional config */)


  const changeFlexdir = () => {
    document.startViewTransition(() => {
      setFlexdir(flexdir === 'row' ? 'column' : 'row')
    })
  }

  const shuffle = () => {
    document.startViewTransition(() => {
      setArr(arr.toSorted(() => Math.random() - 0.5))
    })
  }

  const changeFlexdirNoViewTrans = () => {
    setFlexdir(flexdir === 'row' ? 'column' : 'row')
  }

  const shuffleNoViewTrans = () => {
    setArr(arr.toSorted(() => Math.random() - 0.5))
  }

  return (
    <div className="flex flex-col items-start">
      <button onClick={changeFlexdir}>Toggle Dir</button>
      <button onClick={shuffle}>Shuffle</button>
      <ul className="flex flex-wrap gap-2 relative p-4 bg-slate-900" style={{
        flexDirection: flexdir,
      }}>
        {/* <AnimatedList> */}
          {arr.map((n, i) => <li className="transition-all duration-500 ease-in-out p-1 bg-slate-600 w-10 h-10 relative"
            style={{ viewTransitionName: `elem-${ n }` }}
            key={n}>{n}</li>)}
        {/* </AnimatedList> */}
      </ul>

    </div>
  )
}

const ListShuffler = () => {
  const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const shuffleList = () => setData(data.toSorted(() => Math.random() - 0.5));

  return (
    <Flipper flipKey={data.join("")}>
      <button onClick={shuffleList}> shuffle</button>
      <ul className="list">
        {data.map(d => (
          <Flipped key={d} flipId={d}>
            <li>{d}</li>
          </Flipped>
        ))}
      </ul>
    </Flipper>
  );
};