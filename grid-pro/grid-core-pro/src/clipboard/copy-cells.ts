import type {
  ApiPro,
  CellSelectionRectPro,
  ClipboardCopyOptionsPro,
} from "@1771technologies/grid-types/pro";

export async function clipboardCopyCells<D, E>(
  api: ApiPro<D, E>,
  rect: CellSelectionRectPro | undefined | null,
  opts: ClipboardCopyOptionsPro<D, E> = {},
) {
  const s = api.getState();

  const selectedRects = s.cellSelections.peek();
  if (!rect && selectedRects.length !== 1) return;

  const r = rect ?? selectedRects[0];

  const transform = opts.transformCellValue ?? (({ field }) => String(field));

  const data: unknown[][] = [];
  for (let rowIndex = r.rowStart; rowIndex < r.rowEnd; rowIndex++) {
    const dataRow: unknown[] = [];
    const row = api.rowByIndex(rowIndex);
    for (let colIndex = r.columnStart; colIndex < r.columnEnd; colIndex++) {
      const column = api.columnByIndex(colIndex);
      if (!column || !row) {
        dataRow.push("");
        continue;
      }
      const field = api.columnField(row, column) ?? "";
      const transformed = transform({ api, row, column, field });

      dataRow.push(transformed);
    }
    data.push(dataRow);
  }

  if (opts.includeHeaders) {
    const dataRow: string[] = [];

    const transform = opts.transformHeader ?? (({ header }) => header);

    for (let colIndex = r.columnStart; colIndex < r.columnEnd; colIndex++) {
      const column = api.columnByIndex(colIndex);
      if (!column) {
        dataRow.push("");
        continue;
      }

      const header = column.headerName ?? column.id;
      const transformed = transform({ api, column, header });

      dataRow.push(transformed);
    }
    data.unshift(dataRow);
  }

  if (opts.includeHeaderGroups) {
    const hierarchy = s.columnGroupLevels.peek();

    const rows: string[][] = [];
    const transform = opts.transformHeaderGroup ?? (({ group }) => group);
    for (let levelIndex = 0; levelIndex < hierarchy.length; levelIndex++) {
      const level = hierarchy[levelIndex];

      const row: string[] = [];
      const seen = new Set();
      for (let colIndex = r.columnStart; colIndex < r.columnEnd; colIndex++) {
        const value = level[colIndex];

        if (!value || seen.has(value.occurrenceKey)) {
          row.push("");
          continue;
        }

        if (!opts.uniformHeaderGroupCopy) seen.add(value.occurrenceKey);

        const groupPath = value.id.split(s.columnGroupIdDelimiter.peek());
        const group = groupPath.at(-1)!;

        const columnsInGroup = s.columnsVisible.peek().slice(value.start, value.end);

        const transformed = transform({ api, group, groupPath, columnsInGroup });
        row.push(transformed);
      }
      rows.push(row);
    }

    data.unshift(...rows);
  }

  if (opts.transformCopy) {
    const item = opts.transformCopy({ api, data, rect: r });

    await navigator.clipboard.write(item);
  } else {
    const text = data.map((d) => d.join("\t")).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const clipboardItem = new ClipboardItem({
      "text/plain": blob, // Fallback for compatibility
    });
    await navigator.clipboard.write([clipboardItem]);
  }
}
