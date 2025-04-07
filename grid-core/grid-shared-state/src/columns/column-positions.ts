import {
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/react-cascada";
import { columnGetPositions, type ColumnWidthLike } from "@1771technologies/grid-core";

export const columnPositions = <T extends ColumnWidthLike>(
  columns$: ReadonlySignal<T[]> | Signal<T[]>,
  columnBase: Signal<Omit<T, "id">>,
  width: Signal<number>,
) => {
  const columnWidthDeltas = signal<Record<string, number> | null>(null);
  const columnPositions = computed(() => {
    const columns = columns$.get();
    const base = columnBase.get();
    const deltas = columnWidthDeltas.get();

    // We just cast the types as there community columns and enterprise columns are not fully
    // compatible since they contain references to their respective APIs.
    return columnGetPositions(columns, base, deltas, width.get());
  });

  return { columnPositions, columnWidthDeltas };
};
