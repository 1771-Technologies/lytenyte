import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const columnMoveAfter = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  src: string[],
  dest: string,
) => {
  moveColumn(api, src, dest, true);
};
export const columnMoveBefore = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  src: string[],
  dest: string,
) => {
  moveColumn(api, src, dest, false);
};

export const columnMoveToVisibleIndex = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  src: string[],
  index: number,
  before = true,
) => {
  const dest = api.columnByIndex(index)?.id;
  if (dest == null) return;

  moveColumn(api, src, dest, !before);
};

const moveColumn = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  src: string[],
  dest: string,
  after: boolean,
) => {
  api = api as ApiEnterprise<D, E>;

  const colSet = new Set(src);

  if (!api.columnById(dest))
    throw new Error(`Destination column must be valid. Column with id "${dest}" was not found`);

  if (colSet.has(dest))
    throw new Error(`Cannot move a set of columns that contain the destination. Moving ${dest}.`);

  const s = api.getState();

  const mode = s.columnPivotModeIsOn?.peek() ?? false;

  const columns = mode ? s.internal.columnPivotColumns.peek() : s.columns.peek();

  const columnsToMove = columns.filter((c) => colSet.has(c.id));
  const nextColumns = columns.filter((c) => !colSet.has(c.id));

  const indexOfDest = nextColumns.findIndex((c) => c.id === dest);

  const offset = after ? 1 : 0;
  nextColumns.splice(indexOfDest + offset, 0, ...columnsToMove);

  if (mode) s.internal.columnPivotColumns.set(nextColumns);
  else s.columns.set(nextColumns);

  api.eventFire("onColumnMove", api);
};
