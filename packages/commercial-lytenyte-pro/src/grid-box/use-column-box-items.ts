import { useMemo, type ReactNode } from "react";
import type { Column, DropEventParams, Grid } from "../+types";
import type { GridBoxItem } from "./+types";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";

export interface OnDropParams<T> {
  readonly target: Column<T>;
  readonly src: Column<T>;
  readonly isBefore: boolean;
}
export interface OnRootDropParams<T> {
  readonly column: Column<T>;
}

export interface UseColumnBoxItemArgs<T> {
  readonly grid: Grid<T>;
  readonly orientation?: "horizontal" | "vertical";
  readonly draggable?: boolean;
  readonly itemFilter?: (c: Column<T>) => boolean;

  readonly onRootDrop?: (p: OnRootDropParams<T>) => void;
  readonly onDrop?: (p: OnDropParams<T>) => void;
  readonly onAction?: (c: Column<T>) => void;
  readonly onDelete?: (c: Column<T>) => void;
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
      .map<GridBoxItem<Column<T>>>((c) => {
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
          draggable,
          data: c,
          dragData: data,
          dragPlaceholder: dragPlaceholder ? () => dragPlaceholder?.(c) : undefined,
          onAction: () => onAction?.(c),
          onDelete: () => onDelete?.(c),
          onDrop: (p) => {
            const target = c;
            const src = p.state.siteLocalData?.[columnId];

            const isRtl = grid.state.rtl.get();

            let isBefore: boolean;
            if (orientation === "horizontal") {
              isBefore = isRtl ? !p.moveState.leftHalf : p.moveState.leftHalf;
            } else {
              isBefore = p.moveState.topHalf;
            }

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
    grid.state.rtl,
    gridId,
    itemFilter,
    onAction,
    onDelete,
    onDrop,
    orientation,
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
