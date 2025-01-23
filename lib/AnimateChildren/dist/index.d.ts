import { type ReactNode } from "react";
export declare function AnimateChildren({ children, ...props }: {
    children?: ReactNode;
    normalizeKeys?: boolean;
    delayDeletion?: number;
    useAbsolutePositionOnDeletedElements?: boolean;
}): ReactNode;
