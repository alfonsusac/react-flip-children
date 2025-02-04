import type { ReactElement, ReactNode, ReactPortal } from "react";
import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";

type Pretty<T> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;

export function isFragment(child: ReactNode): child is ReactElement<{ children?: ReactNode }> {
  return _isFragment(child)
}
export function isPortal(child: ReactNode): child is ReactPortal {
  return _isPortal(child)
}