"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { codeToTokens, type BundledLanguage, type BundledTheme, type ThemedToken } from "shiki"

export function CodeBlock(
  props: {
    code: string
    tsx?: boolean
    css?: boolean
    html?: boolean
    lang?: BundledLanguage
    rowHighlight?: number[]
    lightTheme?: BundledTheme
    darkTheme?: BundledTheme
    className?: string
  }
) {
  const code = props.code.trimStart().trimEnd()
  const lang =
    props.tsx ? "tsx"
      : props.css ? "css"
        : props.html ? "html"
          : props.lang ?? "tsx"

  const [tokensDark, setTokensDark] = useState<ThemedToken[][]>([])

  const highlightedCodeDark = tokensDark.map((line, i) => {
    return (
      <span key={i}>
        {line.map((token, i) => (
          <span key={i} className="animate-appear " style={token.htmlStyle as CSSProperties}>
            {token.content}
          </span>
        ))}<br />
      </span>
    )
  })

  useEffect(() => {
    (async () => {
      const resultDark = await codeToTokens(code, {
        lang,
        themes: {
          dark: props.darkTheme ?? "poimandres",
          light: props.lightTheme ?? "vitesse-light",
        },
      })

      // replace font-style prop in tokens into fontStyle
      resultDark.tokens = resultDark.tokens.map(line => {
        return line.map(token => {
          if (token.htmlStyle && typeof token.htmlStyle === "object") {
            token.htmlStyle = {
              ...token.htmlStyle,
              fontStyle: token.htmlStyle["font-style"],
            }
            delete token.htmlStyle["font-style"]
          }
          return token
        })
      })

      setTokensDark(resultDark.tokens)
    })()
  }, [code, lang, props.darkTheme, props.lightTheme])

  return (
    <pre className={props.className}>
      <code className="[&_span]:dark:!text-[var(--shiki-dark)] [&_span]:transition-all">
        {highlightedCodeDark.length ? highlightedCodeDark : <span className="opacity-0">{code}</span>}
      </code>
    </pre>
  )
}