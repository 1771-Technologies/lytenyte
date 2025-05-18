import type { ApiCore, ColumnCore, RowNodeCore } from "@1771technologies/grid-types/core";
import type {
  ApiPro,
  DataRectResultPro,
  ExportTransformDataRowPro,
} from "@1771technologies/grid-types/pro";

export interface GetDataRectArgs<D, E> {
  readonly columnStart: number;
  readonly columnEnd: number;
  readonly rows: Record<number, RowNodeCore<D>>;
  readonly api: ApiPro<D, E> | ApiCore<D, E>;
  readonly uniformGroupHeaders?: boolean;
  readonly transform?: ExportTransformDataRowPro<D, E>;
}

export function getDataRect<D, E>({
  rows,
  columnStart,
  columnEnd,
  api,
  uniformGroupHeaders,
  transform,
}: GetDataRectArgs<D, E>): DataRectResultPro<D, E> {
  const s = api.getState();

  const visible = s.columnsVisible.peek();

  const data: unknown[][] = [];

  const columns: ColumnCore<D, E>[] = [];

  for (let i = columnStart; i < columnEnd && i < visible.length; i++) {
    const column = visible[i];
    if (api.columnIsGridGenerated(column as any)) continue;

    columns.push(column as any);
  }

  const groupHeaders: (string | null)[][] = [];
  const hierarchy = s.columnGroupLevels.peek();

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
      if (seen.has(value.occurrenceKey)) {
        header.push("");
        continue;
      }

      if (!uniformGroupHeaders) seen.add(value.occurrenceKey);

      const groupPath = value.id.split(s.columnGroupIdDelimiter.peek());
      const group = groupPath.at(-1)!;

      header.push(group);
    }
    groupHeaders.push(header);
  }

  let header: string[] = [];
  header = [];
  for (const v of columns) {
    header.push(v.headerName ?? v.id);
  }

  for (const row of Object.values(rows)) {
    let dataForRow = [];
    for (const column of columns) {
      let field;
      if (api.columnIsGroupAutoColumn(column as any)) {
        if (api.rowIsGroup(row)) field = row.pathKey;
        else field = "";
      } else {
        field = api.columnField(row, column as any);
      }

      dataForRow.push(field);
    }
    if (transform)
      dataForRow = transform({ api: api as any, columns: columns as any, data: dataForRow });

    data.push(dataForRow);
  }

  return {
    data,
    groupHeaders,
    header,
    columns: columns as any,
  };
}
