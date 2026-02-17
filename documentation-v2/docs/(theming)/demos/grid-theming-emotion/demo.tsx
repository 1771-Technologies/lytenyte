//#start
import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/grid-full.css";
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
import { useClientDataSource, Grid, ViewportShadows } from "@1771technologies/lytenyte-pro";
import { ThemePicker } from "./theme.jsx";
import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

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
  text-transform: capitalize;
  font-size: 14px;
`;

export default function ThemingDemo() {
  const [selections, setSelections] = useState<Grid.T.DataRect[]>([
    { rowStart: 1, rowEnd: 3, columnStart: 1, columnEnd: 3 },
  ]);
  const ds = useClientDataSource({ data: data });
  const [theme, setTheme] = useState("ln-dark");
  const cache = useMemo(() => {
    return createCache({ key: "x" });
  }, []);

  return (
    <CacheProvider value={cache}>
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
    </CacheProvider>
  );
}
