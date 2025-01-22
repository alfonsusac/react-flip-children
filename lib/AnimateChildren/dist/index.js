"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  AnimateChildren: () => AnimateChildren
});
module.exports = __toCommonJS(index_exports);
var import_react2 = require("react");

// src/helper.tsx
var import_react = require("react");
var import_react_is = require("react-is");
function isFragment(child) {
  return (0, import_react_is.isFragment)(child);
}
function isPortal(child) {
  return (0, import_react_is.isPortal)(child);
}
function flatForEach(children, callback, keyPrefix = "") {
  import_react.Children.toArray(children).forEach((child, index) => {
    if (isFragment(child))
      flatForEach(
        child.props.children,
        callback,
        keyPrefix + child.key
      );
    else if (!(0, import_react.isValidElement)(child))
      callback(child, index);
    else
      callback((0, import_react.cloneElement)(child, { key: keyPrefix + child.key }), index);
  });
}
function flatMap(children, mapFn) {
  const arr = [];
  flatForEach(children, (child, index) => arr.push(mapFn(child, index)));
  return arr;
}
function clone(element, props) {
  return (0, import_react.cloneElement)(element, props);
}
function cloneWithMergedRef(element, ref, props) {
  return (0, import_react.cloneElement)(element, { ref, ...props });
}
function filterNodeByKey(node, key) {
  return node.filter((n) => (0, import_react.isValidElement)(n) ? n.key !== key : true);
}
function createProp(init) {
  return {};
}

// src/index.tsx
function AnimateChildren({ children }) {
  const [rendered, setRendered] = (0, import_react2.useState)([]);
  const data = useRefMap(() => ({ ref: (0, import_react2.createRef)() }));
  const fn = useRefObject({
    saveChildRectAndAnimation: (entry) => {
      const node = entry.ref.current;
      if (!node) return;
      entry.rect = node.getBoundingClientRect();
      entry.cssAnimationTimes = node.getAnimations().filter(isCSSAnimation).map((a) => a.currentTime);
    }
  });
  const parent = useParent();
  (0, import_react2.useEffect)(() => {
    const keys = /* @__PURE__ */ new Set();
    const newRender = flatMap(
      children,
      (child) => {
        if (!(0, import_react2.isValidElement)(child) || isPortal(child)) return child;
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
  (0, import_react2.useLayoutEffect)(() => {
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
  const ref = (0, import_react2.useRef)(/* @__PURE__ */ new Map());
  return {
    getOrAdd(key) {
      const existing = ref.current.get(key);
      if (existing) return { entry: existing, inPrev: true };
      const newRef = defaultValues ? defaultValues() : (0, import_react2.createRef)();
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
  const ref = (0, import_react2.useRef)(defaultObj ?? {});
  return ref.current;
}
function isValidRenderedChild(child) {
  return (0, import_react2.isValidElement)(child) && child.key !== null && !isPortal(child);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnimateChildren
});
