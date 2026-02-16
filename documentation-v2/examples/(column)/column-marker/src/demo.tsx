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
import { useClientDataSource, Grid } from "@1771technologies/lytenyte-pro-experimental";
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

//!next 6
const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  cellRenderer: (p) => {
    return <div className="flex h-full w-full items-center justify-center text-xs">{p.rowIndex + 1}</div>;
  },
};

export default function ColumnDemo() {
  const ds = useClientDataSource({ data: data });

  return (
    <div
      className="ln-grid ln-cell-marker:border-e ln-cell-marker:border-e-ln-border-strong"
      style={{ height: 500 }}
    >
      <Grid rowHeight={50} columns={columns} rowSource={ds} columnMarker={marker} /> //!
    </div>
  );
}
