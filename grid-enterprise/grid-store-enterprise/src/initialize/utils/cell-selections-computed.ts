import { computed, signal } from "@1771technologies/cascada";
import { boundSelectionRect } from "@1771technologies/grid-core-enterprise";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";

export const cellSelectionComputed = <D, E>(
  rects: CellSelectionRect[],
  api: ApiEnterprise<D, E>,
) => {
  const rects$ = signal(rects);

  return computed(
    () => {
      const current = rects$.get();

      const sx = api.getState();

      // For recomputes
      sx.internal.rowCount.get();
      sx.columnsVisible.get();

      const next = current.map((c) => boundSelectionRect(api, c));

      return next;
    },
    (v) => rects$.set(v),
  );
};
