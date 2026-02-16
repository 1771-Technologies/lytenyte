//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
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
  ToggleGroup,
  ToggleItem,
} from "./components.js";
import { useClientDataSource, Grid } from "@1771technologies/lytenyte-pro-experimental";
import { useState } from "react";

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email" },
];

export interface GridSpec {
  readonly data: OrderData;
}

//#end

export default function ColumnDemo() {
  const ds = useClientDataSource({ data: data });

  const [headerHeight, setHeaderHeight] = useState(40); //!

  return (
    <>
      <div className={"border-ln-border flex h-full items-center gap-1 text-nowrap border-b px-2 py-2"}>
        <div className={"text-light hidden text-xs font-medium md:block"}>Header Height:</div>
        <ToggleGroup
          type="single"
          value={`${headerHeight}`}
          className={"flex flex-wrap"}
          onValueChange={(c) => {
            if (!c) return;
            setHeaderHeight(Number.parseInt(c)); //!
          }}
        >
          <ToggleItem value="30">Small</ToggleItem>
          <ToggleItem value="40">Medium</ToggleItem>
          <ToggleItem value="60">Large</ToggleItem>
        </ToggleGroup>
      </div>
      <div className={"ln-grid"} style={{ height: 500 }}>
        <Grid rowHeight={50} columns={columns} rowSource={ds} headerHeight={headerHeight} /> //!
      </div>
    </>
  );
}
