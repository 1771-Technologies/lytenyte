import {
  COLUMN_MARKER_ID,
  computePathMatrix,
  GROUP_COLUMN_PREFIX,
  type ColumnAbstract,
  type RowNode,
} from "@1771technologies/lytenyte-shared";
import type { Root } from "../../root";

export interface GetDataRectArgs {
  readonly columnStart: number;
  readonly columnEnd: number;
  readonly rows: (RowNode<any> | null | undefined)[];
  readonly uniformGroupHeaders?: boolean;
  readonly visible: ColumnAbstract[];

  readonly columnField: (c: ColumnAbstract, row: { kind: string; data: unknown }) => unknown;
}

export function getDataRect({
  rows,
  columnStart,
  columnEnd,
  uniformGroupHeaders,
  visible,
  columnField,
}: GetDataRectArgs): Root.ExportDataRectResult<any> {
  const data: unknown[][] = [];

  const columns: ColumnAbstract[] = [];

  for (let i = columnStart; i < columnEnd && i < visible.length; i++) {
    const column = visible[i];
    if (column.id === COLUMN_MARKER_ID) continue;

    columns.push(column as any);
  }

  const groupHeaders: (string | null)[][] = [];

  const hierarchy = computePathMatrix(visible);

  for (let levelIndex = 0; levelIndex < hierarchy.length; levelIndex++) {
    const level = hierarchy[levelIndex];

    const seen = new Set();
    const header: (string | null)[] = [];
    for (let i = 0; i < columns.length; i++) {
      const value = level[i];

      if (!value) {
        header.push(null);
        continue;
      }
      if (seen.has(value.idOccurrence)) {
        header.push("");
        continue;
      }

      if (!uniformGroupHeaders) seen.add(value.idOccurrence);

      const group = value.groupPath.at(-1)!;

      header.push(group);
    }
    groupHeaders.push(header);
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
