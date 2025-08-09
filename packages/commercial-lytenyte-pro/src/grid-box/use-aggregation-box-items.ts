import { useMemo } from "react";
import type { AggModelFn, Column, DropEventParams, Grid } from "../+types.js";
import type { GridBoxItem } from "./+types.js";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";

export interface UseAggregationBoxItemsProps<T> {
  readonly grid: Grid<T>;
  readonly orientation?: "horizontal" | "vertical";
}

export function useAggregationBoxItems<T>({ grid, orientation }: UseAggregationBoxItemsProps<T>) {
  const model = grid.state.aggModel.useValue();
  const gridId = grid.state.gridId.useValue();

  const items = useMemo(() => {
    const items = Object.entries(model).map<GridBoxItem<{ id: string; agg: AggModelFn<T> }>>(
      ([id, agg], i) => {
        const column = grid.api.columnById(id);

        const name = column?.name ?? column?.id ?? id;
        const fn = typeof agg.fn === "string" ? agg.fn : "Fn(x)";

        return {
          draggable: false,
          id,
          index: i,
          source: "aggregation",
          data: { id, agg } as any,
          dragData: {},
          label: `${name} ${fn}`,
          onAction: () => {},
          onDelete: () => {
            grid.state.aggModel.set((prev) => {
              const next = { ...prev };
              delete next[id];

              return next;
            });
          },
          onDrop: () => {},
          dragPlaceholder: undefined,
        };
      },
    );
    return items;
  }, [model, grid.api, grid.state.aggModel]);

  const onRootDrop = useEvent((p: DropEventParams) => {
    const aggId = `${gridId}-agg`;
    const c = p.state.siteLocalData?.[aggId] as Column<T>;
    if (!c) return;

    const current = model[c.id];
    if (!current) {
      const base = grid.state.columnBase.get();
      const agg =
        c.uiHints?.aggDefault ??
        c.uiHints?.aggsAllowed?.[0] ??
        base.uiHints?.aggDefault ??
        base.uiHints?.aggsAllowed?.[0];

      if (!agg) return;

      const next = { fn: agg };
      grid.state.aggModel.set((prev) => ({ ...prev, [c.id]: next }));
    }
  });

  return useMemo(() => {
    return {
      rootProps: {
        accepted: [`${gridId}-agg`],
        onRootDrop,
        orientation,
        grid,
      },

      items,
    };
  }, [grid, gridId, items, onRootDrop, orientation]);
}
