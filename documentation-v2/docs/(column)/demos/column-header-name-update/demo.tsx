import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  Grid,
  useClientDataSource,
  usePiece,
  type PieceWritable,
} from "@1771technologies/lytenyte-pro-experimental";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  HeaderCell,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
} from "./components.jsx";
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: OrderData;
  readonly api: { editing: PieceWritable<string | null>; updateHeaderName: (s: string, id: string) => void };
}

const base: Grid.ColumnBase<GridSpec> = { headerRenderer: HeaderCell };

export default function ColumnBase() {
  const ds = useClientDataSource({ data: data });

  const [columns, setColumns] = useState<Grid.Column<GridSpec>[]>([
    { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
    { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
    { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
    { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
    { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 120 },
    { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
    { id: "email", cellRenderer: EmailCell, width: 220, name: "Email" },
  ]);

  const [editing, setEditing] = useState<string | null>(null);
  const editingPiece = usePiece(editing, setEditing);

  const api = useMemo<(api: Grid.API<GridSpec>) => GridSpec["api"]>(() => {
    return (api) => ({
      editing: editingPiece,
      updateHeaderName: (newName, id) => {
        api.columnUpdate({ [id]: { name: newName } });
        setEditing(null);
      },
    });
  }, [editingPiece]);

  return (
    <div className="ln-grid ln-header:px-0" style={{ height: 500 }}>
      <Grid
        events={useMemo<Grid.Events<GridSpec>>(
          () => ({
            headerCell: {
              keyDown: (column, ev) => {
                if (ev.key !== "Enter") return;

                setEditing(column.id);
              },
            },
          }),
          [],
        )}
        apiExtension={api}
        rowSource={ds}
        columnBase={base}
        columns={columns}
        rowHeight={50}
        onColumnsChange={setColumns}
      />
    </div>
  );
}
