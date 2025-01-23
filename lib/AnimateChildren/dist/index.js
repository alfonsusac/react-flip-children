"use client";
import { createRef, isValidElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flatMap, isPortal, cloneWithMergedRef, filterNodeByKey, createProp, clone, flatMapPreserveKey } from "./helper";
export function AnimateChildren({ children, ...props }) {
    const opts = {
        normalizeKeys: props.normalizeKeys ?? true,
        delayDeletion: props.delayDeletion ?? 500,
        useAbsolutePositionOnDeletedElements: props.useAbsolutePositionOnDeletedElements ?? true,
    };
    const [rendered, setRendered] = useState([]);
    const data = useRefMap(() => ({ ref: createRef() }));
    const fn = useRefObject({
        saveChildRectAndAnimation: (entry) => {
            const node = entry.ref.current;
            if (!node)
                return;
            entry.rect = {
                x: node.offsetLeft,
                y: node.offsetTop
            };
            entry.cssAnimationTimes = node.getAnimations().filter(isCSSAnimation).map(a => a.currentTime);
        },
    });
    const parent = useParent();
    useEffect(() => {
        const keys = new Set();
        const mapFn = opts.normalizeKeys
            ? flatMapPreserveKey
            : flatMap;
        let keylessCount = 0;
        const newRender = mapFn(children, child => {
            if (!isValidElement(child) || isPortal(child))
                return child;
            const key = child.key ?? `____${keylessCount++}`;
            keys.add(key);
            const { entry, inPrev } = data.getOrAdd(key);
            entry.ref.current?.removeAttribute("data-deleting");
            clearTimeout(entry.timeout);
            delete entry.timeout;
            const modifiedProp = createProp();
            modifiedProp['key'] = key;
            if (!inPrev)
                modifiedProp["data-adding"] = '';
            return cloneWithMergedRef(child, entry.ref, modifiedProp);
        });
        rendered.forEach((child, index) => {
            if (!isValidRenderedChild(child))
                return;
            const entry = data.get(child.key);
            if (!entry?.ref.current)
                return;
            const node = entry.ref.current;
            parent.node ??= node.parentElement ?? parent.node;
            fn.saveChildRectAndAnimation(entry);
            if (opts.delayDeletion === 0)
                return;
            if (keys.has(child.key))
                return;
            const props = createProp();
            props["data-deleting"] = "";
            if (opts.useAbsolutePositionOnDeletedElements) {
                props.style = {
                    position: 'absolute',
                    top: node.offsetTop,
                    left: node.offsetLeft,
                };
            }
            newRender.splice(index, 0, clone(child, props));
            if (entry.timeout)
                return;
            entry.timeout = setTimeout(() => {
                if (!entry.timeout)
                    return;
                data.forEach(fn.saveChildRectAndAnimation);
                parent.saveRect();
                setRendered(prev => filterNodeByKey(prev, child.key));
                data.delete(child.key);
            }, opts.delayDeletion);
        });
        setRendered(newRender);
        parent.saveRect();
    }, [children]);
    useLayoutEffect(() => {
        const animationQueue = new AnimationQueue();
        rendered.forEach(child => {
            if (!isValidRenderedChild(child))
                return;
            const entry = data.get(child.key);
            if (!entry?.ref.current)
                return;
            const node = entry.ref.current;
            node.getAnimations()
                .filter(isCSSAnimation)
                .forEach((animation, index) => animation.currentTime = entry.cssAnimationTimes?.[index] ?? 0);
            const prev = entry.rect;
            if (!prev)
                return;
            const curr = {
                x: node.offsetLeft,
                y: node.offsetTop
            };
            const deltaY = prev.y - curr.y;
            const deltaX = prev.x - curr.x;
            if (!deltaY && !deltaX)
                return;
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
                    composite: "add",
                },
                cancelOnFinish: true
            });
        });
        const parentAnimation = parent.queueAnimation();
        if (parentAnimation)
            animationQueue.add(parentAnimation);
        requestAnimationFrame(() => {
            animationQueue.animate();
            data.forEach(entry => entry.ref.current?.removeAttribute("data-adding"));
        });
    }, [rendered]);
    return rendered.length
        ? rendered
        : children;
}
function useRefMap(defaultValues) {
    const ref = useRef(new Map());
    return {
        getOrAdd(key) {
            const existing = ref.current.get(key);
            if (existing)
                return { entry: existing, inPrev: true };
            const newRef = defaultValues
                ? defaultValues()
                : createRef();
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
        rect: undefined,
        node: undefined,
        saveNode(node) {
            parent.node = node ?? parent.node;
        },
        saveRect() {
            if (!parent.node)
                return;
            parent.rect = parent.node.getBoundingClientRect();
        },
        queueAnimation() {
            if (!parent.rect || !parent.node)
                return;
            const node = parent.node;
            const prev = parent.rect;
            const curr = node.getBoundingClientRect();
            const delta = {
                height: prev.height - curr.height,
                width: prev.width - curr.width,
            };
            if (delta.height === 0 && delta.width === 0)
                return;
            return {
                node,
                keyframes: [
                    { marginBlockEnd: `${delta.height}px`, marginInlineEnd: `${delta.width}px` },
                    { marginBlockEnd: `0px`, marginInlineEnd: `0px` }
                ],
                options: {
                    duration: 500,
                    easing: "ease-out",
                    composite: "add",
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
    return isValidElement(child)
        && child.key !== null
        && !isPortal(child);
}
function isCSSAnimation(animation) {
    return animation instanceof CSSAnimation;
}
class AnimationQueue {
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
}
