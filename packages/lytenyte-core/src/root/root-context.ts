import { createContext, useContext, type ReactNode } from "react";
import type { Root } from "./root";
import type { ViewportShadowsProps } from "../components/viewport/viewport-shadows";
import type { GridEvents } from "../types/events";
import type { GridSpec, Props } from "../types";

export interface RootContextValue {
  readonly rtl: boolean;

  readonly columnDoubleClickToAutosize: boolean;
  readonly columnMoveDragPlaceholder: Root.Props["columnMoveDragPlaceholder"];
  readonly columnGroupMoveDragPlaceholder: Root.Props["columnGroupMoveDragPlaceholder"];
  readonly onColumnMoveOutside: Root.Props["onColumnMoveOutside"];

  readonly styles: Props["styles"];

  readonly events: GridEvents<GridSpec>;

  readonly editMode: "cell" | "row" | "readonly";
  readonly editClickActivator: "single-click" | "double-click" | "none";

  readonly onRowDragLeave: Root.Props["onRowDragLeave"];
  readonly onRowDragEnter: Root.Props["onRowDragEnter"];
  readonly onRowDrop: Root.Props["onRowDrop"];

  readonly rowAlternateAttr: boolean;

  readonly selectActivator: Root.Props["rowSelectionActivator"];

  readonly slotShadows?: (props: ViewportShadowsProps) => ReactNode;
  readonly slotViewportOverlay?: ((props: { api: Root.API }) => ReactNode) | ReactNode;
  readonly slotRowsOverlay?: ((props: { api: Root.API }) => ReactNode) | ReactNode;
}

const context = createContext<RootContextValue>({} as any);

export const RootContextProvider = context.Provider;
export const useRoot = () => useContext(context);
