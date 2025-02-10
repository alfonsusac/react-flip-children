import { ReactNode } from 'react';

declare function AnimateChildren({ children, ...props }: {
    /**
     * The children to animate. This can be any valid ReactNode,
     * but only valid children will be animated. Others may be rendered
     * but not animated, or omitted entirely.
     *
     * [See Docs](https://react-flip-children.alfon.dev/docs#props-children)
     */
    children?: ReactNode;
    /** The easing of the moving animation. */
    easing?: KeyframeAnimationOptions["easing"];
    /** The duration of the moving animation in milliseconds. */
    duration?: number;
    /**
     * Whether or not to normalize keys. If set to true, the component
     * will flatten the children array and check for uniquely defined keys.
     * If set to false (default), the component allows for duplicate keys
     * if its under different fragment.
     *
     * [See Docs](https://react-flip-children.alfon.dev/docs#props-normalizeKeys)
     */
    normalizeKeys?: boolean;
    /** The delay before the deletion of the child. This is useful when you want
     * to animate the child before it is removed from the DOM. */
    delayDeletion?: number;
    /** Whether or not to use absolute position on deleted elements. If set to true,
     * the component will use absolute position to animate the deleted child.
     *
     * **Recommended**: Set to true if the width of the child is fixed.*/
    useAbsolutePositionOnDelete?: boolean;
    /** The stagger of the moving animation in milliseconds. The animation delay will
     * be skipped if the animation is interrupted. */
    stagger?: number;
    /** The strategy to use when taking a snapshot of the child's position. The
     * default is `"continuous"`, which uses the `offsetLeft` and `offsetTop` property
     * of the child. If set to `"interrupt"`, the component will use the
     * `getBoundingClientRect` method to take a snapshot of the child's position. */
    strategy?: "interrupt" | "continuous" | "reset";
    /** Whether or not to disable animation reconciliation. If set to true, the
     * component will not reconcile CSS animations.
     *
     * **Recommended**: Set to false if animating a large number of children.*/
    disableAnimationReconciliation?: boolean;
    /** Whether or not to disable scale animation. If set to true, the component
     * will not scale the child during animating the reorder. */
    disableScaleAnimation?: boolean;
    /** Whether or not to disable parent animation. If set to true, the component
     *  will not animate the parent. */
    disableParentAnimation?: boolean;
}): ReactNode;

export { AnimateChildren };
