//#start
import "@1771technologies/lytenyte-pro-experimental/grid-full.css";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
} from "./components.jsx";
import { useClientDataSource, Grid, ViewportShadows } from "@1771technologies/lytenyte-pro-experimental";
import { ThemePicker } from "./theme.jsx";
import { useState } from "react";
import styled from "@emotion/styled";

export interface GridSpec {
  readonly data: OrderData;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email" },
];
//#end

//!next 8
const Cell = styled(Grid.Cell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  color: gray;
  font-size: 14px;
  border-bottom: 1px solid light-dark(rgb(197, 196, 196), rgb(56, 32, 32));
`;

//!next 9
const HeaderCell = styled(Grid.HeaderCell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(cyan, rgb(2, 2, 52));
  color: light-dark(black, white);
  text-transform: capitalize;
  font-size: 14px;
`;

export default function ColumnBase() {
  const ds = useClientDataSource({ data: data });
  const [theme, setTheme] = useState("ln-dark");

  return (
    <div
      className={theme}
      style={{ colorScheme: theme.includes("light") || theme === "ln-cotton-candy" ? "light" : "dark" }}
    >
      <div className="bg-ln-gray-00 border-b-ln-border h-full w-full border-b py-2">
        <ThemePicker theme={theme} setTheme={setTheme} />
      </div>
      <div className={"ln-grid"} style={{ height: 500 }}>
        <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows}>
          <Grid.Viewport>
            <Grid.Header>
              {(cells) => {
                return (
                  <Grid.HeaderRow>
                    {cells.map((cell) => {
                      if (cell.kind === "group") return null;

                      return <HeaderCell key={cell.id} cell={cell} />; //!
                    })}
                  </Grid.HeaderRow>
                );
              }}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {(row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row}>
                      {row.cells.map((cell) => {
                        return <Cell cell={cell} key={cell.id} />; //!
                      })}
                    </Grid.Row>
                  );
                }}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid>
      </div>
    </div>
  );
}
