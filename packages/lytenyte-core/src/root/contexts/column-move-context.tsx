import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import type { Root } from "../root.js";
import type { PartialMandatory } from "@1771technologies/lytenyte-shared";

interface ColumnMoveAndSizeContext {
  readonly columnDoubleClickToAutosize: boolean;
  readonly columnMoveDragPlaceholder: Root.Props["columnMoveDragPlaceholder"];
  readonly columnGroupMoveDragPlaceholder: Root.Props["columnGroupMoveDragPlaceholder"];
  readonly onColumnMoveOutside: Root.Props["onColumnMoveOutside"];
}

const context = createContext<ColumnMoveAndSizeContext>(null as any);

export const ColumnMoveAndSizeProvider = (
  props: PropsWithChildren<PartialMandatory<ColumnMoveAndSizeContext>>,
) => {
  const value = useMemo<ColumnMoveAndSizeContext>(() => {
    return {
      columnDoubleClickToAutosize: props.columnDoubleClickToAutosize ?? true,
      columnGroupMoveDragPlaceholder: props.columnGroupMoveDragPlaceholder,
      columnMoveDragPlaceholder: props.columnMoveDragPlaceholder,
      onColumnMoveOutside: props.onColumnMoveOutside,
    };
  }, [
    props.columnDoubleClickToAutosize,
    props.columnGroupMoveDragPlaceholder,
    props.columnMoveDragPlaceholder,
    props.onColumnMoveOutside,
  ]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
};

export const useColumnMoveContext = () => useContext(context);
