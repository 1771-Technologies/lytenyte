# Export

LyteNyte Grid exports data via `api.exportData()`. This returns a structured snapshot of grid data that you transform into any format. No built-in file format is included — you supply the serialization.

**Step-by-step export pattern:**

1. Get a ref to the grid API: `const ref = useRef<Grid.API | null>(null)` + `<Grid ref={ref} />`
2. In a button handler: `const rect = await ref.current!.exportData()`
3. Transform `rect.data` (2D array, row-major) into your target format
4. Use the `downloadBlob` utility below to trigger a file download

`exportData()` reflects the **current filtered/sorted view** — hidden columns are excluded, grouped rows are included at their visual positions.

## The `exportData` API

```ts
// Export entire grid
const rect = await api.exportData();

// Export a specific rectangle (exclusive end)
const rect = await api.exportData({
  rect: { rowStart: 0, rowEnd: 50, columnStart: 0, columnEnd: 5 },
});
```

Returns `Promise<ExportDataRectResult>`:

```ts
interface ExportDataRectResult<Spec extends GridSpec = GridSpec> {
  readonly headers: string[]; // column display names
  readonly groupHeaders: (string | null)[][]; // column group names (one array per group row)
  readonly data: unknown[][]; // row-major data matrix
  readonly columns: Column<Spec>[]; // column definitions
}
```

- `data[rowIndex][colIndex]` — the cell value at that position
- `data.length` — number of exported rows
- `columns.length` — number of exported columns

## CSV Export

```tsx
const ref = useRef<Grid.API | null>(null);

// ...
<Grid ref={ref} ... />

// Export button handler:
async function downloadCSV() {
  const rect = await ref.current!.exportData();

  const rows: string[] = [
    rect.columns.map(c => c.name ?? c.id).join(","),
  ];

  for (const rowData of rect.data) {
    rows.push(
      rowData.map(cell =>
        typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : String(cell ?? "")
      ).join(",")
    );
  }

  downloadBlob(new Blob([rows.join("\n")], { type: "text/csv" }), "data.csv");
}
```

For production: use [csv-stringify](https://csv.js.org/stringify/) or similar library to handle all edge cases.

## Excel Export (ExcelJS)

```bash
npm install exceljs
```

```ts
import ExcelJS from "exceljs";

async function downloadExcel(api: Grid.API) {
  const rect = await api.exportData();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");

  // Headers
  sheet.addRow(rect.columns.map((c) => c.name ?? c.id));

  // Data rows
  for (const rowData of rect.data) {
    sheet.addRow(rowData as any[]);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    "data.xlsx",
  );
}
```

## Parquet Export

```bash
npm install hyparquet-writer
```

```ts
import { parquetWriteBuffer, type ColumnSource } from "hyparquet-writer";

async function downloadParquet(api: Grid.API) {
  const rect = await api.exportData();

  // Build columnar format
  const columns = Object.fromEntries(
    rect.columns.map((c) => [c.id, { name: c.id, data: [] as unknown[] } satisfies ColumnSource]),
  );

  for (let i = 0; i < rect.data.length; i++) {
    for (let j = 0; j < rect.columns.length; j++) {
      columns[rect.columns[j].id].data.push(rect.data[i][j]);
    }
  }

  const buffer = parquetWriteBuffer({ columnData: Object.values(columns) });
  downloadBlob(new Blob([buffer], { type: "application/octet-stream" }), "data.parquet");
}
```

## Arrow Export

```bash
npm install apache-arrow
```

```ts
import { tableFromArrays, tableToIPC } from "apache-arrow";

async function downloadArrow(api: Grid.API) {
  const rect = await api.exportData();

  const columns = Object.fromEntries(rect.columns.map((c) => [c.id, [] as unknown[]]));
  for (let i = 0; i < rect.data.length; i++) {
    for (let j = 0; j < rect.columns.length; j++) {
      columns[rect.columns[j].id].push(rect.data[i][j]);
    }
  }

  const table = new Uint8Array(tableToIPC(tableFromArrays(columns as any), "file"));
  downloadBlob(new Blob([table], { type: "application/vnd.apache.arrow.file" }), "data.arrow");
}
```

## Clipboard Copy/Paste (requires cell selection)

```ts
// Copy selected cells to clipboard
const handleCopy = async () => {
  const selection = getFirstSelection(); // your cell selection state
  const rect = await api.exportData({ rect: selection });

  const text = rect.data.map((row) => row.map((cell) => `${cell}`).join("\t")).join("\n");

  await navigator.clipboard.writeText(text);
};

// Paste from clipboard into grid
const handlePaste = async () => {
  const text = await navigator.clipboard.readText();
  const rows = text.split("\n").map((r) => r.split("\t"));

  const position = api.positionFromElement(document.activeElement as HTMLElement);
  if (position?.kind !== "cell") return;

  const map = new Map<number, { column: number; value: unknown }[]>();

  rows.forEach((rowData, i) => {
    const rowIndex = i + position.rowIndex;
    const updates = rowData.map((value, j) => ({
      column: j + position.colIndex,
      value,
    }));
    map.set(rowIndex, updates);
  });

  // Validate before calling in production!
  api.editUpdateCells(map);
};
```

> Always treat clipboard data as untrusted input — validate with Zod before writing to rows.

## Gotchas

- **`exportData()` reflects the current filtered/sorted/grouped view** — it exports what the user sees, not the full raw dataset. To export all data, remove filters first or call `exportData` with an explicit `rect` covering all rows.
- **Group rows appear in `data` when grouping is active** — the matrix includes group/aggregated rows at their visual positions. Check `columns` to understand what is at each column index; group rows may have `null` for non-aggregated columns.
- **Clipboard paste: always validate before writing** — `navigator.clipboard.readText()` returns a plain string from any source. Use Zod or manual type checks before calling `api.editUpdateCells`. Malicious paste content can overwrite arbitrary cells.
- **`exportData` is async** — it returns a `Promise`. Always `await` it; the grid may need to compute aggregations before the result is ready.

## Utility: downloadBlob

```ts
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

## Full Docs

- [Export Overview](/docs/export-overview)
- [CSV Export](/docs/export-csv)
- [Excel Export](/docs/export-excel)
- [Parquet Export](/docs/export-parquet)
- [Arrow Export](/docs/export-arrow)
- [Clipboard](/docs/export-clipboard)
