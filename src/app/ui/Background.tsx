"use client"

import { useEffect } from "react"

export function RootBackground(
  props: {
    color: string,
    children?: React.ReactNode
  }
) {
  useEffect(() => {
    document.documentElement.style.backgroundColor = props.color
    document.body.style.backgroundColor = props.color
  }, [props.color])

  return null
}

export function useBackground(color: string) {
  useEffect(() => {
    document.documentElement.style.backgroundColor = color
    document.body.style.backgroundColor = color
  }, [color])
}