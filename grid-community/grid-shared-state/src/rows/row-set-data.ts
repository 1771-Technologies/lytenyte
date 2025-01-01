import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowSetData = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  rowId: string,
  data: D,
) => {
  const row = api.rowById(rowId);
  if (!row) return;

  const s = api.getState();

  delete s.internal.fieldCacheRef.column[rowId];
  delete s.internal.fieldCacheRef.group[rowId];
  delete s.internal.fieldCacheRef.pivot[rowId];
  delete s.internal.fieldCacheRef["quick-search"][rowId];

  if (s.rowUpdateStackEnabled.peek()) {
    const nextStack = [...s.internal.rowUpdateStack.peek()];

    nextStack.push({ undo: { [rowId]: row.data as D }, redo: { [rowId]: data } });

    while (nextStack.length > s.rowUpdateStackMaxSize.peek()) nextStack.shift();

    s.internal.rowUpdateStack.set(nextStack);
    s.internal.rowUpdateStackPointer.set(nextStack.length - 1);
  }

  s.internal.rowBackingDataSource.peek().rowSetData(rowId, data);
};

export const rowSetDataMany = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  updates: Record<string, D>,
) => {
  const s = api.getState();
  for (const rowId in updates) {
    delete s.internal.fieldCacheRef.column[rowId];
    delete s.internal.fieldCacheRef.group[rowId];
    delete s.internal.fieldCacheRef.pivot[rowId];
    delete s.internal.fieldCacheRef["quick-search"][rowId];
  }

  if (s.rowUpdateStackEnabled.peek()) {
    const nextStack = [...s.internal.rowUpdateStack.peek()];

    const data = Object.fromEntries(
      Object.keys(updates)
        .map((c) => [c, api.rowById(c)] as const)
        .filter((c) => c[1])
        .map((c) => [c[0], c[1]!.data] as const),
    );

    nextStack.push({ undo: data as Record<string, D>, redo: updates });

    while (nextStack.length > s.rowUpdateStackMaxSize.peek()) nextStack.shift();

    s.internal.rowUpdateStack.set(nextStack);
    s.internal.rowUpdateStackPointer.set(nextStack.length - 1);
  }

  s.internal.rowBackingDataSource.peek().rowSetDataMany(updates);
};
