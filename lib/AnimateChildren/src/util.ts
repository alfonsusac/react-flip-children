import { version, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { isFragment as _isFragment, isPortal as _isPortal } from "react-is";

type Pretty<T> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;

export function isReact19() {
  return version.startsWith("19")
}

export type Expect<T extends true> = T;
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
