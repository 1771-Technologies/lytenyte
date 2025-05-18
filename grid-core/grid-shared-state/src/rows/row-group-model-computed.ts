import { signal } from "@1771technologies/react-cascada";
import { rowCleanRowGroupModel } from "@1771technologies/grid-core";
import { equal } from "@1771technologies/js-utils";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import type { ApiCore } from "@1771technologies/grid-types/core";

export function rowGroupModelComputed<D, E>(model: string[], api: ApiPro<D, E> | ApiCore<D, E>) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  let prev = model;
  const model$ = signal(model, {
    equal: (l, r) => {
      return equal(l, r);
    },
    bind: (v) => {
      const sx = api.getState();
      const columns = sx.columns.get();

      const model = rowCleanRowGroupModel(v, columns, api);
      return model;
    },
    postUpdate: () => {
      const sx = (api as ApiPro<D, E>).getState();
      sx.columns.set((prev: any[]) => [...prev]);

      if ("columnPivotModeIsOn" in sx) {
        sx.internal.columnPivotColumns.set((prev) => [...prev]);
      }

      const current = sx.rowGroupModel.peek();

      const applyAggs = sx.rowGroupAutoApplyAggDefaults.peek();
      // Need to add aggregations
      if (prev.length === 0 && current.length !== 0 && applyAggs) {
        const column = sx.columns.peek();
        const base = sx.columnBase.peek();

        const aggs = Object.fromEntries(
          column
            .filter((c) => !api.columnIsGridGenerated(c as any))
            .map((c) => {
              const agg = c.aggFnDefault ?? c.aggFnsAllowed?.at(0) ?? base.aggFnsAllowed?.at(0);
              if (agg) return [c.id, { fn: agg }] as const;
              return null;
            })
            .filter((c) => !!c),
        );

        sx.aggModel.set((prev) => ({ ...prev, ...aggs }));
      }
      if (prev.length !== 0 && current.length === 0 && applyAggs) {
        sx.aggModel.set({});
      }

      prev = current;

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const expansions = sx.rowGroupExpansions.peek();

        const entries = Object.entries(expansions).filter(([key]) => api.rowById(key) != null);
        const cleanExpansions = Object.fromEntries(entries);

        sx.rowGroupExpansions.set(cleanExpansions);
        timeoutId = null;
      }, 50);
    },
  });

  return model$;
}
