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
  SwitchToggle,
} from "./components.jsx";
import { useClientDataSource, Grid } from "@1771technologies/lytenyte-pro";
import { useState } from "react";
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

const filterXbox: Grid.T.FilterFn<GridSpec["data"]> = (row) => row.data.product.includes("Xbox"); //!

export default function FilterDemo() {
  const [filterValues, setFilterValues] = useState(true); //!
  const ds = useClientDataSource<GridSpec>({
    data,
    filter: filterValues ? filterXbox : null, //!
  });

  return (
    <>
      <div className="border-ln-border flex w-full border-b px-2 py-2">
        <SwitchToggle
          label="Show Xbox Only"
          checked={filterValues}
          onChange={() => {
            setFilterValues((prev) => !prev);
          }}
        />
      </div>

      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} editMode="cell" />
      </div>
    </>
  );
}
