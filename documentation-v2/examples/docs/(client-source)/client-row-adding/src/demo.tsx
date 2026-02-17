//#start
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data as initialData } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
} from "./components.jsx";
import { useClientDataSource, Grid, type RowSourceClient } from "@1771technologies/lytenyte-pro";
import { useState } from "react";
import { ViewportShadows } from "@1771technologies/lytenyte-pro/components";
//#end

export interface GridSpec {
  readonly data: OrderData;
  readonly source: RowSourceClient<this>;
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

let addIndex = 1;
export default function ClientDemo() {
  const [data, setData] = useState(initialData.slice(0, 1));

  const ds = useClientDataSource<GridSpec>({
    data: data,
    onRowsAdded: (params) => {
      setData((prev) => {
        if (params.placement === "start") return [...params.newData, ...prev];
        if (params.placement === "end") return [...prev, ...params.newData];

        const index = Math.min(Math.max(0, params.placement), prev.length);

        // Handle arbitrary indices
        const next = [...prev];
        next.splice(index, 0, ...params.newData);

        return next;
      });
    },
  });

  return (
    <>
      <div className="border-ln-border flex gap-4 border-b px-4 py-3">
        <button
          data-ln-button="website"
          data-ln-size="md"
          disabled={addIndex === initialData.length}
          onClick={() => {
            ds.rowAdd([initialData[addIndex]], "start");
            addIndex = addIndex + 1;
          }}
        >
          Add Top Row
        </button>
        <button
          data-ln-button="website"
          data-ln-size="md"
          disabled={addIndex === initialData.length}
          onClick={() => {
            ds.rowAdd([initialData[addIndex]], "end");
            addIndex = addIndex + 1;
          }}
        >
          Add Bottom Row
        </button>
        {addIndex >= initialData.length && (
          <button
            data-ln-button="website"
            data-ln-size="md"
            onClick={() => {
              setData([initialData[0]]);
              addIndex = 1;
            }}
          >
            Reset Rows
          </button>
        )}
      </div>

      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} />
      </div>
    </>
  );
}
