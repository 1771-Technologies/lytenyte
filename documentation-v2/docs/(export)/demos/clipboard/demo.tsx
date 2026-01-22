"use client";

import "./demo.css";
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { BalanceCell, DurationCell, NumberCell } from "./components.js";
import { useCallback, useMemo, useState } from "react";

type BankData = (typeof bankDataSmall)[number];
export interface GridSpec {
  readonly data: BankData;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120 },
  { name: "Age", id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: BalanceCell },
  { name: "Education", id: "education" },
  { name: "Marital", id: "marital" },
  { name: "Default", id: "default" },
  { name: "Housing", id: "housing" },
  { name: "Loan", id: "loan" },
  { name: "Contact", id: "contact" },
  { name: "Day", id: "day", type: "number", cellRenderer: NumberCell },
  { name: "Month", id: "month" },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
];

const base = { width: 100 };

export default function Clipboard() {
  const [data, setData] = useState(bankDataSmall);
  const ds = useClientDataSource({
    data: data,
    onRowDataChange: (p) => {
      setData((prev) => {
        const next = [...prev];
        p.center.forEach((v, i) => {
          next[i] = v as BankData;
        });

        return next;
      });
    },
  });
  const [selections, setSelections] = useState<Grid.T.DataRect[]>([
    { rowStart: 2, rowEnd: 6, columnStart: 1, columnEnd: 3 },
  ]);

  const [api, setApi] = useState<Grid.API<GridSpec> | null>(null);

  const getFirstSelection = useCallback(() => {
    return selections.at(0) ?? null;
  }, [selections]);

  const handleCopy = useCallback(async () => {
    if (!api) return;

    const selectionToCopy = getFirstSelection();
    if (!selectionToCopy) return;

    const data = await api.exportData({
      rect: selectionToCopy,
    });

    const stringToCopy = data.data
      .map((row) => {
        return row.map((cell) => `${cell}`).join("\t");
      })
      .join("\n");

    await navigator.clipboard.writeText(stringToCopy);
  }, [api, getFirstSelection]);

  const handleGridUpdate = useCallback(
    async (updates: unknown[][]) => {
      if (!api) return;

      const rect = getFirstSelection();
      if (!rect) return;

      const map = new Map<number, { column: number; value: any }[]>();

      for (let rowI = rect.rowStart; rowI < rect.rowEnd; rowI++) {
        const row = api.rowByIndex(rowI).get();
        if (!row?.data || api.rowIsGroup(row)) continue;

        // Our selection rect is bigger than our updates (i.e. has more rows),
        // so we can stop early.
        if (rowI - rect.rowStart >= updates.length) break;

        const columnUpdates: { column: number; value: any }[] = [];

        for (let colI = rect.columnStart; colI < rect.columnEnd; colI++) {
          // Our selection has more columns than we are updating so we can skip.
          if (colI - rect.columnStart >= updates[rowI - rect.rowStart].length) break;

          columnUpdates.push({ column: colI, value: updates[rowI - rect.rowStart][colI - rect.columnStart] });
        }

        map.set(rowI, columnUpdates);
      }

      if (!api.editUpdateCells(map)) alert("Copy operation failed");
    },
    [api, getFirstSelection],
  );

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        events={useMemo<Grid.Events<GridSpec>>(() => {
          return {
            viewport: {
              keyDown: async (p) => {
                if (!p.event.ctrlKey && !p.event.metaKey) return;

                if (p.event.key === "x") {
                  const rect = getFirstSelection();
                  if (!rect) return;

                  await handleCopy();

                  const updates: any[][] = [];
                  for (let i = rect.rowStart; i < rect.rowEnd; i++) {
                    const row: any[] = [];

                    for (let j = rect.columnStart; j < rect.columnEnd; j++) row.push(null);
                    updates.push(row);
                  }

                  p.viewport.classList.add("copy-flash");

                  handleGridUpdate(updates);

                  setTimeout(() => p.viewport.classList.remove("copy-flash"), 500);
                } else if (p.event.key === "v") {
                  const content = await navigator.clipboard.readText();

                  // If your data needs some parsing handle it here on via the editSetter on the column.
                  const updates = content.split("\n").map((c) => {
                    return c
                      .trim()
                      .split("\t")
                      .map((x) => x.trim());
                  });

                  handleGridUpdate(updates);
                } else if (p.event.key === "c") {
                  p.viewport.classList.add("copy-flash");
                  await handleCopy();
                  setTimeout(() => p.viewport.classList.remove("copy-flash"), 500);
                }
              },
            },
          };
        }, [getFirstSelection, handleCopy, handleGridUpdate])}
        ref={setApi}
        columnBase={base}
        columns={columns}
        editMode="cell"
        rowSource={ds}
        cellSelections={selections}
        onCellSelectionChange={setSelections}
        cellSelectionMode="range"
      />
    </div>
  );
}
