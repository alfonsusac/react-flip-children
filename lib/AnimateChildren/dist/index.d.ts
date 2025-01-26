import { type ReactNode } from "react";
export declare function AnimateChildren({ children, ...props }: {
    children?: ReactNode;
    easing?: KeyframeAnimationOptions["easing"];
    duration?: number;
    normalizeKeys?: boolean;
    delayDeletion?: number;
    useAbsolutePositionOnDeletedElements?: boolean;
    stagger?: number;
    snapshotStrategy?: "getBoundingClientRect" | "offset";
}): ReactNode;
