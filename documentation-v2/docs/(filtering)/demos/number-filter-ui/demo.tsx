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
import {
  useClientDataSource,
  Grid,
  ViewportShadows,
  type PieceWritable,
  usePiece,
} from "@1771technologies/lytenyte-pro";
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
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price", headerRenderer: Header },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email" },
];
//#end

export type FilterNumberOperator =
  | "greater_than"
  | "greater_than_or_equals"
  | "less_than"
  | "less_than_or_equals"
  | "equals"
  | "not_equals";

export interface FilterNumber {
  readonly operator: FilterNumberOperator;
  readonly value: number;
}

export interface GridFilter {
  readonly left: FilterNumber;
  readonly right: FilterNumber | null;
  readonly operator: "AND" | "OR";
}

export default function FilterDemo() {
  const [filter, setFilter] = useState<Record<string, GridFilter>>({});
  const filterModel = usePiece(filter, setFilter);

  const filterFn = useMemo(() => {
    const entries = Object.entries(filter);

    const evaluateNumberFilter = (operator: FilterNumberOperator, compare: number, value: number) => {
      if (operator === "equals") return value === compare;
      if (operator === "greater_than") return compare > value;
      if (operator === "greater_than_or_equals") return compare >= value;
      if (operator === "less_than") return compare < value;
      if (operator === "less_than_or_equals") return compare <= value;
      if (operator === "not_equals") return value !== compare;

      return false;
    };

    return entries.map<Grid.T.FilterFn<GridSpec["data"]>>(([column, filter]) => {
      return (row) => {
        const value = row.data[column as keyof GridSpec["data"]];

        // We are only working with number filters, so lets filter out none number
        if (typeof value !== "number") return false;

        const compareValue = value;

        const leftResult = evaluateNumberFilter(filter.left.operator, compareValue, filter.left.value);
        if (!filter.right) return leftResult;

        if (filter.operator === "OR")
          return leftResult || evaluateNumberFilter(filter.right.operator, compareValue, filter.right.value);

        return leftResult && evaluateNumberFilter(filter.right.operator, compareValue, filter.right.value);
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
