import { createContext, useContext } from "react";
import type { DataRect } from "../types";
import type { Piece } from "../hooks/use-piece.js";

export interface LnInternalShare {
  readonly cellSelections: Piece<DataRect[]>;
  readonly hasCellSelection: boolean;
}

export const LnInternalShareProvider = createContext<LnInternalShare>(null as any);
export const useInternalShare = () => useContext(LnInternalShareProvider);
