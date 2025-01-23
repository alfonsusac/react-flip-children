import { type CSSProperties, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, type Ref } from "react";
type Pretty<T> = T extends object ? {
    [K in keyof T]: T[K];
} : T;
export declare function isFragment(child: ReactNode): child is ReactElement<{
    children?: ReactNode;
}>;
export declare function isPortal(child: ReactNode): child is ReactPortal;
export declare function isStandardFlattenedReactElement(child: ReactElement): child is ReactElement<Record<string, any>> & {
    key: string;
};
type PrimitiveChild = string | number | bigint | boolean | null | undefined;
export declare function isPrimitive(node: ReactNode): node is PrimitiveChild;
export type AnimationTime = (null | CSSNumberish);
export declare function flatForEach(children: ReactNode, callback: (child: FlatMapReactNode, index: number) => void, keyPrefix?: string): void;
export declare function flatMap<T>(children: ReactNode, mapFn: (child: FlatMapReactNode, index: number) => T): T[];
export declare function flatForEachPreserveKey(children: ReactNode, callback: (child: FlatMapReactNode, index: number) => void): void;
export declare function flatMapPreserveKey<T>(children: ReactNode, mapFn: (child: FlatMapReactNode, index: number) => T): T[];
export type ReactElementFromFlatMap = ReactElement<Record<string, any>> & {
    key: string;
};
export type FlatMapReactNode = Exclude<ReactNode, null | undefined | boolean | Iterable<ReactNode> | ReactElement | Promise<ReactNode>> | string | Pretty<ReactElementFromFlatMap> | ReactPortal;
export type FlatMapReactNodePrimitive = string | number | bigint;
export type ReactElementWithStandardProps<P extends Record<string, any> = Record<string, any>, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> = ReactElement<P, T>;
export type ReactElementWithKey<P extends Record<string, any> = Record<string, any>, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> = Omit<ReactElementWithStandardProps<P, T>, 'key'> & {
    key: string;
};
export declare function clone<E extends ReactElementWithStandardProps>(element: E, props?: Record<string, any>): E;
export declare function cloneWithMergedRef<E extends ReactElementWithStandardProps, R extends Ref<unknown>>(element: E, ref: R, props?: Record<string, any>): Pretty<E & {
    props: E["props"] & {
        ref: R;
    };
}>;
export declare function cloneWithStyle<E extends ReactElementWithStandardProps>(element: E, style: CSSProperties): E;
export declare function filterNodeByKey<T>(node: T[], key: string): T[];
export declare function createProp<P extends Record<string, any>>(init?: P): P & Record<string, any>;
export {};
