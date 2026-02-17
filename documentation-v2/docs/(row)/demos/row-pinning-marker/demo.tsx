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
import { useClientDataSource, Grid } from "@1771technologies/lytenyte-pro";
import { ViewportShadows } from "@1771technologies/lytenyte-pro/components";
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

export default function RowDemo() {
  const ds = useClientDataSource({
    //!next 3
    data: data.slice(2, -2),
    topData: data.slice(0, 2),
    botData: data.slice(-2),
  });

  return (
    <div
      className="ln-grid ln-cell-marker:border-e ln-cell-marker:border-e-ln-border-strong"
      style={{ height: 500 }}
    >
      <Grid
        rowHeight={50}
        columns={columns}
        rowSource={ds}
        columnMarker={marker}
        slotShadows={ViewportShadows}
      />
    </div>
  );
}
