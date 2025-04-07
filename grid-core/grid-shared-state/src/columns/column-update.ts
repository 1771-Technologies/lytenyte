import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const columnUpdate = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
  update:
    | Record<string, Omit<ColumnCore<D, E>, "id">>
    | Record<string, Omit<ColumnPro<D, E>, "id">>,
) => {
  api = api as ApiPro<D, E>;
  c = c as ColumnPro<D, E>;

  api.columnUpdateMany({ [c.id]: update });
};

export const columnUpdateMany = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  updates:
    | Record<string, Omit<ColumnCore<D, E>, "id">>
    | Record<string, Omit<ColumnPro<D, E>, "id">>,
) => {
  api = api as ApiPro<D, E>;
  updates = updates as Record<string, Omit<ColumnPro<D, E>, "id">>;

  const s = api.getState();

  const mode = s.columnPivotModeIsOn?.peek() ?? false;

  const columns = [...(mode ? s.internal.columnPivotColumns.peek() : s.columns.peek())];

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (updates[column.id]) {
      const next = { ...column, ...updates[column.id] };
      columns[i] = next;
    }
  }

  if (mode) s.internal.columnPivotColumns.set(columns);
  else s.columns.set(columns);
};
