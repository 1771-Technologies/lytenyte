import { useMemo, type ReactNode } from "react";
import type { Column, DropEventParams, Grid } from "../+types.js";
import type { GridBoxItem } from "./+types.js";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";

export interface OnDropParams<T> {
  readonly target: Column<T>;
  readonly src: Column<T>;
  readonly isBefore: boolean;
}
export interface OnRootDropParams<T> {
  readonly column: Column<T>;
}

export interface OnActionParams<T> {
  readonly column: Column<T>;
  readonly el: HTMLElement;
}

export interface UseColumnBoxItemArgs<T> {
  readonly grid: Grid<T>;
  readonly orientation?: "horizontal" | "vertical";
  readonly draggable?: boolean;
  readonly itemFilter?: (c: Column<T>) => boolean;

  readonly onRootDrop?: (p: OnRootDropParams<T>) => void;
  readonly onDrop?: (p: OnDropParams<T>) => void;
  readonly onAction?: (c: OnActionParams<T>) => void;
  readonly onDelete?: (c: OnActionParams<T>) => void;
  readonly dragPlaceholder?: (c: Column<T>) => ReactNode;
}

export function useColumnBoxItems<T>({
  grid,
  onRootDrop,
  onDrop,
  onDelete,
  onAction,
  orientation,
  draggable = true,
  dragPlaceholder,
  itemFilter,
}: UseColumnBoxItemArgs<T>) {
  const columns = grid.state.columns.useValue();
  const base = grid.state.columnBase.useValue();
  const gridId = grid.state.gridId.useValue();

  const items = useMemo(() => {
    const groupId = `${gridId}-group`;
    const aggId = `${gridId}-agg`;
    const columnId = `${gridId}-column`;
    return columns
      .filter((c) => {
        return itemFilter ? itemFilter(c) : true;
      })
      .map<GridBoxItem<Column<T>>>((c, i) => {
        const canGroup = c.uiHints?.rowGroupable ?? base.uiHints?.rowGroupable ?? false;
        const canAgg = Boolean(
          c.uiHints?.aggDefault ??
            c.uiHints?.aggDefault?.length ??
            base.uiHints?.aggDefault ??
            base.uiHints?.aggsAllowed?.length,
        );

        const data: Record<string, any> = {
          [columnId]: c,
        };
        if (canGroup) data[groupId] = c.id;
        if (canAgg) data[aggId] = c;

        return {
          label: c.name ?? c.id,
          id: c.id,
          index: i,
          source: "columns",
          draggable,
          data: c,
          dragData: data,
          dragPlaceholder: dragPlaceholder ? () => dragPlaceholder?.(c) : undefined,
          onAction: (el) => onAction?.({ column: c, el }),
          onDelete: (el) => onDelete?.({ column: c, el }),
          onDrop: (p) => {
            const src = p.state.siteLocalData?.[columnId];
            const target = c;

            const dragIndex = columns.findIndex((x) => x.id === src.id);
            const overIndex = columns.findIndex((x) => x.id === c.id);

            const isBefore = overIndex < dragIndex;
            if (overIndex === dragIndex) return;

            onDrop?.({ src, target, isBefore });
          },
        };
      });
  }, [
    base.uiHints?.aggDefault,
    base.uiHints?.aggsAllowed?.length,
    base.uiHints?.rowGroupable,
    columns,
    dragPlaceholder,
    draggable,
    gridId,
    itemFilter,
    onAction,
    onDelete,
    onDrop,
  ]);

  const onRootDropEv = useEvent((p: DropEventParams) => {
    const columnId = `${gridId}-column`;
    const src = p.state.siteLocalData?.[columnId];

    onRootDrop?.(src);
  });

  return useMemo(
    () => ({
      rootProps: {
        accepted: [`${gridId}-column`],
        orientation: orientation,
        onRootDrop: onRootDropEv,
        grid,
      },
      items,
    }),
    [grid, gridId, items, onRootDropEv, orientation],
  );
}
