import { signal } from "@1771technologies/react-cascada";
import { rowCleanRowGroupModel } from "@1771technologies/grid-core";
import { equal } from "@1771technologies/js-utils";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import type { ApiCore } from "@1771technologies/grid-types/core";

export function rowGroupModelComputed<D, E>(model: string[], api: ApiPro<D, E> | ApiCore<D, E>) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

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
      const sx = api.getState();
      sx.columns.set((prev: any[]) => [...prev]);

      if ("columnPivotModeIsOn" in sx) {
        sx.internal.columnPivotColumns.set((prev) => [...prev]);
      }

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
