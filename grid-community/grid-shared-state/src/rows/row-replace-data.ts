import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

function clearCache<D, E>(api: ApiEnterprise<D, E> | ApiCommunity<D, E>) {
  const s = api.getState();

  s.internal.fieldCacheRef.column = {};
  s.internal.fieldCacheRef.group = {};
  s.internal.fieldCacheRef.pivot = {};
  s.internal.fieldCacheRef["quick-search"] = {};
}

export const rowReplaceBottomData = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  d: D[],
) => {
  const s = api.getState();

  clearCache(api);
  s.internal.rowBackingDataSource.peek().rowReplaceBottomData(d);

  queueMicrotask(api.rowRefresh);
};

export const rowReplaceTopData = <D, E>(api: ApiEnterprise<D, E> | ApiCommunity<D, E>, d: D[]) => {
  const s = api.getState();

  clearCache(api);
  s.internal.rowBackingDataSource.peek().rowReplaceTopData(d);

  queueMicrotask(api.rowRefresh);
};
export const rowReplaceData = <D, E>(api: ApiEnterprise<D, E> | ApiCommunity<D, E>, d: D[]) => {
  const s = api.getState();

  clearCache(api);
  s.internal.rowBackingDataSource.peek().rowReplaceData(d);

  queueMicrotask(api.rowRefresh);
};
