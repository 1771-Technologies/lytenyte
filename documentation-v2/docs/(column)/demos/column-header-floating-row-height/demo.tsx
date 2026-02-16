//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  FloatingFilter,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
  ToggleGroup,
  ToggleItem,
} from "./components.jsx";
import {
  useClientDataSource,
  Grid,
  type PieceWritable,
  usePiece,
  type Piece,
} from "@1771technologies/lytenyte-pro-experimental";
import { useCallback, useMemo, useState } from "react";

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product", type: "string" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer", type: "string" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email", type: "string" },
];

export interface GridSpec {
  readonly data: OrderData;
  readonly api: {
    readonly filterModel: PieceWritable<Record<string, string | null>>;
    readonly isSmallFilter: Piece<boolean>;
  };
}

const base: Grid.ColumnBase<GridSpec> = { floatingCellRenderer: FloatingFilter };
//#end

export default function ColumnDemo() {
  const [filterModel, setFilterModel] = useState<Record<string, string | null>>({});
  const [floatingRowHeight, setFloatingRowHeight] = useState(40); //!

  const filter$ = usePiece(filterModel, setFilterModel);
  const small$ = usePiece(floatingRowHeight < 40);
  const apiExtension: GridSpec["api"] = useMemo(() => {
    return {
      filterModel: filter$,
      isSmallFilter: small$,
    };
  }, [filter$, small$]);

  const filterFunction: Grid.T.FilterFn<GridSpec["data"]> = useCallback(
    (row) => {
      const entries = Object.entries(filterModel);
      for (const [key, value] of entries) {
        const data = row.data[key as keyof OrderData];
        // The data should be defined, but if not removed this row in our filter
        if (!data) return false;
        if (!`${data}`.toLowerCase().includes(value?.toLowerCase() ?? "")) return false;
      }
      return true;
    },
    [filterModel],
  );

  const ds = useClientDataSource<GridSpec>({ data: data, filter: filterFunction });

  return (
    <>
      <div className={"border-ln-border flex h-full items-center gap-1 text-nowrap border-b px-2 py-2"}>
        <div className={"text-light hidden text-xs font-medium md:block"}>Floating Row Height</div>
        <ToggleGroup
          type="single"
          value={`${floatingRowHeight}`}
          className={"flex flex-wrap"}
          onValueChange={(c) => {
            if (!c) return;
            setFloatingRowHeight(Number.parseInt(c)); //!
          }}
        >
          <ToggleItem value="30">Small</ToggleItem>
          <ToggleItem value="40">Medium</ToggleItem>
          <ToggleItem value="60">Large</ToggleItem>
        </ToggleGroup>
      </div>
      <div className={"ln-grid"} style={{ height: 500 }}>
        <Grid
          apiExtension={apiExtension}
          rowHeight={50}
          columns={columns}
          columnBase={base}
          rowSource={ds}
          floatingRowEnabled //!
          floatingRowHeight={floatingRowHeight} //!
        />
      </div>
    </>
  );
}
