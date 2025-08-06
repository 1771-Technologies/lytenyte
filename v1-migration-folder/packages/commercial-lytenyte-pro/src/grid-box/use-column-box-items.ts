import { useMemo, type ReactNode } from "react";
import type { Column, Grid } from "../+types";
import type { GridBoxItem } from "./+types";

export interface OnDropParams<T> {
  readonly target: Column<T>;
  readonly src: Column<T>;
  readonly isBefore: boolean;
}

export interface UseColumnBoxItemArgs<T> {
  readonly grid: Grid<T>;
  readonly orientation?: "horizontal" | "vertical";
  readonly draggable?: boolean;
  readonly itemFilter?: (c: Column<T>) => boolean;

  readonly onDrop?: (p: OnDropParams<T>) => void;
  readonly onAction?: (c: Column<T>) => void;
  readonly dragPlaceholder?: (c: Column<T>) => ReactNode;
}

export function useColumnBoxItems<T>({
  grid,
  onDrop,
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
      .map<GridBoxItem>((c) => {
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
        if (canGroup) data[groupId] = c;
        if (canAgg) data[aggId] = c;

        return {
          label: c.name ?? c.id,
          id: c.id,
          draggable,
          dragPlaceholder: dragPlaceholder ? () => dragPlaceholder?.(c) : undefined,
          onAction: () => onAction?.(c),
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
          data,
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
    onDrop,
    orientation,
  ]);

  return {
    rootProps: {
      accepted: useMemo(() => [`${gridId}-column`], [gridId]),
      orientation,
      grid,
    },
    items,
  };
}
