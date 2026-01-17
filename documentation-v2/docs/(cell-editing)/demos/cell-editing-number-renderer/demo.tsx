//#start
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
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  {
    id: "price",
    type: "number",
    cellRenderer: PriceCell,
    width: 100,
    name: "Price",
    //!next 6
    editSetter: (p) => {
      const currentValue = typeof p.editValue !== "string" ? 0 : getNumberValue(p.editValue) || 0;
      const data = { ...(p.editData as Record<string, unknown>), [p.column.id]: currentValue };

      return data;
    },
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

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} editMode="cell" />
    </div>
  );
}

function NumberEditor({ changeValue, editValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <input
      className="focus:outline-ln-primary-50 h-full w-full px-2"
      value={`${editValue}`} //!
      onChange={(e) => {
        const value = getNumberValue(e.target.value); //!
        changeValue(value || 0); //!
      }}
    />
  );
}

const getNumberValue = (e: string) => {
  const value = e.trim();

  // Allow empty input
  if (value === "") return "";

  // Allow minus sign only at the start
  if (value === "-") return "-";

  // Convert to number and check if it's valid
  const number = Number.parseFloat(value);

  if (value && !Number.isNaN(number)) {
    return String(number) + (value.endsWith(".") ? "." : "");
  } else {
    // If not a valid number, revert to previous value
    return value.slice(0, -1) || "";
  }
};
