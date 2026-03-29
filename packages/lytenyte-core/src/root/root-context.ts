import type { ColumnAbstract } from "@1771technologies/lytenyte-shared";
import { createContext, useContext, type ReactNode, type RefObject } from "react";
import type { Root } from "./root";
import type { ViewportShadowsProps } from "../components/viewport/viewport-shadows";
import type { GridEvents } from "../types/events";
import type { GridSpec, Props } from "../types";

export interface RootContextValue {
  readonly rtl: boolean;

  readonly base: Omit<ColumnAbstract, "id">;

  readonly columnDoubleClickToAutosize: boolean;
  readonly columnMoveDragPlaceholder: Root.Props["columnMoveDragPlaceholder"];
  readonly columnGroupMoveDragPlaceholder: Root.Props["columnGroupMoveDragPlaceholder"];
  readonly columnGroupRenderer: Root.Props["columnGroupRenderer"];
  readonly onColumnMoveOutside: Root.Props["onColumnMoveOutside"];

  readonly styles: Props["styles"];

  readonly events: GridEvents<GridSpec>;

  readonly columnGroupDefaultExpansion: boolean;
  readonly columnGroupExpansions: Record<string, boolean>;

  readonly editMode: "cell" | "row" | "readonly";
  readonly editClickActivator: "single-click" | "double-click" | "none";
  readonly editValidator: null | ((x: any) => any);

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
