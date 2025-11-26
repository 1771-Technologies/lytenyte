"use client";

import "@1771technologies/lytenyte-pro/grid.css";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import type { Column, RowLayout } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";
import { BalanceCell, DurationCell, NumberCell } from "./components";

const [under30, under50, over50] = Object.values(
  Object.groupBy(
    bankDataSmall.toSorted((l, r) => l.age - r.age),
    (r) => {
      if (r.age < 30) return "Under 30";
      if (r.age < 50) return "Under 50";
      return "Over 50";
    },
  ),
);

type BankData = (typeof bankDataSmall)[number];
const finalData = [
  { id: "full-width", label: "Under 30 Years Old" } as unknown as BankData,
  ...under30,
  { id: "full-width", label: "Between 30 and 50 Years Old" } as unknown as BankData,
  ...under50,
  { id: "full-width", label: "Over 50 Years Old" } as unknown as BankData,
  ...over50,
];

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
    data: finalData,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(2, 4),
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    rowFullWidthPredicate: (r) =>
      Boolean(r.row.data && "id" in r.row.data && r.row.data.id === "full-width"),
    rowFullWidthRenderer: (r) => {
      const data = r.row.data as { label: string };

      return (
        <div className="text-ln-gray-70 border-ln-gray-20 flex h-full w-full items-center justify-center border-b font-bold">
          {data.label}
        </div>
      );
    },

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
                          className="group flex items-center justify-center gap-2 px-2 capitalize"
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
                        style={{
                          justifyContent: c.column.type === "number" ? "flex-end" : "flex-start",
                        }}
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
        if (row.kind === "full-width")
          return <Grid.RowFullWidth style={{ borderBottom: 0 }} key={row.id} row={row} />;
        return (
          <Grid.Row row={row} key={row.id}>
            {row.cells.map((c) => {
              return (
                <Grid.Cell
                  key={c.id}
                  cell={c}
                  className="flex h-full w-full items-center px-2 text-sm"
                  style={{
                    justifyContent: c.column.type === "number" ? "flex-end" : "flex-start",
                  }}
                />
              );
            })}
          </Grid.Row>
        );
      })}
    </Section>
  );
}
