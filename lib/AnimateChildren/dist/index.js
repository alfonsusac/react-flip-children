"use client";

// src/index.ts
import {
  createRef,
  isValidElement as isValidElement2,
  useEffect,
  useLayoutEffect,
  useRef as useRef2,
  useState
} from "react";

// src/helper.ts
import { cloneElement } from "react";
import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";
function isPortal(child) {
  return _isPortal(child);
}
function clone(element, props) {
  return cloneElement(element, props);
}

// src/useRefMap.ts
import { useRef } from "react";
function useRefMap(defaultValues) {
  const ref = useRef(/* @__PURE__ */ new Map());
  return {
    getOrAdd: (key) => {
      const existing = ref.current.get(key);
      if (existing) return [existing, false];
      const newEntry = defaultValues();
      ref.current.set(key, newEntry);
      return [newEntry, true];
    },
    get: (key) => ref.current.get(key),
    forEach: (...args) => ref.current.forEach(...args),
    delete: (key) => ref.current.delete(key),
    current: ref.current
  };
}

// src/flatMap.ts
import { Children, cloneElement as cloneElement2, isValidElement } from "react";
import { isFragment as _isFragment2 } from "react-is";
function flatForEach(children, callback, predecessorKey = "") {
  Children.toArray(children).forEach((child, index) => {
    if (isFragment(child)) {
      flatForEach(
        child.props.children,
        callback,
        predecessorKey + child.key
      );
    } else {
      const element = isValidElement(child) ? cloneElement2(child, { key: predecessorKey + child.key }) : child;
      callback(
        element,
        index
      );
    }
  });
}
function flatForEachPreserveKey(children, callback) {
  Children.forEach(children, (child, index) => {
    if (isFragment(child)) {
      flatForEachPreserveKey(
        child.props.children,
        callback
      );
    }
    callback(
      child,
      index
    );
  });
}
function flatMap(children, callback, strictlyUnique = false) {
  const arr = [];
  const flat = strictlyUnique ? flatForEachPreserveKey : flatForEach;
  flat(
    children,
    (child, index) => arr.push(callback(child, index))
  );
  return arr;
}
function isFragment(child) {
  return _isFragment2(child);
}

// src/ref.tsx
function mergeRef(...refs) {
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (ref == null) {
        return { cleanup: void 0, ref };
      } else if (typeof ref === "function") {
        return { cleanup: ref(node), ref };
      } else {
        console.log("this ref is object");
        ref.current = node;
        return { cleanup: void 0, ref };
      }
    });
    return () => {
      cleanups.forEach(({ cleanup, ref }) => {
        if (cleanup) {
          cleanup();
        } else if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          console.log("this ref is object (cleanup)");
          ref.current = null;
        }
      });
    };
  };
}

// src/index.ts
function AnimateChildren({ children, ...props }) {
  const opts = {
    easing: "ease-in-out",
    duration: 500,
    normalizeKeys: false,
    delayDeletion: 500,
    useAbsolutePositionOnDelete: false,
    stagger: 0,
    strategy: "continuous",
    disableAnimationReconciliation: false,
    disableScaleAnimation: false,
    disableParentAnimation: false,
    ...props
  };
  const [rendered, setRendered] = useState([]);
  const data = useRefMap(() => ({
    ref: createRef(),
    cssAnimationTimes: [],
    order: 0
    // This is to apply staggered animation by apply longer delay multipled by the count
    // Problem: delay is re-added when animations are stacked
    // Solution: check first if there are existing animation
  }));
  function saveChildRectAndAnimation(entry, reconcileAnimation) {
    const node = entry.ref.current;
    if (!node) return;
    if (opts.strategy === "interrupt" && parent.rect) {
      const rect = node.getBoundingClientRect();
      entry.rect = {
        x: rect.x - parent.rect.x,
        y: rect.y - parent.rect.y
      };
      entry.size = rect;
    } else {
      entry.rect = {
        x: node.offsetLeft,
        y: node.offsetTop
      };
      if (!opts.disableScaleAnimation) {
        entry.size = {
          width: node.offsetWidth,
          height: node.offsetHeight
        };
      }
    }
    if (opts.disableAnimationReconciliation || reconcileAnimation === false)
      return;
    entry.cssAnimationTimes = node.getAnimations().filter(isCSSAnimation).map((a) => a.currentTime);
  }
  const parent = useParent();
  useEffect(() => {
    const keys = /* @__PURE__ */ new Set();
    let keylessCount = 0;
    const newRender = flatMap(
      children,
      (child) => {
        if (!isValidElement2(child) || isPortal(child)) return child;
        const key = child.key ?? `____${keylessCount++}`;
        keys.add(key);
        const [entry, isNew] = data.getOrAdd(key);
        if (entry.deleting) {
          delete entry.ref.current?.dataset.deleting;
          delete entry.deleting;
        }
        if (isNew)
          entry.adding = true;
        const el = clone(child, {
          ref: mergeRef(
            child.props.ref,
            (node) => {
              entry.ref.current = node;
              if (isNew && node) node.dataset.adding = "";
              return () => {
                entry.ref.current = null;
              };
            }
          ),
          key,
          "data-adding": isNew ? "" : void 0
        });
        return el;
      },
      opts.normalizeKeys
    );
    let staggerElementCount = 0;
    let tempParent;
    const deletingKeys = [];
    rendered.forEach(
      (child, index) => {
        if (!isValidRenderedChild(child)) return;
        const entry = data.get(child.key);
        if (!entry?.ref.current) return;
        const node = entry.ref.current;
        tempParent ??= parent.saveNodeAndRect(node.parentElement);
        saveChildRectAndAnimation(entry);
        if (keys.has(child.key)) {
          entry.order = staggerElementCount++;
        }
        if (!opts.delayDeletion)
          return;
        if (keys.has(child.key)) {
          return;
        }
        const props2 = {};
        if (opts.useAbsolutePositionOnDelete) {
          props2.style = {
            position: "absolute",
            top: entry.rect?.y ?? node.offsetTop,
            left: entry.rect?.x ?? node.offsetLeft,
            width: entry.size?.width ?? node.offsetWidth,
            height: entry.size?.height ?? node.offsetHeight
          };
        }
        newRender.splice(index, 0, clone(child, props2));
        if (entry.deleting) return;
        deletingKeys.push(child.key);
        entry.tobedeleted = true;
      }
    );
    setRendered(newRender);
  }, [children]);
  useLayoutEffect(() => {
    const animationQueue = new AnimationQueue();
    if (!opts.disableParentAnimation) {
      const parentAnimation = parent.queueAnimation(opts);
      if (parentAnimation) animationQueue.add(parentAnimation);
    }
    const deletingKeys = [];
    rendered.forEach(
      (child) => {
        if (!isValidRenderedChild(child)) return;
        const entry = data.get(child.key);
        if (!entry?.ref.current) return;
        const node = entry.ref.current;
        if (entry.tobedeleted) {
          deletingKeys.push(child.key);
          node.dataset.deleting = "";
          delete entry.tobedeleted;
          entry.deleting = true;
          return;
        }
        let hasPrevAnimation = false;
        if (opts.stagger || !opts.disableAnimationReconciliation) {
          const animations = node.getAnimations();
          animations.filter((a) => {
            if (opts.strategy === "interrupt" && a.id.startsWith("__react-flip-children-move-animation")) {
              a.cancel();
              return false;
            }
            if (opts.stagger && a.id.startsWith("__react-flip-children-move-animation")) {
              const delay2 = Number(a.id.split("+delay=")[1]);
              const currentTime = Number(a.currentTime);
              if (delay2 > currentTime) {
                try {
                  a.currentTime = delay2;
                } catch (error) {
                }
              }
              hasPrevAnimation = true;
            }
            if (isCSSAnimation(a))
              return true;
          }).forEach(
            (a, i) => {
              try {
                a.currentTime = entry.cssAnimationTimes[i];
              } catch (error) {
              }
            }
          );
        }
        if (opts.duration === 0) return;
        let prevRect = entry.rect;
        let prevSize = entry.size;
        if (!prevRect && (opts.disableScaleAnimation || !prevSize)) return;
        let currRect;
        let currSize = void 0;
        if (opts.strategy === "interrupt" && parent.rect) {
          const rect = node.getBoundingClientRect();
          currRect = {
            x: rect.x - parent.rect.x,
            y: rect.y - parent.rect.y
          };
          currSize = {
            width: rect.width,
            height: rect.height
          };
        } else {
          currRect = {
            x: node.offsetLeft,
            y: node.offsetTop
          };
          if (!opts.disableScaleAnimation) {
            currSize = {
              width: node.offsetWidth,
              height: node.offsetHeight
            };
          }
        }
        prevRect ??= currRect;
        const deltaY = prevRect.y - currRect.y;
        const deltaX = prevRect.x - currRect.x;
        const positionChanged = !!deltaY || !!deltaX;
        const widthScale = currSize && prevSize ? prevSize.width / currSize.width : 1;
        const heightScale = currSize && prevSize ? prevSize.height / currSize.height : 1;
        const sizeChanged = opts.disableScaleAnimation ? false : widthScale !== 1 || heightScale !== 1;
        if (!positionChanged && !sizeChanged) return;
        const delay = !hasPrevAnimation ? entry.order * opts.stagger : 0;
        animationQueue.add({
          node,
          keyframes: [
            {
              ...positionChanged && { translate: `${deltaX}px ${deltaY}px` },
              ...sizeChanged && { scale: `${widthScale} ${heightScale}` }
            },
            {
              ...positionChanged && { translate: `0px 0px` },
              ...sizeChanged && { scale: `1 1` }
            }
          ],
          options: {
            duration: opts.duration,
            easing: opts.easing,
            delay,
            fill: "both",
            composite: opts.strategy === "reset" ? "replace" : "add",
            id: `__react-flip-children-move-animation+delay=${delay}`
          },
          onRegister: (animation) => {
            animation.onfinish = () => animation.cancel();
          }
        });
      }
    );
    requestAnimationFrame(() => {
      animationQueue.animate();
      data.forEach((entry) => {
        if (entry.deleting && entry.ref.current)
          entry.ref.current.dataset.deleting = "";
      });
      const keys = deletingKeys;
      requestAnimationFrame(() => {
        setTimeout(() => {
          data.forEach((entry) => {
            if (entry.ref.current)
              delete entry.ref.current.dataset.adding;
            if (entry.adding)
              delete entry.adding;
          });
        }, 0);
        keys.length && setTimeout(() => {
          data.forEach((e) => saveChildRectAndAnimation(e));
          parent.saveRect();
          keys.forEach((i) => {
            if (!data.get(i)?.deleting) return;
            setRendered((prev) => filterNodeByKey(prev, i));
            data.delete(i);
          });
        }, opts.delayDeletion);
      });
    });
  }, [rendered]);
  return rendered.length ? rendered : children;
}
function useParent() {
  const parent = useRefObject({
    rect: void 0,
    node: void 0,
    saveNodeAndRect(node) {
      parent.node = node ?? parent.node;
      parent.saveRect();
      return parent.node;
    },
    saveRect() {
      if (!parent.node) return;
      parent.rect = parent.node.getBoundingClientRect();
    },
    queueAnimation(opts) {
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
          duration: opts.duration,
          easing: opts.easing,
          fill: "both",
          composite: "add"
        },
        onRegister: (animation) => {
          animation.onfinish = () => animation.cancel();
        }
      };
    }
  });
  return parent;
}
function useRefObject(defaultObj) {
  const ref = useRef2(defaultObj ?? {});
  return ref.current;
}
function isValidRenderedChild(child) {
  return isValidElement2(child) && child.key !== null && !isPortal(child);
}
var isCSSAnimation = (a) => a instanceof CSSAnimation;
var filterNodeByKey = (node, key) => node.filter((n) => isValidElement2(n) ? n.key !== key : true);
var AnimationQueue = class {
  queue = [];
  add(animation) {
    this.queue.push(animation);
  }
  animate() {
    this.queue.forEach(({ node, keyframes, options, onRegister }) => {
      const anim = node.animate(keyframes, options);
      onRegister?.(anim);
    });
  }
};
export {
  AnimateChildren
};
