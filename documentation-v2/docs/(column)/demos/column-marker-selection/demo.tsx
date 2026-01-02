//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  GridCheckbox,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
} from "./components.jsx";
import { useClientDataSource, Grid, SelectAll } from "@1771technologies/lytenyte-pro-experimental";

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

//!next 5
const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  cellRenderer: MarkerCell,
  headerRenderer: MarkerHeader,
};

export default function Demo() {
  const ds = useClientDataSource({ data: data });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowHeight={50}
        columns={columns}
        rowSource={ds}
        columnMarker={marker}
        rowSelectionMode="multiple"
      />
    </div>
  );
}

function MarkerHeader(params: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SelectAll
        {...params}
        slot={({ indeterminate, selected, toggle }) => {
          return (
            <GridCheckbox
              checked={selected || indeterminate}
              indeterminate={indeterminate}
              onClick={(ev) => {
                ev.preventDefault();
                toggle();
              }}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") toggle();
              }}
            />
          );
        }}
      />
    </div>
  );
}

function MarkerCell({ api, selected }: Grid.T.CellRendererParams<GridSpec>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <GridCheckbox
        checked={selected}
        onClick={(ev) => {
          ev.stopPropagation();
          api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target }); //!
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ")
            api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target }); //!
        }}
      />
    </div>
  );
}
