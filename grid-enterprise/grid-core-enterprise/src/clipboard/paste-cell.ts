import type { ApiEnterprise } from "@1771technologies/grid-types";
import type {
  CellSelectionRect,
  ClipboardTransformPasteParams,
} from "@1771technologies/grid-types/enterprise";

export async function clipboardPasteCells<D, E>(
  api: ApiEnterprise<D, E>,
  rect: CellSelectionRect | undefined | null,
) {
  const sx = api.getState();

  const selectedRects = sx.cellSelections.peek();
  if (!rect && selectedRects.length !== 1) return;

  const r = rect ?? selectedRects[0];

  const clipboard = await navigator.clipboard.read();

  const transformer = sx.clipboardTransformPaste.peek() ?? defaultTransformer;

  const result = await transformer({ api, rect: r, clipboard });

  const dataUpdates: Record<string, D> = {};
  for (let i = 0; i < result.length; i++) {
    const row = api.rowByIndex(i + r.rowStart);
    if (!row) continue;

    const data = structuredClone(row.data);
    dataUpdates[row.id] = data as D;
    for (let j = 0; j < result[i].length; j++) {
      const column = api.columnByIndex(j + r.columnStart);
      if (!column) continue;
      const updater = column.cellEditRowUpdater ?? sx.columnBase.peek().cellEditRowUpdater;

      if (updater) updater({ api, column, row, value: null });
      if (!api.rowIsLeaf(row)) continue;

      const fieldKey = column.field ?? column.id;
      if (typeof fieldKey === "string" || typeof fieldKey === "number") {
        // @ts-expect-error this is fine more or less
        data[fieldKey] = result[i][j];
      }
    }
  }

  api.rowSetDataMany(dataUpdates);
}

async function defaultTransformer<D, E>({
  api,
  rect,
  clipboard,
}: ClipboardTransformPasteParams<ApiEnterprise<D, E>>) {
  const sx = api.getState();

  const textBlob = await clipboard[0].getType("text/plain");
  const data = (await textBlob.text())
    .trim()
    .split("\n")
    .map((c) => c.trim().split("\t"));

  const visibleColumns = sx.columnsVisible.peek();

  const parseTypes = visibleColumns.map((c) => c.type ?? "string");

  return data.map((row) => {
    return row.map((r, i) => {
      const columnIndex = i + rect.columnStart;

      const type = parseTypes[columnIndex];
      if (type === "number") {
        return Number.parseFloat(r);
      }
      if (type === "date") {
        return new Date(r).toISOString();
      }
      return r;
    });
  });
}
