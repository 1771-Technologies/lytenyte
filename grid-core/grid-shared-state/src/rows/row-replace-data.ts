import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

function clearCache<D, E>(api: ApiPro<D, E> | ApiCore<D, E>) {
  const s = api.getState();

  s.internal.fieldCacheRef.column = {};
  s.internal.fieldCacheRef.group = {};
  s.internal.fieldCacheRef.pivot = {};
  s.internal.fieldCacheRef["quick-search"] = {};
}

export const rowReplaceBottomData = <D, E>(api: ApiPro<D, E> | ApiCore<D, E>, d: D[]) => {
  const s = api.getState();

  clearCache(api);
  s.internal.rowBackingDataSource.peek().rowReplaceBottomData(d);

  queueMicrotask(api.rowRefresh);
};

export const rowReplaceTopData = <D, E>(api: ApiPro<D, E> | ApiCore<D, E>, d: D[]) => {
  const s = api.getState();

  clearCache(api);
  s.internal.rowBackingDataSource.peek().rowReplaceTopData(d);

  queueMicrotask(api.rowRefresh);
};
export const rowReplaceData = <D, E>(api: ApiPro<D, E> | ApiCore<D, E>, d: D[]) => {
  const s = api.getState();

  clearCache(api);
  s.internal.rowBackingDataSource.peek().rowReplaceData(d);

  queueMicrotask(api.rowRefresh);
};
