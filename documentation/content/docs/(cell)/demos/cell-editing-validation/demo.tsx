"use client";

import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId, useState } from "react";

type BankData = (typeof bankDataSmall)[number];
const columns: Column<BankData>[] = [
  { id: "age", width: 100, type: "number" },
  { id: "job", width: 160 },
  { id: "balance", width: 160, type: "number" },
  { id: "education", width: 160 },
  { id: "marital" },
];

export default function CellEditingValidation() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnBase: {
      editable: true,
      widthFlex: 1,
    },

    editRowValidatorFn: (p) => {
      const data = p.data;
      if (data.age < 0) return { reason: "Age cannot be less than 0." };

      return true;
    },

    editCellMode: "cell",
    editClickActivator: "single",
  });

  const view = grid.view.useValue();

  const [error, setError] = useState<string>();

  return (
    <div>
      {error && <div className="px-2 py-1 text-red-500">Error: {error}</div>}
      <div className="lng-grid" style={{ height: 500 }}>
        <Grid.Root
          grid={grid}
          onEditError={(e) => {
            if (typeof e.validation === "object") setError(e.validation.reason);
          }}
          onEditEnd={() => {
            setError("");
          }}
        >
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
