import { Children, cloneElement, isValidElement } from "react";
import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";
export function isFragment(child) {
    return _isFragment(child);
}
export function isPortal(child) {
    return _isPortal(child);
}
export function isStandardFlattenedReactElement(child) {
    return typeof child.props === "object" && child.key != null;
}
export function isPrimitive(node) {
    return node == null || typeof node !== 'object';
}
export function flatForEach(children, callback, keyPrefix = "") {
    Children
        .toArray(children)
        .forEach((child, index) => {
        if (isFragment(child))
            flatForEach(child.props.children, callback, keyPrefix + child.key);
        else if (!isValidElement(child))
            callback(child, index);
        else
            callback(cloneElement(child, { key: keyPrefix + (child.key) }), index);
    });
}
export function flatMap(children, mapFn) {
    const arr = [];
    flatForEach(children, (child, index) => arr.push(mapFn(child, index)));
    return arr;
}
export function clone(element, props) {
    return cloneElement(element, props);
}
export function cloneWithMergedRef(element, ref, props) {
    return cloneElement(element, { ref, ...props });
}
export function cloneWithStyle(element, style) {
    return cloneElement(element, { style });
}
export function filterNodeByKey(node, key) {
    return node.filter(n => isValidElement(n) ? n.key !== key : true);
}
export function createProp(init) {
    return {};
}
