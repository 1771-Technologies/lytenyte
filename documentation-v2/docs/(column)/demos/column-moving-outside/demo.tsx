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
import { useState } from "react";
import { createPortal } from "react-dom";
import { EyeClosedIcon, MoveIcon } from "@radix-ui/react-icons";

const initialColumns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", name: "Product", cellRenderer: ProductCell, width: 200, groupPath: ["Inventory"] },
  {
    id: "price",
    name: "Price",
    type: "number",
    cellRenderer: PriceCell,
    width: 100,
    groupPath: ["Inventory"],
  },
  { id: "customer", name: "Customer", cellRenderer: AvatarCell, width: 180 },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 120 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", name: "Email", cellRenderer: EmailCell, width: 220 },
];

export interface GridSpec {
  readonly data: OrderData;
}
//#end

const base: Grid.ColumnBase<GridSpec> = { movable: true };

export default function ColumnDemo() {
  const ds = useClientDataSource({ data: data });

  const [columns, setColumns] = useState(initialColumns);

  return (
    <div className="ln-grid ln-header-group:justify-center" style={{ height: 500 }}>
      <Grid
        rowHeight={50}
        columns={columns}
        rowSource={ds}
        onColumnsChange={setColumns}
        columnBase={base}
        columnMoveDragPlaceholder={ColumnPlaceholder}
        columnGroupMoveDragPlaceholder={ColumnGroupPlaceholder}
        //!next 3
        onColumnMoveOutside={({ api, columns }) => {
          api.columnUpdate(Object.fromEntries(columns.map((x) => [x.id, { hide: true }])));
        }}
      />
    </div>
  );
}

const ColumnPlaceholder: Grid.Props<GridSpec>["columnMoveDragPlaceholder"] = (p) => {
  return createPortal(
    <div
      className="text-ln-text-dark bg-ln-bg-ui-panel border-ln-bg-strong flex items-center gap-2 rounded border px-4 py-2"
      style={{ position: "fixed", zIndex: 10, transform: `translate3d(${p.x}px, ${p.y}px, 0px)` }}
    >
      {p.outside ? <EyeClosedIcon /> : <MoveIcon />}
      {p.column.name ?? p.column.id}
    </div>,
    document.body,
  );
};

const ColumnGroupPlaceholder: Grid.Props<GridSpec>["columnGroupMoveDragPlaceholder"] = (p) => {
  return createPortal(
    <div
      className="text-ln-text-dark bg-ln-bg-ui-panel border-ln-bg-strong flex items-center gap-2 rounded border px-4 py-2"
      style={{ position: "fixed", zIndex: 10, transform: `translate3d(${p.x}px, ${p.y}px, 0px)` }}
    >
      {p.outside ? <EyeClosedIcon /> : <MoveIcon />}
      {p.columns.map((x) => x.name ?? x.id).join(" & ")}
    </div>,
    document.body,
  );
};
