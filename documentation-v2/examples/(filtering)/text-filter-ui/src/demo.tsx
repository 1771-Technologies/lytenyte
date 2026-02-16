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
import {
  useClientDataSource,
  Grid,
  ViewportShadows,
  type PieceWritable,
  usePiece,
} from "@1771technologies/lytenyte-pro-experimental";
import { Header } from "./filter.jsx";
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: OrderData;
  readonly api: {
    readonly filterModel: PieceWritable<Record<string, GridFilter>>;
  };
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
  readonly operator: FilterStringOperator;
  readonly value: string;
}

export interface GridFilter {
  readonly left: FilterString;
  readonly right: FilterString | null;
  readonly operator: "AND" | "OR";
}

export default function FilterDemo() {
  const [filter, setFilter] = useState<Record<string, GridFilter>>({});
  const filterModel = usePiece(filter, setFilter);

  const filterFn = useMemo(() => {
    const entries = Object.entries(filter);

    const evaluateStringFilter = (operator: FilterStringOperator, compare: string, value: string) => {
      if (operator === "equals") return value === compare;
      if (operator === "begins_with") return compare.startsWith(value);
      if (operator === "ends_with") return compare.endsWith(value);
      if (operator === "contains") return compare.includes(value);
      if (operator === "not_begins_with") return !compare.startsWith(value);
      if (operator === "not_ends_with") return !compare.endsWith(value);
      if (operator === "not_contains") return !compare.includes(value);
      if (operator === "not_equals") return value !== compare;

      return false;
    };

    return entries.map<Grid.T.FilterFn<GridSpec["data"]>>(([column, filter]) => {
      return (row) => {
        const value = row.data[column as keyof GridSpec["data"]];

        // We are only working with string filters, so lets filter out none strings
        if (typeof value !== "string") return false;

        // Case insensitive match
        const compareValue = value.toLowerCase();

        const leftResult = evaluateStringFilter(
          filter.left.operator,
          compareValue,
          filter.left.value.toLowerCase(),
        );
        if (!filter.right) return leftResult;

        if (filter.operator === "OR") {
          return (
            leftResult ||
            evaluateStringFilter(filter.right.operator, compareValue, filter.right.value.toLowerCase())
          );
        }

        return (
          leftResult &&
          evaluateStringFilter(filter.right.operator, compareValue, filter.right.value.toLowerCase())
        );
      };
    });
  }, [filter]);

  const ds = useClientDataSource<GridSpec>({
    data,
    filter: filterFn,
  });

  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          apiExtension={useMemo(() => ({ filterModel }), [filterModel])}
          rowHeight={50}
          columns={columns}
          rowSource={ds}
          slotShadows={ViewportShadows}
        />
      </div>
    </>
  );
}
