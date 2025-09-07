import { GROUP_COLUMN_PREFIX } from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types.js";
import type { InternalAtoms } from "../+types.js";

export const makeColumnUpdate = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["columnUpdate"] => {
  return (updates) => {
    const columns = [...grid.state.columns.get()];

    const groupColumns = grid.state.columnMeta
      .get()
      .columnsVisible.filter((c) => c.id.startsWith(GROUP_COLUMN_PREFIX));

    const groupState = { ...grid.internal.rowGroupColumnState.get() };

    for (let i = 0; i < groupColumns.length; i++) {
      const column = groupColumns[i];

      if (updates[column.id]) {
        const next = { ...groupState[column.id], ...updates[column.id] };
        groupState[column.id] = next;
      }
    }

    grid.internal.rowGroupColumnState.set(groupState);

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (updates[column.id]) {
        const next = { ...column, ...updates[column.id] };
        columns[i] = next;
      }
    }

    grid.state.columns.set(columns);
  };
};
