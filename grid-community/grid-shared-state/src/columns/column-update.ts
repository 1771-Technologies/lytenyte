import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";

export const columnUpdate = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
  update:
    | Record<string, Omit<ColumnCommunity<D, E>, "id">>
    | Record<string, Omit<ColumnEnterprise<D, E>, "id">>,
) => {
  api = api as ApiEnterprise<D, E>;
  c = c as ColumnEnterprise<D, E>;

  api.columnUpdateMany({ [c.id]: update });
};

export const columnUpdateMany = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  updates:
    | Record<string, Omit<ColumnCommunity<D, E>, "id">>
    | Record<string, Omit<ColumnEnterprise<D, E>, "id">>,
) => {
  api = api as ApiEnterprise<D, E>;
  updates = updates as Record<string, Omit<ColumnEnterprise<D, E>, "id">>;

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
