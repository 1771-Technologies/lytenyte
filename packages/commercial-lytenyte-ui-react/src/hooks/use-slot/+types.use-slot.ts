import type { JSX, Ref } from "react";

export type AnyProps = Record<string, any>;
export type AnyRef = Ref<any>;

export type SlotComponent<T = any> = JSX.Element | ((state: T) => JSX.Element);
