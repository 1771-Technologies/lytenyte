import { computed } from "@1771technologies/react-cascada";
import { emptyRowDataSource } from "./empty-row-data-source";
import type { GridPro, RowDataSourcePro } from "@1771technologies/grid-types/pro";

export function rowDataSource<D, E>(state: GridPro<D, E>["state"], api: GridPro<D, E>["api"]) {
  let prevDs: RowDataSourcePro<D, E> | null = null;
  const backingDataSource = computed(() => {
    const ds = state.rowDataSource.peek();

    if (prevDs) prevDs.clean?.(api);
    prevDs = ds;

    // Need to really rethink this. Essentially we are in a cascada scope at this point. Then the init
    // call may also use cascada resulting in a infinite loop. The timeout breaks this, but we really shouldn't
    // have this. For example init --> sx.get() --> init --> and so on
    setTimeout(() => {
      ds.init?.(api);
    }, 0);

    const rds = { ...emptyRowDataSource, ...ds };
    return rds as Required<RowDataSourcePro<D, E>>;
  });

  const rowCount = computed(() => {
    state.internal.rowRefreshCount.get();
    const s = backingDataSource.get();

    return s.rowCount();
  });
  const rowTopCount = computed(() => {
    state.internal.rowRefreshCount.get();
    const s = backingDataSource.get();

    return s.rowTopCount();
  });
  const rowBottomCount = computed(() => {
    state.internal.rowRefreshCount.get();
    const s = backingDataSource.get();

    return s.rowBottomCount();
  });
  const paginatePageCount = computed(() => {
    state.internal.rowRefreshCount.get();
    const s = backingDataSource.get();

    return (s.rowCount() - s.rowBottomCount() - s.rowTopCount()) / state.paginatePageSize.get();
  });

  return {
    rowBackingDataSource: backingDataSource,
    rowCount,
    rowTopCount,
    rowBottomCount,
    paginatePageCount,
  };
}
