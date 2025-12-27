import { createContext, useContext } from "react";
import type { Piece } from "../../../hooks/use-piece";

export interface RowsContainerContextType {
  readonly topHeight: number;
  readonly centerHeight: number;
  readonly bottomHeight: number;

  readonly startWidth: number;
  readonly endWidth: number;
  readonly centerWidth: number;

  readonly totalHeight: number;
  readonly totalWidth: number;

  readonly topCount: number;
  readonly centerCount: number;
  readonly bottomCount: number;
}

export const RowsContainerContext = createContext(null as unknown as Piece<RowsContainerContextType>);
export const useRowsContainerContext = () => useContext(RowsContainerContext);
