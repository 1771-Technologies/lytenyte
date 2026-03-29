import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import { useGridIdContext } from "./grid-id.js";
import type { Root } from "../root.js";

const context = createContext([] as string[]);

const contextDragEvents = createContext<{
  readonly onRowDragLeave: Root.Props["onRowDragLeave"];
  readonly onRowDragEnter: Root.Props["onRowDragEnter"];
  readonly onRowDrop: Root.Props["onRowDrop"];
}>(null as any);

export const DropAcceptProvider = memo(
  (
    props: PropsWithChildren<{
      readonly rowDropAccept: string[] | undefined;
      readonly onRowDragLeave: Root.Props["onRowDragLeave"];
      readonly onRowDragEnter: Root.Props["onRowDragEnter"];
      readonly onRowDrop: Root.Props["onRowDrop"];
    }>,
  ) => {
    const gridId = useGridIdContext();

    const dropAccept = useMemo(() => {
      const drop = props.rowDropAccept ?? [];
      if (!drop.includes(gridId)) drop.push(gridId);

      return drop.map((x) => `grid:${x}`);
    }, [gridId, props.rowDropAccept]);

    const dragValue = useMemo(() => {
      return {
        onRowDragLeave: props.onRowDragLeave,
        onRowDragEnter: props.onRowDragEnter,
        onRowDrop: props.onRowDrop,
      };
    }, [props.onRowDragEnter, props.onRowDragLeave, props.onRowDrop]);

    return (
      <context.Provider value={dropAccept}>
        <contextDragEvents.Provider value={dragValue}>{props.children}</contextDragEvents.Provider>
      </context.Provider>
    );
  },
);

export const useDropAcceptContext = () => useContext(context);
export const useDragContext = () => useContext(contextDragEvents);
