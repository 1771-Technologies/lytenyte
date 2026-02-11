"use client";

import "./demo.css";
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import {
  CountryCell,
  CustomerRating,
  DateCell,
  DurationCell,
  NameCell,
  NumberCell,
  OverdueCell,
} from "./components.js";
import { useCallback, useMemo, useState } from "react";
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

export default function Clipboard() {
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
        return row.map((cell) => `${cell ?? ""}`).join("\t");
      })
      .join("\n");

    await navigator.clipboard.writeText(stringToCopy);
  }, [api, getFirstSelection]);

  const handleGridUpdate = useCallback(
    async (updates: unknown[][]) => {
      if (!api) return;
      if (!document.activeElement) return null;

      const position = api.positionFromElement(document.activeElement as HTMLElement);
      if (position?.kind !== "cell") return;

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
