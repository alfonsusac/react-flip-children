import { useRef, useState } from "react"

export function useArrayDemo() {
  const lastIdRef = useRef(10)
  const [arr, setArr] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

  const shuffle = () => setArr(prev => prev.toSorted(() => Math.random() - 0.5))
  const add = () => {
    const newArr = [...arr]
    newArr.splice(Math.floor(Math.random() * arr.length), 0, ++lastIdRef.current)
    setArr(newArr)
  }
  const remove = (key: number) => setArr(prev => prev.filter(e => e !== key))
  const reverse = () => setArr(prev => prev.toReversed())

  return {
    arr,
    shuffle,
    add,
    remove,
    reverse,
  }
}


// export function useTab<T extends string[]>(title: T) {
//   const [tab, setTab] = useState<1 | 2 | 3>(1)
//   const goToTab = (tab: 1 | 2 | 3) => () => setTab(tab)
// }

// type ArrayIndexes<T extends any[]> = Omit<T, null>

// type E = ArrayIndexes<["a", "b", "c"]>