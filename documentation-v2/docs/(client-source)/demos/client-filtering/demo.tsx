//#start
import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/components.css";
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

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email" },
];

export default function ClientDemo() {
  const [filter, setFilter] = useState<Grid.T.FilterFn<GridSpec["data"]> | null>(null);
  const ds = useClientDataSource<GridSpec>({ data: data, filter });

  return (
    <>
      <div className="border-ln-border flex gap-4 border-b px-4 py-3">
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            setFilter(
              () => (row: Grid.T.RowLeaf<GridSpec["data"]>) => row.data.paymentMethod === "Mastercard",
            );
          }}
        >
          Mastercard
        </button>
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            setFilter(() => (row: Grid.T.RowLeaf<GridSpec["data"]>) => row.data.paymentMethod === "Visa");
          }}
        >
          Visa
        </button>
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            setFilter(null);
          }}
        >
          Clear Filters
        </button>
      </div>

      <div className="ln-grid">
        <div className={"ln-grid"} style={{ height: 500 }}>
          <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} />
        </div>
      </div>
    </>
  );
}
