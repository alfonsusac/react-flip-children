"use client";

// src/index.tsx
import { createRef, isValidElement as isValidElement2, useEffect, useLayoutEffect, useRef, useState } from "react";

// src/helper.tsx
import { Children, cloneElement, isValidElement } from "react";
import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";
function isFragment(child) {
  return _isFragment(child);
}
function isPortal(child) {
  return _isPortal(child);
}
function flatForEach(children, callback, keyPrefix = "") {
  Children.toArray(children).forEach((child, index) => {
    if (isFragment(child))
      flatForEach(
        child.props.children,
        callback,
        keyPrefix + child.key
      );
    else if (!isValidElement(child))
      callback(child, index);
    else
      callback(cloneElement(child, { key: keyPrefix + child.key }), index);
  });
}
function flatMap(children, mapFn) {
  const arr = [];
  flatForEach(children, (child, index) => arr.push(mapFn(child, index)));
  return arr;
}
function clone(element, props) {
  return cloneElement(element, props);
}
function cloneWithMergedRef(element, ref, props) {
  return cloneElement(element, { ref, ...props });
}
function filterNodeByKey(node, key) {
  return node.filter((n) => isValidElement(n) ? n.key !== key : true);
}
function createProp(init) {
  return {};
}

// src/index.tsx
function AnimateChildren({ children }) {
  const [rendered, setRendered] = useState([]);
  const data = useRefMap(() => ({ ref: createRef() }));
  const fn = useRefObject({
    saveChildRectAndAnimation: (entry) => {
      const node = entry.ref.current;
      if (!node) return;
      entry.rect = node.getBoundingClientRect();
      entry.cssAnimationTimes = node.getAnimations().filter(isCSSAnimation).map((a) => a.currentTime);
    }
  });
  const parent = useParent();
  useEffect(() => {
    const keys = /* @__PURE__ */ new Set();
    const newRender = flatMap(
      children,
      (child) => {
        if (!isValidElement2(child) || isPortal(child)) return child;
        keys.add(child.key);
        const { entry, inPrev } = data.getOrAdd(child.key);
        entry.ref.current?.removeAttribute("data-deleting");
        clearTimeout(entry.timeout);
        delete entry.timeout;
        const modifiedProp = createProp();
        if (inPrev) modifiedProp["data-adding"] = "";
        return cloneWithMergedRef(child, entry.ref, modifiedProp);
      }
    );
    rendered.forEach(
      (child, index) => {
        if (!isValidRenderedChild(child)) return;
        const entry = data.get(child.key);
        if (!entry?.ref.current) return;
        const node = entry.ref.current;
        parent.node ??= node.parentElement ?? parent.node;
        fn.saveChildRectAndAnimation(entry);
        if (keys.has(child.key)) return;
        newRender.splice(index, 0, clone(child, { "data-deleting": "" }));
        if (entry.timeout) return;
        entry.timeout = setTimeout(() => {
          if (!entry.timeout) return;
          data.forEach(fn.saveChildRectAndAnimation);
          parent.saveRect();
          setRendered((prev) => filterNodeByKey(prev, child.key));
          data.delete(child.key);
        }, 1e3);
      }
    );
    setRendered(newRender);
    parent.saveRect();
  }, [children]);
  useLayoutEffect(() => {
    const animationQueue = new AnimationQueue();
    rendered.forEach(
      (child) => {
        if (!isValidRenderedChild(child)) return;
        const entry = data.get(child.key);
        if (!entry?.ref.current) return;
        const node = entry.ref.current;
        node.getAnimations().filter(isCSSAnimation).forEach((animation, index) => animation.currentTime = entry.cssAnimationTimes?.[index] ?? 0);
        const prev = entry.rect;
        if (!prev) return;
        const curr = node.getBoundingClientRect();
        const deltaY = prev.y - curr.y;
        const deltaX = prev.x - curr.x;
        if (!deltaY && !deltaX) return;
        animationQueue.add({
          node,
          keyframes: [
            { translate: `${deltaX}px ${deltaY}px` },
            { translate: `0px 0px` }
          ],
          options: {
            duration: 500,
            easing: "ease-out",
            fill: "both",
            composite: "add"
          },
          cancelOnFinish: true
        });
      }
    );
    const parentAnimation = parent.queueAnimation();
    if (parentAnimation) animationQueue.add(parentAnimation);
    requestAnimationFrame(() => {
      animationQueue.animate();
      data.forEach((entry) => entry.ref.current?.removeAttribute("data-adding"));
    });
  }, [rendered]);
  return rendered.length ? rendered : children;
}
function useRefMap(defaultValues) {
  const ref = useRef(/* @__PURE__ */ new Map());
  return {
    getOrAdd(key) {
      const existing = ref.current.get(key);
      if (existing) return { entry: existing, inPrev: true };
      const newRef = defaultValues ? defaultValues() : createRef();
      ref.current.set(key, newRef);
      return { entry: newRef, inPrev: false };
    },
    get(key) {
      return ref.current.get(key);
    },
    forEach: (...args) => ref.current.forEach(...args),
    delete: (key) => ref.current.delete(key),
    entry: ref.current
  };
}
function useParent() {
  const parent = useRefObject({
    rect: void 0,
    node: void 0,
    saveNode(node) {
      parent.node = node ?? parent.node;
    },
    saveRect() {
      if (!parent.node) return;
      parent.rect = parent.node.getBoundingClientRect();
    },
    queueAnimation() {
      if (!parent.rect || !parent.node) return;
      const node = parent.node;
      const prev = parent.rect;
      const curr = node.getBoundingClientRect();
      const delta = {
        height: prev.height - curr.height,
        width: prev.width - curr.width
      };
      if (delta.height === 0 && delta.width === 0) return;
      return {
        node,
        keyframes: [
          { marginBlockEnd: `${delta.height}px`, marginInlineEnd: `${delta.width}px` },
          { marginBlockEnd: `0px`, marginInlineEnd: `0px` }
        ],
        options: {
          duration: 500,
          easing: "ease-out",
          composite: "add"
        },
        cancelOnFinish: true
      };
    }
  });
  return parent;
}
function useRefObject(defaultObj) {
  const ref = useRef(defaultObj ?? {});
  return ref.current;
}
function isValidRenderedChild(child) {
  return isValidElement2(child) && child.key !== null && !isPortal(child);
}
function isCSSAnimation(animation) {
  return animation instanceof CSSAnimation;
}
var AnimationQueue = class {
  queue = [];
  add(animation) {
    this.queue.push(animation);
  }
  animate() {
    this.queue.forEach(({ node, keyframes, options, cancelOnFinish }) => {
      const anim = node.animate(keyframes, options);
      if (cancelOnFinish) {
        anim.onfinish = () => anim.cancel();
      }
    });
  }
};
export {
  AnimateChildren
};
