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
import { useClientDataSource, Grid, ViewportShadows } from "@1771technologies/lytenyte-pro-experimental";
import { useRef, useState } from "react";

export interface GridSpec {
  readonly data: OrderData;
}

//#end
const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  {
    id: "price",
    type: "number",
    cellRenderer: PriceCell,
    width: 100,
    name: "Price",
    editable: true, //!
    editRenderer: NumberEditor, //!
  },
  {
    id: "customer",
    cellRenderer: AvatarCell,
    width: 180,
    name: "Customer",
  },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130, editable: true },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email", editable: true },
];

export default function Demo() {
  const [data, setData] = useState(initialData);
  const ds = useClientDataSource({
    data,
    onRowDataChange: ({ center }) => {
      setData((prev) => {
        const next = prev.map((row, i) => {
          if (center.has(i)) return center.get(i)!;
          return row;
        });

        return next as OrderData[];
      });
    },
  });
  const apiRef = useRef<Grid.API<GridSpec>>(null);

  return (
    <>
      <div className="border-ln-border flex items-center gap-4 border-b px-2 py-2">
        <button
          data-ln-button="tertiary"
          data-ln-size="md"
          className="flex items-center gap-2"
          onClick={() => {
            const update = new Map(
              data.map((x, i) => {
                return [i, { ...x, price: x.price + 10 }];
              }),
            );

            apiRef.current?.editUpdateRows(update);
          }}
        >
          Inc. Price +$10.00
        </button>
        <button
          data-ln-button="tertiary"
          data-ln-size="md"
          className="flex items-center gap-2"
          onClick={() => {
            const update = new Map(
              data.map((x, i) => {
                const next = Math.max(x.price - 10, 1);
                return [i, { ...x, price: next }];
              }),
            );

            apiRef.current?.editUpdateRows(update);
          }}
        >
          Dec. Price -$10.00
        </button>
      </div>

      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          ref={apiRef}
          rowHeight={50}
          columns={columns}
          rowSource={ds}
          slotShadows={ViewportShadows}
          editMode="cell"
        />
      </div>
    </>
  );
}

function NumberEditor({ changeValue, editValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <input
      className="focus:outline-ln-primary-50 h-full w-full px-2"
      value={`${editValue}`} //!
      type="number"
      onChange={(e) => changeValue(Number.parseFloat(e.target.value))} //!
    />
  );
}
