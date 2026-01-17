//#start
import styles from "./demo.module.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
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
//#end

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

export default function ColumnBase() {
  const ds = useClientDataSource({ data: data });
  const [theme, setTheme] = useState("ln-dark");

  const [selections, setSelections] = useState<Grid.T.DataRect[]>([
    { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
  ]);

  return (
    <div>
      <div className="bg-ln-gray-00 border-b-ln-border h-full w-full border-b py-2">
        <ThemePicker theme={theme} setTheme={setTheme} />
      </div>
      <div
        className={"ln-grid " + theme}
        style={{
          height: 500,
          colorScheme: theme.includes("light") || theme === "ln-cotton-candy" ? "light" : "dark",
        }}
      >
        <Grid
          rowHeight={50}
          columns={columns}
          rowSource={ds}
          slotShadows={ViewportShadows}
          cellSelections={selections}
          onCellSelectionChange={setSelections}
          cellSelectionMode="range"
        >
          <Grid.Viewport>
            <Grid.Header>
              {(cells) => {
                return (
                  <Grid.HeaderRow>
                    {cells.map((cell) => {
                      if (cell.kind === "group") return null;

                      return <Grid.HeaderCell key={cell.id} cell={cell} className={styles.headerCell} />; //!
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
                        return <Grid.Cell cell={cell} key={cell.id} className={styles.cell} />; //!
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
