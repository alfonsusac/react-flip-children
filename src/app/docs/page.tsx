/* eslint-disable @next/next/no-html-link-for-pages */
import { cn } from "lazy-cn"
import { Commissioner, Inter, Lato, Lexend, Source_Sans_3 } from "next/font/google"
import { CodeBlock } from "./ui/code"
import { H3, H4 } from "./ui/document"
import type { SVGProps } from "react"
import { Sidebar } from "./ui/Sidebar"
import Link from "next/link"

const title = Inter({
  variable: '--font-title',
})


const sans = Inter({
  variable: '--font-body',
})

export default function DocsPage() {
  return (
    <article className={cn(
      `bg-[#151519] min-h-screen p-4 docs-article`,
      `font-[family-name:_var(--font-body)]`,

      `${ title.variable }`,
      `${ sans.variable }`,

      `text-[#99a]`,

      `pt-20`,

      "[&_h2]:!mt-28 [&_h2]:!-mb-4",
      `[&_h2]:!text-[#282838]`,
      `[&_h2]:!font-bold`,
      `[&_h2]:tracking-tighter`,
      "[&_h2]:!text-5xl",

      `[&_h3]:text-[#dde]`,
      `[&_h3]:font-[family-name:var(--font-title)]`,
      `[&_h3]:text-2xl`,
      `[&_h3]:my-4`,
      // `[&_h3]:mt-12`,
      `[&_h3]:font-semibold`,
      `[&_h3]:tracking-tight`,
      `[&_h3]:pt-16`,
      // `[&_h3]:-mt-4`,
      `[&_h3]:block`,


      `[&_h4]:text-[#cce]`,
      `[&_h4]:font-[family-name:var(--font-title)]`,
      `[&_h4]:text-xl`,
      `[&_h4]:my-4`,
      `[&_h4]:mt-12`,
      `[&_h4]:font-semibold`,
      `[&_h4]:tracking-tight`,

      `[&_h5]:text-[#aab]`,
      `[&_h5]:font-[family-name:var(--font-title)]`,
      `[&_h5]:text-sm`,
      `[&_h5]:my-2`,
      `[&_h5]:mt-6`,
      `[&_h5]:font-bold`,
      // `[&_h5]:tracking-tight`,

      `[&_p]:my-2`,
      `[&_p+p]:my-4`,
      `[&_p]:leading-loose`,
      `[&_p]:font-normal`,
      `[&_p]:text-[0.95rem]`,

      `[&_li]:my-3`,
      `[&_li]:leading-loose`,
      `[&_li]:font-normal`,
      `[&_li]:text-[0.95rem]`,
      `[&_li]:list-disc`,
      `[&_li]:pl-1`,
      `[&_li]:ml-6`,

      `[&_pre]:bg-[#111]`,
      `[&_pre]:text-sm`,
      `[&_pre]:p-3`,
      `[&_pre]:px-4`,
      `[&_pre]:rounded-md`,

      `[&_code]:bg-[#223]`,
      `[&_code]:text-[0.8em]`,
      `[&_code]:p-0.5`,
      `[&_code]:px-1.5`,
      `[&_code]:rounded-md`,

      `[&_pre>code]:bg-transparent`,
      `[&_pre>code]:p-0`,
      `[&_pre>code]:text-sm`,

      `[&_a]:underline`,
      `[&_a]:text-[#bbc]`,

      // `flex flex-row`,
      // `items-stretch`,
      // `justify-center`,
      // `gap-2`,

      `relative`,
    )}>

      <div className="flex mx-auto max-w-[30rem]">


        <Sidebar />

        <div id="content" className="relative !w-full max-w-[30rem] shrink-0">

          <header className={cn(
            `text-[#445]`,
            `[&_a]:text-[#445]`,
            `hover:[&_a]:text-[#ccd]`,
            `[&_a]:transition-colors`,
            `[&_a]:cursor-pointer`,
          )}>
            <div className="flex gap-3 text-2xl">
              <a target="_blank" href="https://github.com/alfonsusac/react-flip-array">
                <CibGithub />
              </a>
              <a target="_blank" href="">
                <CibNpm />
              </a>
              <a target="_blank" href="">
                <Fa6BrandsXTwitter />
              </a>
            </div>
            <h1 className={cn(
              `font-[family-name:var(--font-title)]`,
              `text-5xl`,
              `tracking-tighter`,
              `leading-none`,
              `font-bold`,
              `mt-4`,
            )}>
              React Flip Children<br />Documentation
            </h1>
            <p className={cn(
              `!font-medium`,
            )}>
              v0.0.5
            </p>

            <p className={cn(
              `!text-2xl`,
              `!font-semibold`,
              `!tracking-tight`,
              `!m-0`,
            )}>
              by Alfonsus Ardani
            </p>

            <div className="pt-64" />

            <p className={cn(
              `!text-2xl`,
              `!font-semibold`,
              `!tracking-tight`,
              `!m-0`,
            )}>
              The documentation for React Flip Children
            </p>

            <p className={cn(
              `!m-0`,
              `!text-lg`,
              `!font-semibold`,
              `!tracking-tight`,
            )}>
              Last updated: {new Date().toISOString().split('T')[0]}
            </p>
          </header>




          <h2 id="readme">
            1. Read Me
          </h2>


          <H3 id="overview">Overview</H3>
          <p>
            React Flip Children is a React component that aims to provide a simple way to animate change in children props allowing for smooth transitions between states while also keeping the Developer Experience in mind.
          </p>
          <p>
            The package leverages React&apos;s lifecycle hooks, the FLIP technique, WebAnimation API, and CSS transitions to provide a seamless and customizable animation experience.
          </p>
          <p>
            Install the package via your package manager of choice.
          </p>
          <CodeBlock code={`
npm install react-flip-children
        `} />



          <H3 id="features">Features</H3>
          <p>React Flip Children was inspired by Josh Comeau&apos;s awesome <a href="https://github.com/joshwcomeau/react-flip-move" target="_blank">React Flip Move</a> and offers:</p>
          <ul>
            <li>
              Automatic detection of child additions, deletions, and movements.
            </li>
            <li>
              Reorder animation using Web Animation API that is performant and smooth.
            </li>
            <li>
              Full support for customizable entry/exit animations entirely using custom data- attributes.
            </li>
            <li>
              Ability to provide continuous animations for children that are in the middle of animating
            </li>
            <li>
              Support for custom animation durations and easing.
            </li>
          </ul>



          <H3 id="usage">Usage</H3>
          <p>
            The usage of React Flip Children is pretty simple. Simply wrap the children you want to animate in the Flip component and get reorder animation for free.
          </p>
          <p>
            Here is the basic example:
          </p>
          <CodeBlock code={`
import React, { useState } from 'react';
import { AnimateChildren } from 'animate-children';

export default function App() {
  const [items, setItems] = useState([1, 2, 3]);

  return (
    <AnimateChildren>
      {items.map(item => (
        <div key={item}>
          Item {item}
        </div>
      ))}
    </AnimateChildren>
  );
}
          `} />



          <H3 id="enter-leave-animation">Enter/Leave Animations</H3>
          <p>
            React Flip Children allows you to provide custom animations for children entering and leaving the DOM. This is done by adding a CSS class that reads the data- attribute provided by the component.
          </p>
          <p>
            The <code>data-adding</code> attribute is added to the child when it is added to the DOM and <code>data-removing</code> is added when the child is removed from the DOM. Allowing you to provide CSS rules targeting this attribute for custom entry animations.
          </p>
          <p>
            Here is an example in tailwind of how you can provide custom animations for entering and leaving children:
          </p>
          <CodeBlock code={`
<div className="
  data-[adding]:opacity-0
  opacity-100
  data-[deleting]:opacity-0
" />
          `} />
          <p>
            Here is an example in CSS:
          </p>
          <CodeBlock css code={`
card {
  opacity: 1;
}
card[data-adding], card[data-deleting] {
  opacity: 0;
}
          `} />



          <H3 id="animatable-children">Animatable Children</H3>
          <p>
            React Flip Children requires injecting refs into child elements to enable animations. Therefore, React elements passed to <code>{'<AnimateChildren>'}</code> must have refs forwarded to actual HTML elements.:
          </p>

          <p>
            Here are examples of animatable elements:
          </p>
          <CodeBlock code={`
<div>Hello World</div>

// React >19 
function Card(props: ComponentProps<"div">) {
  return <div {...props} />
}

// React <19
const Card = forwardRef((props, ref) => {
  return <div ref={ref} {...props} />
})
`} />





          <H3 id="demo">Demo</H3>
          <ul>
            <li>
              <Link href="/">Simple Demo</Link>
            </li>
            <li>
              <Link href="/test">Playground</Link>
            </li>
            <li>
              <Link href="/test-stress">Stress Test</Link>
            </li>
          </ul>



          <H3 id="compatibility">Compatibility</H3>
          <p>
            React Flip Children is compatible with all modern browsers and IE11.
          </p>



          <H3 id="gotchas">Gotchas</H3>
          <ul>
            <li>
              CSS Transitions are unable to be persisted across re-renders. This means that if you have a child that is animating and you re-render the parent, there is a likely chance that the animation will be interrupted.
            </li>
            <li>
              Async components (React 18+) do not pass keys to their actuall react elements. This can cause unwanted behavior when using React Flip Children. To work around this limitation, you can wrap each async component with in a <code>{'<div>'}</code>
            </li>
            <li>
              React Flip Children uses the <code>translate</code> CSS property to animate rearrangement of the children. This means that the parent component will have scrolling issues if it is set to <code>overflow: auto</code>. It is recommended to wrap the parent component in a <code>{'<div>'}</code> with <code>overflow: hidden</code> or to avoid this issue.
            </li>
            <li>
              React Flip Children also uses WAAPI to animate the children. This means that overriding the <code>translate</code> property in the child component may not work properly.
            </li>
            <li>
              It is not necessary to provide a key to the children of the <code>{'<AnimateChildren>'}</code> component. The component will automatically generate keys for the children. However, it is still recommended to provide keys to the children to avoid any unwanted behavior.
            </li>
            <li>
              As shown above, proper animations require user-defined CSS for transitions.
            </li>
          </ul>



          <H3 id="known-issues">Known Issues</H3>
          <ul>
            <li>
              Using both async components and <code>useSearchParams</code> from Next.js has been known to cause hanging.
            </li>
          </ul>



          <H3 id="contributions">Contributions</H3>
          <p>
            Contributors welcome! Please discuss new features with me ahead of time, and submit PRs for bug fixes.
          </p>



          <H3 id="license">License</H3>
          <p>
            This package is licensed under the MIT License.
          </p>



          <H3 id="acknowledgements">Acknowledgements</H3>
          <p>
            Special thanks to friends and family for their guidance and support during the development of this project.<br />
          </p>
          <p>
            If you find any issues or have feature requests, please open an issue on GitHub.
          </p>










          <h2 id="api-reference">
            2. Integration
          </h2>

          <p className="pt-8">Integration with other UI libraries are work in progress!</p>










          <h2 id="api-reference">
            3. API Reference
          </h2>

          <H3 id="AnimateChildren">
            <code>{'<AnimateChildren/>'}</code>
          </H3>
          <p>
            <code>{'<AnimateChildren/>'}</code> is a React component, and is configured via the following props:
          </p>


          <H3 id="prop-children">
            <code>
              <span style={{ color: '#E4F0FB' }}>children</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> ReactNode</span>
            </code>
          </H3>
          <p>
            The children to animate. This can be any valid <code style={{ color: '#5DE4C7' }}>ReactNode</code>. However, only valid children will be animated. Others may be rendered but not animated, or omitted entirely.
          </p>

          <h5>Omitted Nodes</h5>
          <p>
            <code style={{ color: '#A6ACCD' }}>null</code>
            , <code style={{ color: '#A6ACCD' }}>undefined</code>
            , and <code style={{ color: '#A6ACCD' }} >boolean</code> values will be omitted.
          </p>

          <h5>Rendered but Not Animated</h5>
          <p>
            <code style={{ color: '#A6ACCD' }}>string</code>
            , <code style={{ color: '#A6ACCD' }}>number</code>
            , <code style={{ color: '#A6ACCD' }}>bigint</code>
            , <code style={{ color: '#A6ACCD' }}>ReactPortal</code>, and invalid Elements will be rendered but not animated.
          </p>

          <h5>Animatable Elements</h5>
          <p>
            Only <code style={{ color: '#A6ACCD' }}>ReactElement</code> that are able to receives a ref and have implemented specific methods and properties will be animated. The required ref properties are:
          </p>
          <ul>
            <li><code>animate</code></li>
            <li><code>getBoundingClientRect</code></li>
            <li><code>getAnimations</code></li>
            <li><code>removeAttribute</code></li>
            <li><code>parentElement</code></li>
          </ul>




          <H3 id="prop-duration">
            <code>
              <span style={{ color: '#E4F0FB' }}>duration</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> number</span>
              <span style={{ color: '#A6ACCD' }}> = 500</span>
            </code>
          </H3>
          <p>
            The duration of the moving animation in milliseconds.
          </p>





          <H3 id="prop-duration">
            <code>
              <span style={{ color: '#E4F0FB' }}>easing</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> string</span>
              <span style={{ color: '#A6ACCD' }}> = {'"ease-in-out"'}</span>
            </code>
          </H3>
          <p>
            The easing of the moving animation.
          </p>



        </div>

      </div>

    </article >
  )
}





function CibGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}><path fill="currentColor" d="M16 .396c-8.839 0-16 7.167-16 16c0 7.073 4.584 13.068 10.937 15.183c.803.151 1.093-.344 1.093-.772c0-.38-.009-1.385-.015-2.719c-4.453.964-5.391-2.151-5.391-2.151c-.729-1.844-1.781-2.339-1.781-2.339c-1.448-.989.115-.968.115-.968c1.604.109 2.448 1.645 2.448 1.645c1.427 2.448 3.744 1.74 4.661 1.328c.14-1.031.557-1.74 1.011-2.135c-3.552-.401-7.287-1.776-7.287-7.907c0-1.751.62-3.177 1.645-4.297c-.177-.401-.719-2.031.141-4.235c0 0 1.339-.427 4.4 1.641a15.4 15.4 0 0 1 4-.541c1.36.009 2.719.187 4 .541c3.043-2.068 4.381-1.641 4.381-1.641c.859 2.204.317 3.833.161 4.235c1.015 1.12 1.635 2.547 1.635 4.297c0 6.145-3.74 7.5-7.296 7.891c.556.479 1.077 1.464 1.077 2.959c0 2.14-.02 3.864-.02 4.385c0 .416.28.916 1.104.755c6.4-2.093 10.979-8.093 10.979-15.156c0-8.833-7.161-16-16-16z"></path></svg>
  )
}

export function CibNpm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}><path fill="currentColor" d="M0 9.781v10.667h8.885v1.771H16v-1.771h16V9.781zm8.885 8.88H7.114v-5.333H5.333v5.333H1.781v-7.104h7.104zm5.334 0v1.787h-3.552v-8.891h7.115v7.109h-3.563zm16.005 0h-1.776v-5.333h-1.781v5.333h-1.781v-5.333h-1.771v5.333h-3.563v-7.104h10.672zm-16.005-5.328H16v3.557h-1.781z"></path></svg>
  )
}


export function Fa6BrandsXTwitter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z"></path></svg>
  )
}