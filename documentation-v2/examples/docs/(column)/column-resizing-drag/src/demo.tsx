//#start
import "@1771technologies/lytenyte-pro/light-dark.css";
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
import { useState } from "react";
//#end

export interface GridSpec {
  readonly data: OrderData;
}

const base: Grid.ColumnBase<GridSpec> = { resizable: true }; //!

export default function ColumnDemo() {
  const ds = useClientDataSource({ data: data });
  const [columns, setColumns] = useState<Grid.Column<GridSpec>[]>([
    { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
    { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
    { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
    { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
    { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
    { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
    { id: "email", cellRenderer: EmailCell, width: 220, name: "Email" },
  ]);

  return (
    <div className={"ln-grid"} style={{ height: 500 }}>
      <Grid
        rowHeight={50}
        columns={columns}
        onColumnsChange={setColumns}
        rowSource={ds}
        columnBase={base}
        slotShadows={ViewportShadows}
      />
    </div>
  );
}
