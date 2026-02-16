//#start
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
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
import {
  useClientDataSource,
  Grid,
  ViewportShadows,
  type RowSourceClient,
} from "@1771technologies/lytenyte-pro-experimental";
import { useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
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

const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  cellRenderer: (p) => {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <button
          data-ln-button="secondary"
          data-ln-size="sm"
          data-ln-icon
          onClick={() => p.api.rowDelete([p.row])} //!
        >
          <span className="sr-only">Delete row</span>
          <TrashIcon />
        </button>
      </div>
    );
  },
};

export default function ClientDemo() {
  const [data, setData] = useState(initialData);

  const ds = useClientDataSource<GridSpec>({
    data: data,
    //!next 6
    onRowsDeleted: (params) => {
      setData((prev) => {
        const next = prev.filter((_, i) => !params.sourceIndices.includes(i));
        return next;
      });
    },
  });

  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          rowHeight={50}
          columns={columns}
          rowSource={ds}
          slotShadows={ViewportShadows}
          columnMarker={marker}
        />
      </div>
    </>
  );
}
