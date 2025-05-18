import type { ColumnBaseCore, ColumnCore, GridCore } from "@1771technologies/grid-types/core";
import type { ColumnBasePro, ColumnPro, GridPro } from "@1771technologies/grid-types/pro";
import { computed, type ReadonlySignal, type Signal } from "@1771technologies/react-cascada";

export function columnsWithSpan<D, E>(
  columnsVisible: ReadonlySignal<ColumnCore<D, E>[]> | ReadonlySignal<ColumnPro<D, E>[]>,
  columnBase: Signal<ColumnBaseCore<D, E>> | Signal<ColumnBasePro<D, E>>,
  api: GridCore<D, E>["api"] | GridPro<D, E>["api"],
) {
  const columnsWithColSpan = computed(() => {
    const indices = new Set<number>();
    const columns = columnsVisible.get();
    const base = columnBase.get();

    for (let i = 0; i < columns.length; i++) {
      const span = columns[i].columnSpan ?? base.columnSpan;
      if (span != null) indices.add(i);
    }
    return indices;
  });

  const columnsWithRowSpan = computed(() => {
    const indices = new Set<number>();
    const columns = columnsVisible.get();
    const base = columnBase.get();

    for (let i = 0; i < columns.length; i++) {
      const span = columns[i].rowSpan ?? base.rowSpan;
      if (span != null) indices.add(i);
    }

    return indices;
  });

  const columnGetRowSpan = computed(() => {
    const columns = columnsVisible.get();
    const base = columnBase.get();

    return (r: number, c: number) => {
      const column = columns[c];
      const row = api.rowByIndex(r);
      const span = column.rowSpan ?? base.rowSpan;
      if (!column || !row || span == null) return 1;

      if (typeof span === "number") {
        const spanToUse = Math.max(1, span);
        return r % spanToUse === 0 ? spanToUse : 1;
      }

      return Math.max(1, span({ api: api as any, row, column: column as any }));
    };
  });

  const columnGetColSpan = computed(() => {
    const columns = columnsVisible.get();
    const base = columnBase.get();

    return (r: number, c: number) => {
      const column = columns[c];

      const row = api.rowByIndex(r);
      const span = column.columnSpan ?? base.columnSpan;

      if (!column || !row || !span) return 1;

      if (typeof span === "number") {
        const spanToUse = Math.max(1, span);
        return spanToUse;
      }

      return Math.max(1, span({ api: api as any, row }));
    };
  });

  return {
    columnsWithColSpan,
    columnsWithRowSpan,
    columnGetColSpan,
    columnGetRowSpan,
  };
}
