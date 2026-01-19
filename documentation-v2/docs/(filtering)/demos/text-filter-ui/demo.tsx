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
} from "./components.jsx";
import { useClientDataSource, Grid, ViewportShadows } from "@1771technologies/lytenyte-pro-experimental";
import { Header } from "./filter.jsx";

export interface GridSpec {
  readonly data: OrderData;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product", headerRenderer: Header },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer", headerRenderer: Header },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email", headerRenderer: Header },
];
//#end

export type FilterStringOperator =
  | "equals"
  | "not_equals"
  | "begins_with"
  | "not_begins_with"
  | "ends_with"
  | "not_ends_with"
  | "contains"
  | "not_contains";

export interface FilterString {
  readonly kind: "string";
  readonly operator: FilterStringOperator;
  readonly value: string;
}

export interface GridFilter {
  readonly left: FilterString;
  readonly right: FilterString | null;
  readonly operator: "AND" | "OR";
}

export default function Demo() {
  const ds = useClientDataSource<GridSpec>({
    data,
  });

  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} editMode="cell" />
      </div>
    </>
  );
}
