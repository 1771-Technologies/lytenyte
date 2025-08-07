import {
  COLUMN_MARKER_ID,
  computePathMatrix,
  GROUP_COLUMN_PREFIX,
} from "@1771technologies/lytenyte-shared";
import type { Column, ExportDataRectResult, RowNode } from "../../+types";

export interface GetDataRectArgs {
  readonly columnStart: number;
  readonly columnEnd: number;
  readonly rows: (RowNode<any> | null | undefined)[];
  readonly uniformGroupHeaders?: boolean;
  readonly visible: Column<any>[];

  readonly columnField: (c: Column<any>, row: { kind: string; data: unknown }) => unknown;
}

export function getDataRect({
  rows,
  columnStart,
  columnEnd,
  uniformGroupHeaders,
  visible,
  columnField,
}: GetDataRectArgs): ExportDataRectResult<any> {
  const data: unknown[][] = [];

  const columns: Column<any>[] = [];

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
