import { computed } from "@1771technologies/react-cascada";
import { createClientDataSource } from "@1771technologies/grid-client-data-source-core";
import type { GridCore } from "@1771technologies/grid-types/core";

export function rowDataSource<D, E>(state: GridCore<D, E>["state"], api: GridCore<D, E>["api"]) {
  let prev: any;
  const backingDataSource = computed(() => {
    const cds = state.rowDataSource.get();
    const rds = createClientDataSource<D, E>(cds);
    if (prev) prev.clean(api);
    prev = rds;

    rds.init(api);

    return rds;
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
