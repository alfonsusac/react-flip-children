/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { assignIDToToken, type Token } from "../codeToken";
import { ReorderArray } from "./Reorder";
import type { ThemedToken } from "shiki";
import { diffWordsWithSpace, type Change } from "diff";

export function AnimateCode<T extends ThemedToken[][][]>(props: {
  state: GetPossibleLengths<T>
  tokens: T,
  diffFunction?: DiffFunction,
  charWidth?: number,
  charHeight?: number,
}) {
  const [rendered, setRendered] = useState<Token[]>()
  const flats = useRef<Record<number, string>>({})
  const prevStateRef = useRef<number>(null)

  // Clear cache on diffFunction change
  useEffect(() => {
    cacheRef.current = {}
  }, [props.diffFunction])

  // Pre-compute values
  useEffect(() => {
    props.tokens.forEach((t, i) => flats.current[i] ??= tokenToRaw(t))
  }, [props.tokens])

  useEffect(() => {
    cacheRef.current = {}
  }, [props.tokens])

  // Cache results
  const cacheRef = useRef<Record<string, Change[]>>({})
  useEffect(() => {
    if (rendered) {
      const prevState = prevStateRef.current
      const cache = cacheRef.current
      if (prevState === null) return
      const f2 = flats.current[props.state]
      const f1 = flats.current[prevState]
      const diff = cache[`${ prevState },${ props.state }`] ??= (props.diffFunction ?? diffWordsWithSpace)(f1, f2)
      const newRendered = assignIDToToken(props.tokens[props.state], rendered, diff)
      setRendered(newRendered)
    } else {
      const newRendered = assignIDToToken(props.tokens[props.state])
      setRendered(newRendered)
    }
    prevStateRef.current = props.state
  }, [props.state])

  return <>
    <span className="text-transparent">{flats.current[props.state]}</span>
    <ReorderArray
      disableRotation
      disableBlur
      delayEntryAnimation
      deferElementDeletions
    >
      {rendered?.map(token => {
        if (token.content === '\n') return <br style={{
          userSelect: `none`,
          pointerEvents: `none`,
        }} key={token.id} />
        return (
          <span key={token.id} style={{
            color: token.color,
            userSelect: `none`,
            pointerEvents: `none`,
            top: `${ token.coords[1] }lh`,
            left: `${ token.coords[0] }ch`,
            willChange: `filter, opacity, transform`,
            textRendering: `geometricPrecision`,
          }}>
            {token.content}
          </span>
        )
      })}
    </ReorderArray>
  </>
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetPossibleLengths<T extends any[]> =
  T extends [infer _, ...infer B]
  ? GetPossibleLengths<B> | T['length']
  : never

function tokenToRaw(token: ThemedToken[][]) {
  const array: string[] = []
  for (let row = 0; row < token.length; row++) {
    for (let tokenIndex = 0; tokenIndex < token[row].length; tokenIndex++) {
      const tokenContent = token[row][tokenIndex].content
      array.push(tokenContent)
    }
    if (token[row + 1]) {
      array.push('\n')
    }
  }
  return array.join('')
}


export type DiffFunction = (oldStr: string, newStr: string) => Change[]


