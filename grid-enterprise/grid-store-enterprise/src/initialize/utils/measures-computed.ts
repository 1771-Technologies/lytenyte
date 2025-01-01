import { computed, signal } from "@1771technologies/cascada";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

export function measuresComputed<D, E>(measures: string[], api: ApiEnterprise<D, E>) {
  const measures$ = signal(measures);

  return computed(
    () => {
      const columns = api.getState().columns.get();
      const lookup = itemsWithIdToMap(columns);

      const model = measures$.get().filter((c) => {
        const column = lookup.get(c);

        return column && api.columnIsMeasurable(column);
      });

      return model;
    },
    (v) => measures$.set(v),
  );
}
