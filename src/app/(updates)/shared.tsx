import { useRef, useState } from "react"

export function useArrayDemo(init?: number) {
  const lastIdRef = useRef(init ?? 10)
  const [arr, setArr] = useState([...Array(init ?? 10)].map((_, i) => i))

  const shuffle = () => setArr(prev => prev.toSorted(() => Math.random() - 0.5))
  const add = () => {
    // const newArr = [...arr]
    // console.log(newArr)
    // newArr.splice(Math.floor(Math.random() * arr.length), 0, ++lastIdRef.current)
    // console.log(newArr)
    setArr(prev => {
      const newArr = [...prev]
      newArr.splice(Math.floor(Math.random() * prev.length), 0, ++lastIdRef.current)
      return newArr
    })
  }
  const addFirst = () => setArr(prev => [++lastIdRef.current, ...prev])
  const addLast = () => setArr(prev => [...prev, ++lastIdRef.current])
  const remove = (key: number) => setArr(prev => prev.filter(e => e !== key))
  const reverse = () => setArr(prev => prev.toReversed())
  const moveUp = (key: number) => setArr(prev => {
    const index = prev.indexOf(key)
    if (index === 0) return prev
    const newArr = [...prev]
    newArr[index] = prev[index - 1]
    newArr[index - 1] = key
    return newArr
  })
  const moveDown = (key: number) => setArr(prev => {
    const index = prev.indexOf(key)
    if (index === prev.length - 1) return prev
    const newArr = [...prev]
    newArr[index] = prev[index + 1]
    newArr[index + 1] = key
    return newArr
  })

  return {
    arr,
    shuffle,
    add,
    addFirst,
    addLast,
    remove,
    reverse,
    moveUp,
    moveDown
  }
}


// export function useTab<const T extends string[]>(...titles: T) {
//   const [tab, setTab] = useState<T[number]>(0)
//   const goToTab = (tab: keyof T) => () => setTab(tab)
//   return {
//     goToTab
//   }
// }

// const test = useTab("tab1", "tab2", "tab3")

// test.goToTab("tab1")




// type ArrayIndexes<T extends Array<any>> = T


// type Indices<T extends readonly any[]> = Exclude<Partial<T>["length"], T["length"]>

// type X = Indices<["a", 123, "c"]>
// //   ^?

// const e = useTab(
//   "tab1",
//   "tab2",
//   "tab3",
// )



export function useArrayArticleDemo(
  initCount: number = 10
) {
  const lastIdRef = useRef(initCount)

  const [arr, setArr] = useState([...Array(initCount)].map((_, i) => i))


  const shuffle = () => setArr(prev => prev.toSorted(() => Math.random() - 0.5))
  const add = () => {
    const newArr = [...arr]
    newArr.splice(Math.floor(Math.random() * arr.length), 0, ++lastIdRef.current)
    setArr(newArr)
  }
  const remove = (key: number) => setArr(prev => prev.filter(e => e !== key))
  const removeFn = (key: number) => () => remove(key)

  const reverse = () => setArr(prev => prev.toReversed())

  const moveUp = (key: number) => {
    const index = arr.indexOf(key)
    if (index === 0) return
    const newArr = [...arr]
    newArr[index] = arr[index - 1]
    newArr[index - 1] = key
    setArr(newArr)
  }

  const moveDown = (key: number) => {
    const index = arr.indexOf(key)
    if (index === arr.length - 1) return
    const newArr = [...arr]
    newArr[index] = arr[index + 1]
    newArr[index + 1] = key
    setArr(newArr)
  }

  return {
    arr: arr.map(i => {
      return {
        id: i,
        ...exampleArticles[i % exampleArticles.length]
      }
    }),
    shuffle,
    add,
    remove,
    removeFn,
    reverse,
    moveUp,
    moveDown
  }

}

export const exampleArticles: {
  title: string,
  date: string,
  author: string,
}[] = [
    {
      title: "useSyncExternalStore - The underrated React API",
      date: "September 6, 2022",
      author: "Sébastien Lorber",
    },
    {
      title: "Records & Tuples for React",
      date: "July 31, 2020",
      author: "Sébastien Lorber",
    },
    {
      title: "Using Expo in Gatsby",
      date: "May 11, 2020",
      author: "Sébastien Lorber",
    },
    {
      title: "Atomic CSS-in-JS",
      date: "April 27, 2020",
      author: "Sébastien Lorber",
    },
    {
      title: "Handling API request race conditions in React",
      date: "August 30, 2019",
      author: "Sébastien Lorber",
    },
    {
      title: "Next-level frosted glass with backdrop-filter",
      date: "December 2nd, 2024",
      author: "Joshua Comeau"
    },
    {
      title: "A Framework for Evaluating Browser Support",
      date: "November 26th, 2024",
      author: "Joshua Comeau"
    },
    {
      title: "A Friendly Introduction to Container Queries",
      date: "November 4th, 2024",
      author: "Joshua Comeau"
    },
    {
      title: "How I Built My Blog",
      date: "September 24th, 2024",
      author: "Joshua Comeau"
    },
    {
      title: "The Undeniable Utility Of CSS :has",
      date: "September 9th, 2024",
      author: "Joshua Comeau"
    },
    {
      title: "Making a Blog with Fumadocs",
      date: "December 15th, 2024",
      author: "Fuma"
    },
    {
      title: "Fumadocs v14, Thu Sep 19 2024",
      date: "September 19th, 2024",
      author: "Fuma"
    },
  ]


export function useGenericArrayDemo<T>(
  source: T[],
  initCount: number = 10
) {
  const lastIdRef = useRef(initCount)
  const [arr, setArr] = useState([...Array(initCount)].map((_, i) => i))

  const shuffle = () => setArr(prev => prev.toSorted(() => Math.random() - 0.5))
  const add = () => {
    const newArr = [...arr]
    newArr.splice(Math.floor(Math.random() * arr.length), 0, ++lastIdRef.current)
    setArr(newArr)
  }
  const remove = (key: number) => setArr(prev => prev.filter(e => e !== key))
  const removeFn = (key: number) => () => remove(key)

  const reverse = () => setArr(prev => prev.toReversed())

  const moveUp = (key: number) => {
    const index = arr.indexOf(key)
    if (index === 0) return
    const newArr = [...arr]
    newArr[index] = arr[index - 1]
    newArr[index - 1] = key
    setArr(newArr)
  }

  const moveDown = (key: number) => {
    const index = arr.indexOf(key)
    if (index === arr.length - 1) return
    const newArr = [...arr]
    newArr[index] = arr[index + 1]
    newArr[index + 1] = key
    setArr(newArr)
  }

  return {
    arr: arr.map(i => {
      return {
        ...source[i % source.length],
        id: i,
      }
    }),
    shuffle,
    add,
    remove,
    removeFn,
    reverse,
    moveUp,
    moveDown,
    setArr,
  }

}