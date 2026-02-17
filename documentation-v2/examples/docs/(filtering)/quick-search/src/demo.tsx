//#start
import "@1771technologies/lytenyte-pro/components.css";
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
import { useMemo, useRef, useState } from "react";
import { ViewportShadows } from "@1771technologies/lytenyte-pro/components";

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

export default function FilterDemo() {
  const [query, setQuery] = useState("");

  const filterFn = useMemo(() => {
    if (!query) return null;

    return (row: Grid.T.RowLeaf<GridSpec["data"]>) => {
      const d = row.data;
      const stringValue = `${d.customer} ${d.email} ${d.paymentMethod} ${d.product} ${d.productDescription} ${d.purchaseDate} ${d.cardNumber}`;

      return stringValue.toLowerCase().includes(query.toLowerCase());
    };
  }, [query]);

  const ds = useClientDataSource<GridSpec>({
    data,
    filter: filterFn,
  });

  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (
    <>
      <div className="border-ln-border flex w-full border-b px-2 py-2">
        <label className="flex w-full items-center gap-2">
          <span>Quick Search</span>

          <input
            data-ln-input
            className="flex-1"
            onChange={(e) => {
              const value = e.target.value;

              if (t.current) clearTimeout(t.current);

              // Simple debounce
              t.current = setTimeout(() => {
                setQuery(value);
                t.current = null;
              }, 100);
            }}
          />
        </label>
      </div>

      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} editMode="cell" />
      </div>
    </>
  );
}
