import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowSetData = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>, rowId: string, data: D) => {
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

  queueMicrotask(api.rowRefresh);
};

export const rowSetDataMany = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
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

  queueMicrotask(api.rowRefresh);
};
