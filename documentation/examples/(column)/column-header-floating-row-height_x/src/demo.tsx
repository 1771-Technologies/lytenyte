"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useEffect, useId, useState } from "react";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  FloatingFilter,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
  ToggleGroup,
  ToggleItem,
  tw,
} from "./components";

const columns: Column<OrderData>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, type: "string" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100 },
  { id: "customer", cellRenderer: AvatarCell, width: 180, type: "string" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 120 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, type: "string" },
];

export default function ColumnBase() {
  const ds = useClientRowDataSource({ data: data });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    rowHeight: 50,

    floatingRowEnabled: true,
    columnBase: {
      floatingCellRenderer: FloatingFilter,
    },
  });

  const view = grid.view.useValue();
  const [height, setHeight] = useState("medium");

  useEffect(() => {
    if (height === "small") grid.state.floatingRowHeight.set(24);
    if (height === "medium") grid.state.floatingRowHeight.set(40);
    if (height === "large") grid.state.floatingRowHeight.set(60);
  }, [grid.state.floatingRowHeight, height]);

  return (
    <div>
      <div className={tw("flex h-full items-center gap-1 text-nowrap border-b px-2 py-2")}>
        <div className={tw("text-light hidden text-xs font-medium md:block")}>
          Floating Row Height:
        </div>
        <ToggleGroup
          type="single"
          value={height}
          className={tw("flex flex-wrap")}
          onValueChange={(c) => {
            if (!c) return;
            setHeight(c);
          }}
        >
          <ToggleItem value="small">Small</ToggleItem>
          <ToggleItem value="medium">Medium</ToggleItem>
          <ToggleItem value="large">Large</ToggleItem>
        </ToggleGroup>
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
    </div>
  );
}
