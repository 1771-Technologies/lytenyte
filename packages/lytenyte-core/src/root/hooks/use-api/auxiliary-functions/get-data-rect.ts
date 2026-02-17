import {
  COLUMN_MARKER_ID,
  computePathMatrix,
  GROUP_COLUMN_PREFIX,
  type ColumnAbstract,
  type RowNode,
} from "@1771technologies/lytenyte-shared";
import type { ExportDataRectResult } from "../../../../types/api.js";

export interface GetDataRectArgs {
  readonly columnStart: number;
  readonly columnEnd: number;
  readonly rows: (RowNode<any> | null | undefined)[];
  readonly visible: ColumnAbstract[];

  readonly columnField: (c: ColumnAbstract, row: { kind: string; data: unknown }) => unknown;
}

export function getDataRect({
  rows,
  columnStart,
  columnEnd,
  visible,
  columnField,
}: GetDataRectArgs): ExportDataRectResult<any> {
  const data: unknown[][] = [];

  const columns: ColumnAbstract[] = [];

  for (let i = columnStart; i < columnEnd && i < visible.length; i++) {
    const column = visible[i];
    if (column.id === COLUMN_MARKER_ID) continue;

    columns.push(column as any);
  }

  const hierarchy = computePathMatrix(visible);

  const groupRows = hierarchy.at(0)?.length ?? 0;
  const groupHeaders: (string | null)[][] = [];

  for (let i = 0; i < groupRows; i++) {
    const row = hierarchy.map((x) => x[i]?.id ?? null);
    groupHeaders.push(row);
  }

  for (let levelIndex = 0; levelIndex < hierarchy.length; levelIndex++) {
    const level = hierarchy[levelIndex];

    const header: (string | null)[] = [];
    for (let i = 0; i < columns.length; i++) {
      const value = level[i];

      if (!value) {
        header.push(null);
        continue;
      }

      const group = value.groupPath.at(-1)!;

      header.push(group);
    }
  }

  let headers: string[] = [];
  headers = [];
  for (const v of columns) {
    headers.push(v.name ?? v.id);
  }

  for (const row of Object.values(rows)) {
    const dataForRow = [];
    for (const column of columns) {
      let field;

      if (!row) {
        field = null;
      } else if (column.id.startsWith(GROUP_COLUMN_PREFIX)) {
        if (row.kind === "branch") field = row.key;
        else field = "";
      } else {
        field = columnField(column, { kind: row.kind, data: row.data });
      }

      dataForRow.push(field);
    }

    data.push(dataForRow);
  }

  return {
    data,
    groupHeaders,
    columns,
    headers,
  };
}
