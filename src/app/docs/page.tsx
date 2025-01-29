/* eslint-disable @next/next/no-html-link-for-pages */
import { cn } from "lazy-cn"
import { Commissioner, Inter, Lato, Lexend, Source_Sans_3 } from "next/font/google"
import { CodeBlock } from "./ui/code"
import { H3, H4 } from "./ui/document"
import type { ComponentProps, SVGProps } from "react"
import { Sidebar } from "./ui/Sidebar"
import { Footer } from "../ui/Footer"
import { RootBackground } from "../ui/Background"



export default function DocsPage() {
  return (
    <article
      className={cn(
        `min-h-screen p-4 docs-article`,
        `font-[family-name:_var(--inter)]`,

        `bg-[#151519]`,

        `text-[#99a]`,

        `pt-20`,

        "[&_h2]:!pt-36 [&_h2]:!mb-0",
        `[&_h2]:!text-[#556]`,
        `[&_h2]:!font-bold`,
        `[&_h2]:tracking-tighter`,
        "[&_h2]:!text-5xl",

        `[&_h3]:text-[#dde]`,
        `[&_h3]:font-[family-name:var(--inter)]`,
        `[&_h3]:text-2xl`,
        `[&_h3]:mb-4`,
        `[&_h3]:font-semibold`,
        `[&_h3]:tracking-tight`,
        `[&_h3]:pt-16`,
        `[&_h3]:block`,


        `[&_h4]:text-[#cce]`,
        `[&_h4]:font-[family-name:var(--inter)]`,
        `[&_h4]:text-xl`,
        `[&_h4]:my-4`,
        `[&_h4]:mt-12`,
        `[&_h4]:font-semibold`,
        `[&_h4]:tracking-tight`,

        `[&_h5]:text-[#aab]`,
        `[&_h5]:font-[family-name:var(--inter)]`,
        `[&_h5]:text-sm`,
        `[&_h5]:my-2`,
        `[&_h5]:mt-6`,
        `[&_h5]:font-bold`,

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

        `[&_pre]:bg-[#151519]`,
        `[&_pre]:text-sm`,
        `[&_pre]:py-4`,
        `[&_pre]:px-4`,
        // `[&_pre]:-mx-4`,
        // `[@media(min-width:30rem)]:px-4`,
        `[&_pre]:-mx-4`,
        `[@media(min-width:30rem)]:[&_pre]:-mx-0`,
        `[&_pre]:rounded-md`,
        `[&_pre]:overflow-auto`,

        `[&_code]:bg-[#223]`,
        `[&_code]:text-[0.8em]`,
        `[&_code]:py-0.5`,
        `[&_code]:px-1.5`,
        `[&_code]:rounded-md`,
        `[&_code]:break-words`,

        `[&_pre>code]:bg-transparent`,
        `[&_pre>code]:p-0`,
        `[&_pre>code]:text-sm`,

        `[&_a]:underline`,
        `[&_a]:text-[#bbc]`,

        `relative`,
      )}>
      <RootBackground color="#151519" />

      <div className="flex mx-auto max-w-[30rem]">


        <Sidebar />

        <div id="content" className="relative !w-full max-w-[30rem] shrink-0">

          <header className={cn(
            `text-[#445]`,
            `[&_a]:!text-[#445]`,
            `hover:[&_a]:!text-[#ccd]`,
            `[&_a]:transition-colors`,
            `[&_a]:cursor-pointer`,
          )}>
            <div className="flex gap-3 text-2xl">
              <a target="_blank" href="https://github.com/alfonsusac/react-flip-array">
                <CibGithub />
              </a>
              <a target="_blank" href="https://www.npmjs.com/package/react-flip-children?activeTab=readme">
                <CibNpm />
              </a>
              <a target="_blank" href="https://x.com/alfonsusac">
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
              v0.1.3
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
            React Flip Children is a React component that aims to provide a simple way to animate change in children props allowing for smooth transitions between states while also keeping the Developer Experience (DX) in mind.
          </p>
          <p>
            The package leverages React&apos;s lifecycle hooks, the FLIP technique, Web Animation API, and CSS transitions to provide a seamless and customizable animation experience.
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
              Full support for customizable entry/exit animations entirely using custom <code>data-</code> attributes.
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
            The usage of React Flip Children is simple. Simply wrap the children you want to animate in the <code>AnimateChildren</code> component and get reorder animation for free.
          </p>

          <CodeBlock code={`
import React, { useState } from 'react';
import { AnimateChildren } from 'react-flip-children';

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
            React Flip Children allows you to provide custom animations for children entering and leaving the DOM. This is done by adding a CSS class that reads the <code>data-</code> attribute provided by the component.
          </p>
          <p>
            The <code>data-adding</code> attribute is added to the child when it is added to the DOM and <code>data-removing</code> is added when the child is removed from the DOM. You can then target these attributes with CSS for custom animations.
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
              <LinkButton href="/">Simple Demo {'->'}</LinkButton>
            </li>
            <li>
              <LinkButton href="/test">Playground  {'->'}</LinkButton>
            </li>
            <li>
              <LinkButton href="/test-stress">Stress Test  {'->'}</LinkButton>
            </li>
          </ul>



          <H3 id="compatibility">Compatibility</H3>
          <ul>
            <li>
              React Flip Children is compatible with all modern browsers, including Internet Explorer 11.
            </li>
            <li>
              The library is bundled to the ESNext module format.
            </li>
          </ul>




          <H3 id="gotchas">Gotchas</H3>
          <ul>
            <li>
              CSS Transitions are unable to be persisted across re-renders. If a child is in the middle of a transition and the parent re-renders, there is a chance that the animation will be interrupted.
            </li>
            <li>
              Async components (React 18+) do not pass keys to their actuall React elements, causing potential issues with React Flip Children. To work around this limitation, you can wrap each async component with in a <code>{'<div>'}</code>
            </li>
            <li>
              React Flip Children uses the <code>translate</code> CSS property for child reordering. If the parent component is set to <code>overflow: auto</code>, it may cause scrolling issues. It is recommended to set the parent to <code>overflow: hidden</code> or <code>overflow:visible</code> to avoid this issue.
            </li>
            <li>
              Overriding the <code>translate</code> property in child components may not work as expected due to the use of WAAPI.
            </li>
            <li>
              While it’s not necessary to provide a key to children of the <code>{`<AnimateChildren>`}</code> component (it will auto-generate keys), it is still recommended to provide keys to avoid unwanted behavior.
            </li>
            <li>
              Proper animations require user-defined CSS for transitions.
            </li>
          </ul>



          <H3 id="known-issues">Known Issues</H3>
          <ul>
            <li>
              Using both async components and <code>useSearchParams</code> from Next.js can cause hanging.
            </li>
          </ul>



          <H3 id="contributions">Contributions</H3>
          <p>
            Contributors are welcome! Please discuss new features with me ahead of time, and submit PRs for bug fixes.
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
            If you find any issues or have feature requests, please open an issue on <a href="https://github.com/alfonsusac/react-flip-array" target="_blank">GitHub</a>.
          </p>













          <h2 id="api-integration">
            2. Integration
          </h2>


          <H3 id="shadcn-ui">shadcn/ui</H3>
          <p>
            shadcn/ui is a popular React component library that provides a set of components and utilities for building user interfaces. React Flip Children can be integrated with shadcn/ui with minimal effort.
          </p>
          <LinkButton href="/shadcn-ui" className="inline-block">
            shadcn/ui Integration Guide {'->'}
          </LinkButton>



          <H3 id="heroui">HeroUI</H3>
          <p>
            HeroUI is a popular React component library that provides a set of components and utilities for building user interfaces. React Flip Children can be integrated with HeroUI with minimal effort.
          </p>
          <LinkButton href="/heroui" className="inline-block">
            heroUI Integration Guide {'->'}
          </LinkButton>











          <h2 id="api-reference">
            3. API Reference
          </h2>

          <H3 id="AnimateChildren" data-code-heading>
            <code>{'<AnimateChildren/>'}</code>
          </H3>
          <p>
            <code>{'<AnimateChildren/>'}</code> is a React component, and is configured via the following props:
          </p>


          <H3 id="prop-children" data-code-heading>
            <code>
              <span style={{ color: '#E4F0FB' }}>children</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> ReactNode</span>
            </code>
          </H3>
          <p>
            The children to animate. This can be any valid <code style={{ color: '#5DE4C7' }}>ReactNode</code>, but only valid children will be animated. Others may be rendered but not animated, or omitted entirely.
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




          <H3 id="prop-duration" data-code-heading>
            <code>
              <span style={{ color: '#E4F0FB' }}>duration</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> number</span>
              <span style={{ color: '#A6ACCD' }}> = 500</span>
            </code>
            {/* <div className="inline-block text-xs !font-bold text-[#778] p-1 px-2 bg-[#223] ml-2 rounded-md">WIP</div> */}
          </H3>
          <p>
            The duration of the moving animation in milliseconds.
          </p>





          <H3 id="prop-easing" data-code-heading>
            <code>
              <span style={{ color: '#E4F0FB' }}>easing</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> string</span>
              <span style={{ color: '#A6ACCD' }}> = {'"ease-in-out"'}</span>
            </code>
            {/* <div className="inline-block text-xs !font-bold text-[#778] p-1 px-2 bg-[#223] ml-2 rounded-md">WIP</div> */}
          </H3>
          <p>
            The easing of the moving animation.
          </p>



          <H3 id="prop-duration" data-code-heading>
            <code>
              <span style={{ color: '#E4F0FB' }}>normalizeKeys</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> boolean</span>
              <span style={{ color: '#A6ACCD' }}> = {'false'}</span>
            </code>
            {/* <div className="inline-block text-xs !font-bold text-[#778] p-1 px-2 bg-[#223] ml-2 rounded-md">WIP</div> */}
          </H3>
          <p>
            Whether or not to normalize keys. If set to <code>true</code>, the component will flatten the children array and check for uniquely defined keys. If set to <code>false</code> (default), the component allows for duplicate keys if its under different fragment.
          </p>
          <p>
            By default, this configuration is allowed:
          </p>
          <CodeBlock code={`
<AnimateChildren>
  {arr1.map((el,i) => <div key={i}>{el}</div>)}
  <>
    {arr1.map((el,i) => <div key={i}>{el}</div>)}
  </>
</AnimateChildren> // ✅ Legal, No errors
            `} />
          <p>
            If set to true, the above configuration will throw an error.
          </p>



          <H3 id="prop-delayDeletion" data-code-heading>
            <code>
              <span style={{ color: '#E4F0FB' }}>delayDeletion</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> number</span>
              <span style={{ color: '#A6ACCD' }}> = {'500'}</span>
            </code>

          </H3>
          <p>
            The delay before the deletion of the child. This is useful when you want to animate the child before it is removed from the DOM.
          </p>





          <H3 id="prop-useAbsolutePositionOnDeletedElements" data-code-heading>
            <code className="">
              <span style={{ color: '#E4F0FB' }}>useAbsolutePositionOnDeletedElements</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> boolean</span>
              <span style={{ color: '#A6ACCD' }}> = {'false'}</span>
            </code>

          </H3>
          <p>
            Whether or not to use absolute position on deleted elements. If set to <code>true</code>, the component will use absolute position to animate the deleted child.
          </p>
          <p>
            <b>Recommended:</b><br />
            Set to true if the width of the child is fixed.
          </p>


          <H3 id="prop-stagger" data-code-heading>
            <code>
              <span style={{ color: '#E4F0FB' }}>stagger</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> number</span>
            </code>

          </H3>
          <p>
            The stagger of the moving animation in milliseconds. The animation delay will be skipped if the animation is interrupted.
          </p>


          <H3 id="prop-snapshotStrategy" data-code-heading>
            <code>
              <span style={{ color: '#E4F0FB' }}>snapshotStrategy</span>
              <span style={{ color: '#ACD7FF' }}>?:</span>
              <span style={{ color: '#5DE4C7' }}> {'"getBoundingClientRect" | "offset"'}</span>
              <span style={{ color: '#A6ACCD' }}> = {'"offset"'}</span>
            </code>
          </H3>
          <p>
            The strategy to use when taking a snapshot of the child&apos;s position. The default is <code>offset</code>, which uses the <code>offsetLeft</code> and <code>offsetTop</code> property of the child. If set to <code>getBoundingClientRect</code>, the component will use the <code>getBoundingClientRect</code> method to take a snapshot of the child&apos;s position.
          </p>









          <LinkButton href="/docs#" className="inline-block mt-40">
            Back to top ↑
          </LinkButton>


          <Footer />
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

function CibNpm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}><path fill="currentColor" d="M0 9.781v10.667h8.885v1.771H16v-1.771h16V9.781zm8.885 8.88H7.114v-5.333H5.333v5.333H1.781v-7.104h7.104zm5.334 0v1.787h-3.552v-8.891h7.115v7.109h-3.563zm16.005 0h-1.776v-5.333h-1.781v5.333h-1.781v-5.333h-1.771v5.333h-3.563v-7.104h10.672zm-16.005-5.328H16v3.557h-1.781z"></path></svg>
  )
}


function Fa6BrandsXTwitter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z"></path></svg>
  )
}

function LinkButton(
  { className, ...props }: ComponentProps<"a">
) {
  return <a {...props} className={cn(
    `bg-[#181820] border border-[#445] p-2 px-3 leading-none rounded-lg`,
    `[@media(pointer:fine)]:hover:bg-[#223]`,
    `text-xs font-medium`,
    `text-zinc-400`,
    `!no-underline`,
    `shadow-[inset_0_-4px_2px_0_#0001]`,
    `active:shadow-[inset_0_-2px_2px_0_#0003]`,
    `active:translate-y-0.5`,
    `transition-all duration-100`,
    className
  )} />
}