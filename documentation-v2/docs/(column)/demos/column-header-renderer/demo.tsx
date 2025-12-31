//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  HeaderWithIcon,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
} from "./components.js";

export interface GridSpec {
  readonly data: OrderData;
}
//#end

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200 },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100 },
  { id: "customer", cellRenderer: AvatarCell, width: 180 },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 140 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220 },
];

const base: Grid.ColumnBase<GridSpec> = {
  headerRenderer: HeaderWithIcon, //!
};

export default function ColumnBase() {
  const ds = useClientDataSource({ data: data });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} rowHeight={50} columnBase={base} />
    </div>
  );
}
