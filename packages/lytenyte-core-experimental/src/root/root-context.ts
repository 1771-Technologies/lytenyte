import type {
  ColumnAbstract,
  ColumnView,
  LayoutHeader,
  PositionUnion,
  RowSource,
  RowView,
  SpanLayout,
} from "@1771technologies/lytenyte-shared";
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Piece, PieceWritable } from "../hooks/use-piece";
import type { API, Props } from "../types/types-internal";
import type { Dimension } from "./hooks/use-viewport-dimensions";

export interface RootContextValue {
  readonly id: string;
  readonly source: RowSource;
  readonly rtl: boolean;
  readonly view: ColumnView;
  readonly api: API;

  readonly detailExpansions: Set<string>;
  readonly totalHeaderHeight: number;
  readonly dimensions: Dimension;
  readonly base: Omit<ColumnAbstract, "id">;

  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;

  readonly setDetailCache: Dispatch<SetStateAction<Record<string, number>>>;
  readonly rowDetailHeight: number | "auto";
  readonly rowDetailRenderer: Props["rowDetailRenderer"];
  readonly rowFullWidthRenderer: Props["rowFullWidthRenderer"];

  readonly columnDoubleClickToAutosize: boolean;
  readonly columnMoveDragPlaceholder: Props["columnMoveDragPlaceholder"];
  readonly columnGroupMoveDragPlaceholder: Props["columnGroupMoveDragPlaceholder"];
  readonly columnGroupRenderer: Props["columnGroupRenderer"];

  readonly viewport: HTMLDivElement | null;
  readonly setViewport: Dispatch<SetStateAction<HTMLDivElement | null>>;

  readonly focusActive: PieceWritable<PositionUnion | null>;

  readonly columnGroupDefaultExpansion: boolean;
  readonly columnGroupExpansions: Record<string, boolean>;

  readonly floatingRowEnabled: boolean;
  readonly floatingRowHeight: number;
  readonly headerGroupHeight: number;
  readonly headerHeight: number;
}

const context = createContext<RootContextValue>({} as any);

export const RootContextProvider = context.Provider;
export const useRoot = () => useContext(context);

const rowContextLayout = createContext<RowView<any>>({} as any);
export const RowLayoutContextProvider = rowContextLayout.Provider;
export const useRowLayout = () => useContext(rowContextLayout);

const colContextLayout = createContext<LayoutHeader[][]>({} as any);
export const ColumnLayoutContextProvider = colContextLayout.Provider;
export const useColumnLayout = () => useContext(colContextLayout);

const boundsContext = createContext<Piece<SpanLayout>>({} as any);
export const BoundsContextProvider = boundsContext.Provider;
export const useBounds = () => useContext(boundsContext);
