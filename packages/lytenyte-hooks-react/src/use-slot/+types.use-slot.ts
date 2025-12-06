import type { ReactElement, Ref } from "react";

export type AnyProps = Record<string, any>;
export type AnyRef = Ref<any>;

export type SlotComponent<T = any> = ReactElement | ((state: T) => ReactElement);
