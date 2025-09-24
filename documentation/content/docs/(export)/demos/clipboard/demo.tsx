"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useCallback, useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

export default function Clipboard() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    editCellMode: "cell",
    editClickActivator: "none",

    columnBase: {
      editable: true,
    },

    cellSelections: [{ rowStart: 2, rowEnd: 6, columnStart: 1, columnEnd: 3 }],
    cellSelectionMode: "range",
  });

  const view = grid.view.useValue();

  const getFirstSelection = useCallback(() => {
    return grid.state.cellSelections.get().at(0) ?? null;
  }, [grid]);

  const handleCopy = useCallback(async () => {
    const selectionToCopy = getFirstSelection();
    if (!selectionToCopy) return;

    const data = await grid.api.exportDataRect({
      dataRect: selectionToCopy,
    });

    const stringToCopy = data.data
      .map((row) => {
        return row.map((cell) => `${cell}`).join("\t");
      })
      .join("\n");

    await navigator.clipboard.writeText(stringToCopy);
  }, [grid, getFirstSelection]);

  const handleGridUpdate = useCallback(
    async (updates: unknown[][]) => {
      const rect = getFirstSelection();
      if (!rect) return;

      for (let rowI = rect.rowStart; rowI < rect.rowEnd; rowI++) {
        const row = grid.api.rowByIndex(rowI);
        if (!row?.data || grid.api.rowIsGroup(row)) continue;

        // Our selection rect is bigger than our updates (i.e. has more rows),
        // so we can stop early.
        if (rowI - rect.rowStart >= updates.length) break;

        for (let colI = rect.columnStart; colI < rect.columnEnd; colI++) {
          // Our selection has more columns than we are updating so we can skip.
          if (colI - rect.columnStart >= updates[rowI - rect.rowStart].length) break;

          grid.api.editUpdate({
            column: colI,
            rowIndex: rowI,
            value: updates[rowI - rect.rowStart][colI - rect.columnStart],
          });
        }
      }
    },
    [grid, getFirstSelection],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex gap-8 px-2 py-2">
        <button
          className="rounded border border-gray-600 bg-gray-900 px-2 text-white"
          onClick={async () => {
            await handleCopy();
            alert("Text copied to clipboard");
          }}
        >
          Copy
        </button>
        <button
          className="rounded border border-gray-600 bg-gray-900 px-2 text-white"
          onClick={async () => {
            const rect = getFirstSelection();
            if (!rect) return;

            await handleCopy();

            const updates: any[][] = [];
            for (let i = rect.rowStart; i < rect.rowEnd; i++) {
              const row: any[] = [];

              for (let j = rect.columnStart; j < rect.columnEnd; j++) row.push(null);
              updates.push(row);
            }

            handleGridUpdate(updates);

            alert("Text cut to clipboard");
          }}
        >
          Cut
        </button>
        <button
          className="rounded border border-gray-600 bg-gray-900 px-2 text-white"
          onClick={async () => {
            const content = await navigator.clipboard.readText();

            // If your data needs some parsing handle it here on via the editSetter on the column.
            const updates = content.split("\n").map((c) => {
              return c
                .trim()
                .split("\t")
                .map((x) => x.trim());
            });

            handleGridUpdate(updates);

            alert("Data pasted into the grid.");
          }}
        >
          Paste
        </button>
      </div>
      <div className="lng-grid" style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return null;

                      return (
                        <Grid.HeaderCell
                          key={c.id}
                          cell={c}
                          className="flex h-full w-full items-center px-2 capitalize"
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            className="flex h-full w-full items-center px-2 text-sm"
                          />
                        );
                      })}
                    </Grid.Row>
                  );
                })}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </div>
    </div>
  );
}
