import type {
  ColumnAbstract,
  ColumnView,
  LayoutHeader,
  PositionUnion,
  RowNode,
  RowSource,
  RowView,
  SpanLayout,
} from "@1771technologies/lytenyte-shared";
import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Piece, PieceWritable } from "../hooks/use-piece";
import type { Dimension } from "./hooks/use-viewport-dimensions";
import type { Root } from "./root";
import type { ViewportShadowsProps } from "../components/viewport/viewport-shadows";
import type { GridEvents } from "../types/events";
import type { GridSpec, Props } from "../types";

export interface RootContextValue {
  readonly id: string;
  readonly source: RowSource;
  readonly rtl: boolean;
  readonly view: ColumnView;
  readonly api: Root.API;

  readonly topComponent?: () => ReactNode;
  readonly centerComponent?: () => ReactNode;
  readonly bottomComponent?: () => ReactNode;

  readonly detailExpansions: Set<string>;
  readonly totalHeaderHeight: number;
  readonly dimensions: Dimension;
  readonly base: Omit<ColumnAbstract, "id">;

  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;

  readonly startOffset: number;
  readonly endOffset: number;
  readonly topOffset: number;
  readonly bottomOffset: number;

  readonly setDetailCache: Dispatch<SetStateAction<Record<string, number>>>;
  readonly rowDetailHeightCache: Record<string, number>;
  readonly rowDetailAutoHeightGuess: number;
  readonly rowDetailHeight: number | "auto";
  readonly rowDetailRenderer: Root.Props["rowDetailRenderer"];
  readonly rowFullWidthRenderer: Root.Props["rowFullWidthRenderer"];

  readonly columnDoubleClickToAutosize: boolean;
  readonly columnMoveDragPlaceholder: Root.Props["columnMoveDragPlaceholder"];
  readonly columnGroupMoveDragPlaceholder: Root.Props["columnGroupMoveDragPlaceholder"];
  readonly columnGroupRenderer: Root.Props["columnGroupRenderer"];
  readonly onColumnMoveOutside: Root.Props["onColumnMoveOutside"];

  readonly viewport: HTMLDivElement | null;
  readonly setViewport: Dispatch<SetStateAction<HTMLDivElement | null>>;

  readonly styles: Props["styles"];

  readonly focusActive: PieceWritable<PositionUnion | null>;

  readonly events: GridEvents<GridSpec>;

  readonly columnGroupDefaultExpansion: boolean;
  readonly columnGroupExpansions: Record<string, boolean>;

  readonly floatingRowEnabled: boolean;
  readonly floatingRowHeight: number;
  readonly headerGroupHeight: number;
  readonly headerHeight: number;

  readonly editMode: "cell" | "row" | "readonly";
  readonly editClickActivator: "single-click" | "double-click" | "none";
  readonly editValidator: null | ((x: any) => any);

  readonly dropAccept: string[];
  readonly onRowDragLeave: Root.Props["onRowDragLeave"];
  readonly onRowDragEnter: Root.Props["onRowDragEnter"];
  readonly onRowDrop: Root.Props["onRowDrop"];

  readonly rowAlternateAttr: boolean;

  readonly selectActivator: Root.Props["rowSelectionActivator"];
  readonly selectPivot: RefObject<number | null>;

  readonly slotShadows?: (props: ViewportShadowsProps) => ReactNode;
  readonly slotViewportOverlay?: ((props: { api: Root.API }) => ReactNode) | ReactNode;
  readonly slotRowsOverlay?: ((props: { api: Root.API }) => ReactNode) | ReactNode;
}

const context = createContext<RootContextValue>({} as any);

export const RootContextProvider = context.Provider;
export const useRoot = () => useContext(context);

const rowContextLayout = createContext<RowView>({} as any);
export const RowLayoutContextProvider = rowContextLayout.Provider;
export const useRowLayout = () => useContext(rowContextLayout);

const colContextLayout = createContext<LayoutHeader[][]>({} as any);
export const ColumnLayoutContextProvider = colContextLayout.Provider;
export const useColumnLayout = () => useContext(colContextLayout);

const boundsContext = createContext<Piece<SpanLayout>>({} as any);
export const BoundsContextProvider = boundsContext.Provider;
export const useBounds = () => useContext(boundsContext);

export interface EditContext {
  readonly activeEdit: null | { readonly rowId: string; readonly column: string };
  readonly setActiveEdit: Dispatch<
    SetStateAction<null | { readonly rowId: string; readonly column: string }>
  >;
  readonly editData: any;
  readonly setEditData: Dispatch<SetStateAction<any>>;
  readonly editValidation: boolean | Record<string, unknown>;

  readonly changeValue: (value: any) => boolean | Record<string, unknown>;
  readonly changeWithInit: (value: any, row: RowNode<any>, column: ColumnAbstract) => any;
  readonly changeData: (data: any) => boolean | Record<string, unknown>;

  readonly commit: () => boolean | Record<string, unknown>;
  readonly cancel: () => void;
}

const editContext = createContext({} as EditContext);
export const EditProvider = editContext.Provider;
export const useEdit = () => useContext(editContext);

const focusContext = createContext<null | { row: number; column: number }>({} as any);
export const FocusProvider = focusContext.Provider;
export const useFocus = () => useContext(focusContext);
