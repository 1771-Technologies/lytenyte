"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useEffect, useId, useState } from "react";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  SwitchToggle,
  tw,
} from "./components";

const columns: Column<OrderData>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, widthFlex: 1 },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "customer", cellRenderer: AvatarCell, width: 180, widthFlex: 1 },
];

export default function ColumnBase() {
  const ds = useClientRowDataSource({ data: data });
  const [widthFlex, setWidthFlex] = useState(true);

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    rowHeight: 50,
  });

  const view = grid.view.useValue();

  useEffect(() => {
    grid.state.columns.set((prev) => {
      return [...prev].map((x) => {
        if (x.id === "product" || x.id === "customer") {
          return { ...x, widthFlex: widthFlex ? 1 : 0 };
        }
        return x;
      });
    });
  }, [grid.state.columns, widthFlex]);

  return (
    <>
      <div className="flex w-full border-b px-2 py-2">
        <SwitchToggle
          label="Toggle Width Flex"
          checked={widthFlex}
          onChange={() => {
            setWidthFlex((prev) => !prev);
          }}
        />
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
                          className={tw(
                            "flex h-full w-full items-center text-nowrap px-3 text-sm capitalize",
                            c.column.type === "number" && "justify-end",
                          )}
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
                            className="flex h-full w-full items-center px-3 text-sm"
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
    </>
  );
}
