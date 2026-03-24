import type { CSSProperties, ReactElement } from "react";

export type SlotComponent<State = object> = ReactElement | ((state: State) => ReactElement);

export type ClassNameWithState<State = object> = string | ((state: State) => string | null | undefined);
export type StyleWithState<State = object> =
  | CSSProperties
  | ((state: State) => CSSProperties | null | undefined);
