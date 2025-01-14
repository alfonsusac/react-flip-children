import { useEffect, useState, type ReactNode } from "react";

export function ViewTransition(
  props: {
    children: ReactNode;
    enabled: boolean;
  } & Parameters<typeof ViewTransitionCore>[0]
) {
  return props.enabled ? <ViewTransitionCore {...props} /> : <>{props.children}</>
}

function ViewTransitionCore(
  props: {
    children: ReactNode;
    duration?: number;
    easing?: CSSStyleDeclaration["animationTimingFunction"];
  }
) {
  const [rendered, setRendered] = useState(props.children);

  useEffect(() => {
    console.log("Use Effect")
    const vt = document.startViewTransition(() => {
      setRendered(props.children);
    })
  }, [props.children])

  return <>
    <style dangerouslySetInnerHTML={{
      __html: `
::view-transition-group(*) {
  animation-duration: ${ props.duration ?? 500 }ms;
  animation-timing-function: ${ props.easing ?? "ease-in-out" };
}
      `}} />
    {rendered}
  </>
}