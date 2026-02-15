//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
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
import { useState } from "react";
//#end

const initialColumns: Grid.Column<GridSpec>[] = [
  //!next 2
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID", pin: "start" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product", pin: "start" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email" },
];

export interface GridSpec {
  readonly data: OrderData;
}

const base: Grid.ColumnBase<GridSpec> = { movable: true }; //!

export default function ColumnMoving() {
  const ds = useClientDataSource({ data: data });

  const [columns, setColumns] = useState(initialColumns);

  return (
    <div className={"ln-grid"} style={{ height: 500 }}>
      <Grid
        rowHeight={50}
        columns={columns}
        columnBase={base}
        rowSource={ds}
        onColumnsChange={setColumns}
        slotShadows={ViewportShadows}
      />
    </div>
  );
}
