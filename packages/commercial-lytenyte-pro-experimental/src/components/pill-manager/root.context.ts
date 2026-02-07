import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { PillItemSpec, PillRowSpec } from "./types";

export type PillRootContext = {
  readonly rows: PillRowSpec[];
  readonly orientation: "horizontal" | "vertical";

  readonly onPillRowChange: (params: {
    readonly changed: PillRowSpec[];
    readonly full: PillRowSpec[];
  }) => void;

  readonly onPillItemActiveChange: (params: {
    readonly index: number;
    readonly item: PillItemSpec;
    readonly row: PillRowSpec;
  }) => void;

  readonly onPillItemThrown?: (params: {
    readonly index: number;
    readonly item: PillItemSpec;
    readonly row: PillRowSpec;
  }) => void;

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
