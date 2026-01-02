//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  SwitchToggle,
} from "./components.jsx";
import { useClientDataSource, Grid, ViewportShadows } from "@1771technologies/lytenyte-pro-experimental";
import { useMemo, useState } from "react";
//#end

export interface GridSpec {
  readonly data: OrderData;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
];

const base: Grid.ColumnBase<GridSpec> = { resizable: true, widthMin: 100, widthMax: 300 };

export default function ColumnBase() {
  const ds = useClientDataSource({ data: data });
  const [widthFlex, setWidthFlex] = useState(true);

  const columnBase = useMemo(() => {
    if (widthFlex) return { ...base, widthFlex: 1 };
    return base;
  }, [widthFlex]);

  return (
    <div className={"ln-grid"} style={{ height: 500 }}>
      <div className="border-ln-border flex w-full border-b px-2 py-2">
        <SwitchToggle
          label="Toggle Width Flex"
          checked={widthFlex}
          onChange={() => {
            setWidthFlex((prev) => !prev);
          }}
        />
      </div>
      <Grid
        rowHeight={50}
        columns={columns}
        rowSource={ds}
        columnBase={columnBase}
        slotShadows={ViewportShadows}
      />
    </div>
  );
}
