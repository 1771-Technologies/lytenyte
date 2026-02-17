import { createContext, useContext } from "react";
import type { PillRowSpec } from "./types";

export interface PillRowContext {
  readonly expanded: boolean;
  readonly expandToggle: (s?: boolean) => void;
  readonly row: PillRowSpec;
}

const context = createContext({} as PillRowContext);

export const PillRowProvider = context.Provider;
export const usePillRow = () => useContext(context);
