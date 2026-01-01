import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { PillManager } from "./root";
import type { PillRowSpec } from "./types";

export type PillRootContext = Required<Omit<PillManager.Props, "children">> & {
  readonly cloned: null | PillRowSpec[];
  readonly setCloned: Dispatch<SetStateAction<null | PillRowSpec[]>>;
};

const context = createContext({} as PillRootContext);

export const PillRootProvider = context.Provider;
export const usePillRoot = () => useContext(context);
