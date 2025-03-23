import { signal } from "@1771technologies/react-cascada";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import { equal, itemsWithIdToMap } from "@1771technologies/js-utils";

export function measuresComputed<D, E>(measures: string[], api: ApiEnterprise<D, E>) {
  const measures$ = signal(measures, {
    equal: equal,
    bind: (measures) => {
      const columns = api.getState().columns.get();
      const lookup = itemsWithIdToMap(columns);

      const model = measures.filter((c) => {
        const column = lookup.get(c);
        return column && api.columnIsMeasurable(column);
      });

      return model;
    },
    postUpdate: () => {
      const sx = api.getState();
      const base = sx.columnBase.peek();

      const measureColumns = sx.measureModel.peek().map((c) => api.columnById(c)!);
      const columnsWithMeasureApplied = measureColumns.filter(
        (c) => !(c.measureFn ?? base.measureFn),
      );

      if (columnsWithMeasureApplied.length) {
        const updates = Object.fromEntries(
          columnsWithMeasureApplied.map((c) => {
            const candidates =
              c.measureFnDefault ?? c.measureFnsAllowed?.at(0) ?? base.measureFnsAllowed?.at(0);

            return [c.id, { measureFn: candidates }] as const;
          }),
        );

        api.columnUpdateMany(updates);
      }
    },
  });

  return measures$;
}
