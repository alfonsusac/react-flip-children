# React Flip Children Documentation

## Overview

**React Flip Children** is a React component that aims to provide a simple way to animate changes in child props, allowing for smooth transitions between states while keeping the Developer Experience (DX) in mind. 

This package leverages React's lifecycle hooks, the FLIP technique, the Web Animation API, and CSS transitions to provide a seamless and customizable animation experience.

### Installation

Install the package via your package manager of choice:

```bash
npm install react-flip-children
```

### Features

React Flip Children was inspired by [Josh Comeau's React Flip Move](https://github.com/joshwcomeau/react-flip-move) and offers:

- Automatic detection of child additions, deletions, and movements.
- Reorder animation using Web Animation API that is performant and smooth.
- Full support for customizable entry/exit animations entirely using custom `data-` attributes.
- Ability to provide continuous animations for children that are in the middle of animating.
- Support for custom animation durations and easing.

### Usage

The usage of React Flip Children is simple. Simply wrap the children you want to animate in the `AnimateChildren` component and get reorder animation for free.

```javascript
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
```

### Enter/Leave Animations

React Flip Children allows you to provide custom animations for children entering and leaving the DOM. This is done by adding a CSS class that reads the `data-` attribute provided by the component.

The `data-adding` attribute is added when a child enters the DOM, and `data-removing` is added when a child is removed. You can then target these attributes with CSS for custom animations.

**Tailwind Example:**

```html
<div className="
  data-[adding]:opacity-0
  opacity-100
  data-[deleting]:opacity-0
" />
```

**CSS Example:**

```css
card {
  opacity: 1;
}
card[data-adding], card[data-deleting] {
  opacity: 0;
}
```

### Animatable Children

React Flip Children requires injecting refs into child elements to enable animations. Therefore, React elements passed to `<AnimateChildren>` must have refs forwarded to actual HTML elements.

**Examples of animatable elements:**

```tsx
<div>Hello World</div>

// React >19 
function Card(props: ComponentProps<"div">) {
  return <div {...props} />
}

// React <19
const Card = forwardRef((props, ref) => {
  return <div ref={ref} {...props} />
})
```

### Demo

- [Simple Demo](https://react-flip-children.alfon.dev/)
- [Playground](https://react-flip-children.alfon.dev/test)
- [Stress Test](https://react-flip-children.alfon.dev/test-stress)

### Compatibility

- React Flip Children is compatible with all modern browsers, including Internet Explorer 11.

- The library is bundled to the ESNext module format.



### Gotchas

- CSS Transitions are unable to be persisted across re-renders. If a child is in the middle of a transition and the parent re-renders, there is a chance the animation will be interrupted.
- Async components (React 18+) do not pass keys to their actual React elements, causing potential issues with React Flip Children. Workaround: wrap async components in a `<div>`.
- React Flip Children uses the `translate` CSS property for child reordering. If the parent component is set to `overflow: auto`, it may cause scrolling issues. It is recommended to set the parent to `overflow: hidden` or `overflow:visible` to avoid this issue.
- Overriding the `translate` property in child components may not work as expected due to the use of WAAPI.
- While it’s not necessary to provide a key to children of the `<AnimateChildren>` component (it will auto-generate keys), it is recommended to provide keys to avoid unwanted behavior.
- Proper animations require user-defined CSS for transitions.

### Known Issues

- Using both async components and `useSearchParams` from Next.js can cause hanging.

### Contributions

Contributors are welcome! Please discuss new features with me ahead of time and submit PRs for bug fixes.

### License

This package is licensed under the MIT License.

### Acknowledgements

Special thanks to friends and family for their guidance and support during the development of this project.

If you find any issues or have feature requests, please open an issue on [GitHub](https://github.com/alfonsusac/react-flip-array).

---

## API Reference

The `<AnimateChildren />` component is configured via the following props:

### `children`
```tsx
children?: ReactNode
```

The children to animate. This can be any valid `ReactNode`, but only valid children will be animated. Others may be rendered but not animated, or omitted entirely.

**Omitted Nodes:**

- `null`
- `undefined`
- `boolean` values

**Rendered but Not Animated:**

- `string`
- `number`
- `bigint`
- `ReactPortal`
- Invalid Elements

**Animatable Elements:**

Only `ReactElement` that can receive a ref and have specific methods and properties will be animated. Required ref properties are:
- `animate`
- `getBoundingClientRect`
- `getAnimations`
- `removeAttribute`
- `parentElement`

### `duration`
```tsx
duration?: number = 500
```

The duration of the moving animation in milliseconds.

### `easing`
```tsx
easing?: string = "ease-in-out"
```

The easing of the moving animation.
