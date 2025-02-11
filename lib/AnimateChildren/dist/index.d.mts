import { ReactNode } from 'react';

declare function AnimateChildren({ children, ...props }: {
    children?: ReactNode;
    easing?: KeyframeAnimationOptions["easing"];
    duration?: number;
    normalizeKeys?: boolean;
    delayDeletion?: number;
    useAbsolutePositionOnDelete?: boolean;
    stagger?: number;
    strategy?: "interrupt" | "continuous" | "reset";
    disableAnimationReconciliation?: boolean;
    disableScaleAnimation?: boolean;
    disableParentAnimation?: boolean;
}): ReactNode;

export { AnimateChildren };
