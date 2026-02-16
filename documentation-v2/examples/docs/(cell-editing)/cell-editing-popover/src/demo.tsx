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
import { useState } from "react";

export interface GridSpec {
  readonly data: OrderData;
}

//#end
const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  {
    id: "product",
    cellRenderer: ProductCell,
    width: 200,
    name: "Product",
    editable: true,
    editOnPrintable: false,
    editRenderer: ProductSelect,
  },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email", editable: true },
];

export default function CellEditingDemo() {
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

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} editMode="cell" />
    </div>
  );
}

const options = initialData.map((x) => ({
  id: x.product,
  product: x.product,
  productThumbnail: x.productThumbnail,
  price: x.price,
  productDescription: x.productDescription,
}));

function ProductSelect({ changeData, editValue, editData, commit }: Grid.T.EditParams<GridSpec>) {
  const value = options.find((x) => x.id === editValue)!;

  return (
    <select
      className="h-full w-full"
      value={value.id}
      onChange={(e) => {
        const p = options.find((x) => x.id === e.target.value);
        if (!p) return;

        changeData({
          ...(editData as Record<string, unknown>),
          product: p.product,
          price: p.price,
          productThumbnail: p.productThumbnail,
          productDescription: p.productDescription,
        });
        commit();
      }}
    >
      {options.map((x) => {
        return <option value={x.id}>{x.product}</option>;
      })}
    </select>
  );
}
