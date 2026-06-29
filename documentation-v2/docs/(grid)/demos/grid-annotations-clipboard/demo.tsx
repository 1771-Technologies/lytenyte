"use client";

import "./demo.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  CountryCell,
  CustomerRating,
  DateCell,
  DurationCell,
  NameCell,
  NumberCell,
  OverdueCell,
} from "./components.js";
import { useCallback, useMemo, useRef, useState } from "react";

function MarchingAnts() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="none"
        stroke="var(--ln-primary-50)"
        strokeWidth="2"
        strokeDasharray="8 5"
        className="ln-marching-ants"
      />
    </svg>
  );
}
import { loanData, type LoanDataItem } from "@1771technologies/grid-sample-data/loan-data";

export interface GridSpec {
  readonly data: LoanDataItem;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Name", id: "name", cellRenderer: NameCell, width: 130 },
  { name: "Country", id: "country", width: 150, cellRenderer: CountryCell },
  { name: "Loan Amount", id: "loanAmount", width: 120, type: "number", cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: NumberCell },
  { name: "Customer Rating", id: "customerRating", type: "number", width: 125, cellRenderer: CustomerRating },
  { name: "Marital", id: "marital" },
  { name: "Education", id: "education", hide: true },
  { name: "Job", id: "job", width: 120, hide: true },
  { name: "Overdue", id: "overdue", cellRenderer: OverdueCell },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
  { name: "Date", id: "date", width: 110, cellRenderer: DateCell },
  { name: "Age", id: "age", width: 80, type: "number" },
  { name: "Contact", id: "contact" },
];

const base: Grid.ColumnBase<GridSpec> = {
  width: 100,
  cellRenderer: (p) => {
    const field = p.api.columnField(p.column, p.row);

    if (field == null) return "";

    return String(field);
  },
};

export default function ExportDemo() {
  const [data, setData] = useState(loanData);
  const ds = useClientDataSource({
    data: data,
    onRowDataChange: (p) => {
      setData((prev) => {
        const next = [...prev];
        p.center.forEach((v, i) => {
          next[i] = v as LoanDataItem;
        });

        return next;
      });
    },
  });
  const [selections, setSelections] = useState<Grid.T.DataRect[]>([]);
  const [copiedRect, setCopiedRect] = useState<Grid.T.DataRect | null>(null);
  // Non-null when the last copy was a cut — cleared after a paste so source cells are nulled.
  const cutRectRef = useRef<Grid.T.DataRect | null>(null);
  // The exact text written to the clipboard by this grid. Used to detect if the user
  // copied something else externally before pasting back in.
  const copiedTextRef = useRef<string | null>(null);

  const [api, setApi] = useState<Grid.API<GridSpec> | null>(null);
  const apiRef = useRef(api);
  apiRef.current = api;

  const getFirstSelection = useCallback(() => {
    return selections.at(0) ?? null;
  }, [selections]);

  const handleCopy = useCallback(async (): Promise<string | null> => {
    if (!api) return null;

    const selectionToCopy = getFirstSelection();
    if (!selectionToCopy) return null;

    const data = await api.exportData({
      rect: selectionToCopy,
    });

    const stringToCopy = data.data
      .map((row) => {
        return row.map((cell) => `${cell ?? ""}`).join("\t");
      })
      .join("\n");

    await navigator.clipboard.writeText(stringToCopy);
    return stringToCopy;
  }, [api, getFirstSelection]);

  const handleGridUpdate = useCallback(
    async (updates: unknown[][]) => {
      if (!api) return;
      if (!document.activeElement) return null;

      const position = api.positionFromElement(document.activeElement as HTMLElement);
      if (position?.kind !== "cell") return;

      // Repeat paste for excel like behavior
      const selection = api.cellSelections().at(-1);
      let repeat: Repeat | null = null;
      if (selection) {
        const xDiff = selection.columnEnd - selection.columnStart;
        const yDiff = selection.rowEnd - selection.rowStart;

        const columnLengths = updates.map((x) => x.length);

        const allTheSameLength = columnLengths.every((x) => x === columnLengths[0]);

        if (allTheSameLength)
          repeat = rectRepeat({ cols: columnLengths[0], rows: updates.length }, { cols: xDiff, rows: yDiff });
      }
      if (repeat) {
        for (let r = 0; r < updates.length; r++) {
          const row = updates[r];
          const newRow = [];
          for (let i = 0; i < repeat.x; i++) newRow.push(...row);

          updates[r] = newRow;
        }

        const final = [];
        for (let i = 0; i < repeat.y; i++) final.push(...updates);

        updates = final;
      }

      const map = new Map<number, { column: number; value: any }[]>();

      for (let i = 0; i < updates.length; i++) {
        const rowI = i + position.rowIndex;
        const row = api.rowByIndex(rowI).get();

        if (!row?.data || api.rowIsGroup(row)) continue;

        const data = updates[i];

        const columnUpdates: { column: number; value: any }[] = [];

        for (let j = 0; j < data.length; j++) {
          const colI = j + position.colIndex;

          console.log(position.colIndex);
          const column = api.columnByIndex(colI);
          if (!column) continue;

          const rawValue = data[j];

          let value = column.type === "number" ? Number.parseFloat(rawValue as string) : rawValue;
          if (column.type === "number" && Number.isNaN(value)) value = rawValue;

          columnUpdates.push({ column: colI, value: value });
        }
        map.set(rowI, columnUpdates);
      }

      if (!api.editUpdateCells(map)) alert("Copy operation failed");
    },
    [api],
  );

  const annotations = useMemo<Grid.Annotation<GridSpec>[]>(() => {
    if (!copiedRect) return [];
    return [
      {
        id: "marching-ants",
        anchor: {
          kind: "range",
          rowStart: copiedRect.rowStart,
          rowEnd: copiedRect.rowEnd,
          colStart: copiedRect.columnStart,
          colEnd: copiedRect.columnEnd,
        },
        render: () => <MarchingAnts />,
      },
    ];
  }, [copiedRect]);

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        events={useMemo<Grid.Events<GridSpec>>(() => {
          return {
            viewport: {
              keyDown: async (p) => {
                if (p.event.key === "Escape") {
                  cutRectRef.current = null;
                  copiedTextRef.current = null;
                  setCopiedRect(null);
                  return;
                }

                if (!p.event.ctrlKey && !p.event.metaKey) return;

                if (p.event.key === "x") {
                  const sel = getFirstSelection();
                  if (!sel) return;
                  const text = await handleCopy();
                  copiedTextRef.current = text;
                  cutRectRef.current = sel;
                  setCopiedRect(sel);
                  setSelections([]);
                } else if (p.event.key === "v") {
                  const content = await navigator.clipboard.readText();
                  const sameContent = content === copiedTextRef.current;
                  const cut = cutRectRef.current;

                  // If the clipboard changed since we copied, clear ants but skip source clear.
                  if (!sameContent || cut) {
                    cutRectRef.current = null;
                    copiedTextRef.current = null;
                    setCopiedRect(null);
                  }

                  // If it was a cut and clipboard still has our content, null out source cells.
                  if (sameContent && cut && apiRef.current) {
                    const clearMap = new Map<number, { column: number; value: any }[]>();
                    for (let r = cut.rowStart; r < cut.rowEnd; r++) {
                      const cols = [];
                      for (let c = cut.columnStart; c < cut.columnEnd; c++) {
                        cols.push({ column: c, value: null });
                      }
                      clearMap.set(r, cols);
                    }
                    apiRef.current.editUpdateCells(clearMap);
                  }

                  // If your data needs some parsing handle it here or via the editSetter on the column.
                  const updates = content.split("\n").map((c) => {
                    return c
                      .trim()
                      .split("\t")
                      .map((x) => x.trim());
                  });
                  handleGridUpdate(updates);
                } else if (p.event.key === "c") {
                  const sel = getFirstSelection();
                  if (!sel) return;
                  const text = await handleCopy();
                  copiedTextRef.current = text;
                  cutRectRef.current = null;
                  setCopiedRect(sel);
                  setSelections([]);
                }
              },
              blur: ({ viewport }) => {
                setTimeout(() => {
                  if (!document.hasFocus()) return; // switched apps — keep ants
                  if (document.activeElement && viewport.contains(document.activeElement)) return; // focus came back into grid
                  cutRectRef.current = null;
                  copiedTextRef.current = null;
                  setCopiedRect(null);
                }, 0);
              },
            },
          };
        }, [getFirstSelection, handleCopy, handleGridUpdate, setSelections])}
        ref={setApi}
        columnBase={base}
        columns={columns}
        editMode="cell"
        rowSource={ds}
        annotations={annotations}
        cellSelections={selections}
        onCellSelectionChange={setSelections}
        cellSelectionMode="range"
      />
    </div>
  );
}
type Rect = { rows: number; cols: number };
type Repeat = { x: number; y: number };

function rectRepeat(small: Rect, big: Rect): Repeat | null {
  const sr = small.rows;
  const sc = small.cols;
  const br = big.rows;
  const bc = big.cols;

  // Basic validation (optional but handy)
  if (![sr, sc, br, bc].every(Number.isInteger)) return null;
  if (sr <= 0 || sc <= 0 || br <= 0 || bc <= 0) return null;

  // Must divide evenly for a perfect tiling
  if (br % sr !== 0) return null;
  if (bc % sc !== 0) return null;

  return { x: bc / sc, y: br / sr };
}
