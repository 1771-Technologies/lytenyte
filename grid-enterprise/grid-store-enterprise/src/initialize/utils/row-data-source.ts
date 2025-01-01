import { computed } from "@1771technologies/cascada";
import type { RowDataSourceEnterprise, StoreEnterprise } from "@1771technologies/grid-types";
import { emptyRowDataSource } from "./empty-row-data-source";

export function rowDataSource<D, E>(
  state: StoreEnterprise<D, E>["state"],
  api: StoreEnterprise<D, E>["api"],
) {
  let prevDs: RowDataSourceEnterprise<D, E> | null = null;
  const backingDataSource = computed(() => {
    const ds = state.rowDataSource.get();

    if (prevDs) prevDs.clean?.(api);
    prevDs = ds;

    ds.init?.(api);

    const rds = { ...emptyRowDataSource, ...ds };
    return rds as Required<RowDataSourceEnterprise<D, E>>;
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
