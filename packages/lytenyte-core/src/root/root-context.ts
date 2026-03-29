import type {
  ColumnAbstract,
  ColumnView,
  LayoutHeader,
  RowNode,
  RowSource,
} from "@1771technologies/lytenyte-shared";
import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Dimension } from "./hooks/use-viewport-dimensions";
import type { Root } from "./root";
import type { ViewportShadowsProps } from "../components/viewport/viewport-shadows";
import type { GridEvents } from "../types/events";
import type { Column, GridSpec, Props } from "../types";

export interface RootContextValue {
  readonly source: RowSource;
  readonly rtl: boolean;
  readonly view: ColumnView;

  readonly totalHeaderHeight: number;
  readonly dimensions: Dimension;
  readonly base: Omit<ColumnAbstract, "id">;

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

const colContextLayout = createContext<LayoutHeader[][]>({} as any);
export const ColumnLayoutContextProvider = colContextLayout.Provider;
export const useColumnLayout = () => useContext(colContextLayout);

export interface EditContext {
  readonly activeEdit: null | { readonly rowId: string; readonly column: string };
  readonly setActiveEdit: Dispatch<
    SetStateAction<null | { readonly rowId: string; readonly column: string }>
  >;
  readonly editData: any;
  readonly setEditData: Dispatch<SetStateAction<any>>;
  readonly editValidation: boolean | Record<string, unknown>;

  readonly changeValue: (value: any, column: Column) => boolean | Record<string, unknown>;
  readonly changeWithInit: (value: any, row: RowNode<any>, column: ColumnAbstract) => any;
  readonly changeData: (data: any) => boolean | Record<string, unknown>;

  readonly commit: () => boolean | Record<string, unknown>;
  readonly cancel: () => void;
}
