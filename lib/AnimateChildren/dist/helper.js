/* eslint-disable @typescript-eslint/no-explicit-any */
import { Children, cloneElement, isValidElement } from "react";
import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";
//─────────────────────────────────────────────────╮
// react-is                                        │
//                                                 │  
// Patch isFragment to return false if the type is not Fragment
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
//─────────────────────────────────────────────────╮
// FlatMap                                         │
//                                                 │   
// Flat forEach children implementation
// - Inspired by [https://www.npmjs.com/package/react-keyed-flatten-children]
// - Key prefix is needed because child of fragment does not add the fragment's key. Therefore it has to be added manually.
// - Doesn't handle async components properly. This is a weakness in React's part
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
    // Todo: merge ref too from incoming children with this ref.
    // Goofy type casting since ReactElement has a Prop generic and we are just adding on the end of it
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
