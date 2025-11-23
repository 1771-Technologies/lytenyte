"use client";

import "@1771technologies/lytenyte-pro/grid.css";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import type { Column, RowLayout } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";
import { BalanceCell, DurationCell, NumberCell } from "./components";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "job", width: 120 },
  { id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "balance", type: "number", cellRenderer: BalanceCell },
  { id: "education", groupPath: ["background"] },
  { id: "marital", groupPath: ["background"] },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number", cellRenderer: NumberCell },
  { id: "month" },
  { id: "duration", type: "number", cellRenderer: DurationCell },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function ColumnGroupExpansions() {
  const ds = useClientRowDataSource({
    data: bankDataSmall.slice(4),
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(2, 4),
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnBase: {
      width: 100,
    },
  });

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ height: 500 }}>
      <Grid.Root grid={grid}>
        <Grid.Viewport>
          <Grid.Header>
            {view.header.layout.map((row, i) => {
              return (
                <Grid.HeaderRow key={i} headerRowIndex={i}>
                  {row.map((c) => {
                    if (c.kind === "group") {
                      return (
                        <Grid.HeaderGroupCell
                          key={c.idOccurrence}
                          cell={c}
                          className="group flex items-center gap-2 px-2 capitalize"
                        >
                          <div>{c.groupPath.at(-1)}</div>
                        </Grid.HeaderGroupCell>
                      );
                    }

                    return (
                      <Grid.HeaderCell
                        key={c.id}
                        cell={c}
                        className="flex h-full w-full items-center px-2 text-sm capitalize"
                      />
                    );
                  })}
                </Grid.HeaderRow>
              );
            })}
          </Grid.Header>
          <Grid.RowsContainer>
            <RowSection rows={view.rows.top} section="top" />
            <RowSection rows={view.rows.center} section="center" />
            <RowSection rows={view.rows.bottom} section="bottom" />
          </Grid.RowsContainer>
        </Grid.Viewport>
      </Grid.Root>
    </div>
  );
}

function RowSection<D = any>({
  section,
  rows,
}: {
  rows: RowLayout<D>[];
  section: "top" | "center" | "bottom";
}) {
  const Section =
    section === "top" ? Grid.RowsTop : section === "bottom" ? Grid.RowsBottom : Grid.RowsCenter;

  return (
    <Section>
      {rows.map((row) => {
        if (row.kind === "full-width") return <Grid.RowFullWidth key={row.id} row={row} />;
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
    </Section>
  );
}
