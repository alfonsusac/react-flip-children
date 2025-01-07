import type { Change } from "diff";
import { codeToTokens, type BundledTheme, type ThemedToken } from "shiki";

export async function codeToToken(code: string, theme: BundledTheme = 'vesper') {
  const { tokens } = await codeToTokens(code, {
    theme,
    lang: 'tsx'
  })
  return tokens
}

export type Token = {
  content: string
  color?: string
  coords: [col: number, row: number]
  id?: string
}

export function flattenToken(tokens: ThemedToken[][]) {
  const array: Token[] = []
  for (let row = 0; row < tokens.length; row++) {
    let col = 0
    for (let tokenIndex = 0; tokenIndex < tokens[row].length; tokenIndex++) {
      const token = tokens[row][tokenIndex]
      for (let charIndex = 0; charIndex < token.content.length; charIndex++) {
        array.push({
          content: token.content[charIndex],
          color: token.color,
          coords: [col, row]
        })
        col++
      }
    }
    // check if there is next line from the array length
    if (tokens[row + 1]) {
      // console.log("Hey, new line :D")
      array.push({
        content: "\n",
        coords: [0, row + 1]
      })
    }
  }
  return array
}


// This is a very crude algorithm that haven't been tested thoroughly.
// It's a bit hard to understand, but it works for now.

// Need to test edge cases, where the newline is mismatched (?)
export function assignIDToToken(tokens: ThemedToken[][], tokenReference?: Token[], diff?: Change[]) {

  if (!tokenReference && !diff) {
    // Flatten tokens, if no tokenReference or diff, assign original id to each token.
    const f1 = flattenToken(tokens)
    const hasID = f1[0].id
    if (!hasID)
      f1.forEach((t, i) => t.id = Math.random().toString(36).slice(2))

    return f1
  }
  if ((tokenReference && !diff) || (diff && !tokenReference))
    throw new Error("tokenReference and diff must be provided together.")

  // console.log(diff)

  // Flatten the diff array to store information to each character.
  const flatDiff: [number, string][] = []
  diff!.forEach((t, i) => {
    const mode = t.added ? 1 : t.removed ? -1 : 0
    const content = t.value
    for (const char of content) {
      // if (char === "\n") continue // is this necessary?
      flatDiff.push([mode, char])
    }
  })
  // console.log(flatDiff)

  // tokenA: tokenReference, tokenB: tokens.
  // tokenA is the previous token, tokenB is the current token.
  // The goal is to assign the same id from Prev to Next if it exist on Prev.

  const tokenA = tokenReference!
  const tokenB = flattenToken(tokens)

  // Check first if previous tokens has id.
  tokenA.forEach(t => t.id ??= Math.random().toString(36).slice(2))

  // console.log("reference (prev) token")

  // console.log(tokens.map(t => t.map(t => t.content).join("")).join("\n").replace(/\n/g, "\\n"))
  // console.log(tokenReference!.map(t => t.content).join("").replace(/\n/g, "\\n"))
  // console.log(flatDiff.map(t => t[1]).join("").replace(/\n/g, "\\n"))

  // Cursor for previous token and diff array.
  let currA = 0
  let curDiff = 0

  // Assign id to current token array.
  tokenB.forEach((t, i) => {
    // console.log("Checking ", t.content)
    // Deleted
    if (flatDiff[curDiff][0] === -1) {
      // console.log(currA, tokenA[currA].content, tokenB[i].content, flatDiff[curDiff][1], flatDiff[curDiff][0], "skipping deleted token")
      while (flatDiff[curDiff][0] === -1) {
        // console.log(currA, tokenA[currA].content, tokenB[i].content, flatDiff[curDiff][1], flatDiff[curDiff][0], "skipped")
        currA++
        curDiff++
      }
      // continue to next case: Added / Stayed
    }

    if (flatDiff[curDiff][0] === 0) {
      // console.log(currA, tokenA[currA].content, tokenB[i].content, flatDiff[curDiff][1], flatDiff[curDiff][0], "using same id")
      t.id = tokenA![currA].id
      currA++
      curDiff++
      return
    }
    // Added
    if (flatDiff[curDiff][0] === 1) {
      // console.log(currA, tokenA[currA].content, tokenB[i].content, flatDiff[curDiff][1], flatDiff[curDiff][0], "NEW!")
      t.id = Math.random().toString(36).slice(2)
      curDiff++
      return
    }
  })

  return tokenB

}