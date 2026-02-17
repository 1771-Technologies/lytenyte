//#start
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
import { useClientDataSource, Grid } from "@1771technologies/lytenyte-pro";
import { useState } from "react";
import { NumberInput } from "@ark-ui/react/number-input";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ViewportShadows } from "@1771technologies/lytenyte-pro/components";

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
    editable: true, //!
    editRenderer: TextCellEditor, //!
  },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  {
    id: "email",
    cellRenderer: EmailCell,
    width: 220,
    name: "Email",
    editable: true, //!
    editRenderer: TextCellEditor, //!
  },
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
      {/*!next 1 */}
      <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} editMode="row" />
    </div>
  );
}

function TextCellEditor({ changeValue, editValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <input
      className="focus:outline-ln-primary-50 h-full w-full px-2"
      value={`${editValue}`} //!
      onChange={(e) => changeValue(e.target.value)} //!
    />
  );
}

function NumberEditor(props: Grid.T.EditParams<GridSpec>) {
  const { changeValue, editValue, editValidation, column } = props;
  const valid = typeof editValidation === "boolean" ? editValidation : !editValidation[column.id];

  return (
    <>
      <NumberInput.Root
        className={tw(
          "focus-within:outline-ln-primary-50 flex h-full w-full items-center rounded px-2 focus-within:outline focus-within:-outline-offset-1",
          !valid && "bg-ln-red-30 focus-within:outline-ln-red-50",
        )}
        value={`${editValue}`}
        onValueChange={(d) => {
          changeValue(Number.isNaN(d.valueAsNumber) ? 0 : d.valueAsNumber);
        }}
        onKeyDown={(e) => {
          if (e.key === "," || e.key === "-") {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        min={0}
        allowOverflow={false}
      >
        <NumberInput.Input className={tw("h-full w-full flex-1 focus:outline-none")} />
      </NumberInput.Root>
    </>
  );
}

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
