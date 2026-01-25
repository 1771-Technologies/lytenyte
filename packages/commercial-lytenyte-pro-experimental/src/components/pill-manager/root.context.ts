import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { PillManager } from "./root";
import type { PillRowSpec } from "./types";

export type PillRootContext = Required<Omit<PillManager.Props, "children">> & {
  readonly cloned: null | PillRowSpec[];
  readonly setCloned: Dispatch<SetStateAction<null | PillRowSpec[]>>;

  readonly setDragState: Dispatch<
    SetStateAction<{
      readonly activeId: string;
      readonly activeRow: string;
      readonly activeType: string;
    } | null>
  >;
  readonly dragState: null | {
    readonly activeId: string;
    readonly activeRow: string;
    readonly activeType: string;
  };

  movedRef: RefObject<{ pillId: string; id: string } | null>;
  prevSwapId: RefObject<string | null>;
  prevRowId: RefObject<string | null>;
};

const context = createContext({} as PillRootContext);

export const PillRootProvider = context.Provider;
export const usePillRoot = () => useContext(context);
