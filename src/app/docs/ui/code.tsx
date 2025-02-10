"use client"

import { useEffect, useState } from "react"
import { codeToTokens, type BundledLanguage, type ThemedToken } from "shiki"

export function CodeBlock(
  props: {
    code: string
    tsx?: boolean
    css?: boolean
    html?: boolean
    lang?: BundledLanguage
    rowHighlight?: number[]
  }
) {
  const code = props.code.trimStart().trimEnd()
  const lang =
    props.tsx ? "tsx"
      : props.css ? "css"
        : props.html ? "html"
          : props.lang ?? "tsx"

  const [tokens, setTokens] = useState<ThemedToken[][]>([])

  const highlightedCode = tokens.map((line, i) => {
    return (
      <span key={i}>
        {line.map((token, i) => (
          <span key={i} className="animate-appear" style={{ color: token.color }}>
            {token.content}
          </span>
        ))}<br />
      </span>
    )
  })

  useEffect(() => {
    (async () => {
      const result = await codeToTokens(code, {
        lang,
        theme: "poimandres",
      })
      setTokens(result.tokens)
    })()
  }, [code, lang])

  return (
    <pre className="!bg-black/20">
      <code>
        {highlightedCode.length ? highlightedCode : <span className="opacity-0">{code}</span>}
      </code>
    </pre>
  )
}