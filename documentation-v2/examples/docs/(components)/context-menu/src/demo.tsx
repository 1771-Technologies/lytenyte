//#start
import "./demo.css";
import "@1771technologies/lytenyte-pro/components.css";
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
import { useClientDataSource, Grid, computeField, virtualFromXY } from "@1771technologies/lytenyte-pro";
import { useMemo, useState } from "react";
import { Menu } from "@1771technologies/lytenyte-pro/components";
//#end

export interface GridSpec {
  readonly data: OrderData;
}

const initialColumns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  { id: "price", type: "number", cellRenderer: PriceCell, width: 100, name: "Price" },
  { id: "customer", cellRenderer: AvatarCell, width: 180, name: "Customer" },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email" },
];

export default function ComponentDemo() {
  const [columns, setColumns] = useState(initialColumns);
  const ds = useClientDataSource({ data: data });

  const [menu, setMenu] = useState<null | {
    row: Grid.T.RowNode<GridSpec["data"]> | null;
    column: Grid.Column<GridSpec>;
  }>(null);
  const [anchor, setAnchor] = useState<null | Grid.T.VirtualTarget>(null);

  const [api, setApi] = useState<Grid.API<GridSpec> | null>(null);

  return (
    <>
      <Menu
        anchor={anchor}
        open={!!menu}
        modal={false}
        lockScroll
        onOpenChange={(b) => {
          if (!b) {
            setMenu(null);
            setAnchor(null);
          }
        }}
      >
        <Menu.Popover>
          <Menu.Container>
            {menu && (
              <>
                <Menu.Item
                  onAction={() => {
                    if (menu.row) {
                      const field = computeField(menu.column.field ?? menu.column.id, menu.row);
                      navigator.clipboard.writeText(String(field));
                    } else {
                      navigator.clipboard.writeText(menu.column.name ?? menu.column.id);
                    }

                    const columnIndex = api
                      ?.columnView()
                      .visibleColumns.findIndex((x) => x.id === menu.column.id);
                    const rowIndex = menu.row ? api?.rowIdToRowIndex(menu.row!.id) : null;

                    const query =
                      rowIndex != null
                        ? `[data-ln-colindex="${columnIndex}"][data-ln-cell][data-ln-rowindex="${rowIndex}"]`
                        : `[data-ln-header-cell][data-ln-colindex="${columnIndex}"]`;

                    const cell = document.querySelector(query);
                    cell?.classList.add("copy-flash");
                    setTimeout(() => cell?.classList.remove("copy-flash"), 500);
                  }}
                >
                  Copy {menu.row ? "Cell" : "Header Name"}
                </Menu.Item>
                {menu.row && (
                  <Menu.Item
                    onAction={() => {
                      const fields = columns.map((x) => computeField(x.field ?? x.id, menu.row!)).join("\t");
                      navigator.clipboard.writeText(fields);

                      const rowIndex = api?.rowIdToRowIndex(menu.row!.id);

                      const cells = Array.from(
                        document.querySelectorAll(`[data-ln-cell][data-ln-rowindex="${rowIndex}"]`),
                      );
                      cells.forEach((x) => x.classList.add("copy-flash"));
                      setTimeout(() => cells.forEach((x) => x.classList.remove("copy-flash")), 500);
                    }}
                  >
                    Copy Row
                  </Menu.Item>
                )}
                <Menu.Divider />
                <Menu.Item
                  disabled={menu.column.pin === "start"}
                  onAction={() => {
                    if (!api) return;
                    api.columnUpdate({ [menu.column.id]: { pin: "start" } });
                  }}
                >
                  Pin Column Left
                </Menu.Item>
                <Menu.Item
                  disabled={menu.column.pin === "end"}
                  onAction={() => {
                    if (!api) return;
                    api.columnUpdate({ [menu.column.id]: { pin: "end" } });
                  }}
                >
                  Pin Column Right
                </Menu.Item>
                <Menu.Item
                  disabled={!menu.column.pin}
                  onAction={() => {
                    if (!api) return;

                    api.columnUpdate({ [menu.column.id]: { pin: null } });
                  }}
                >
                  Unpin Column
                </Menu.Item>
              </>
            )}
          </Menu.Container>
        </Menu.Popover>
      </Menu>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          rowHeight={50}
          columns={columns}
          onColumnsChange={setColumns}
          ref={setApi}
          rowSource={ds}
          events={useMemo<Grid.Events<GridSpec>>(() => {
            return {
              headerCell: {
                contextMenu: ({ event, column }) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setAnchor(virtualFromXY(event.clientX, event.clientY));

                  setMenu({ column, row: null });
                },
              },
              cell: {
                contextMenu: ({ event, row, column }) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setAnchor(virtualFromXY(event.clientX, event.clientY));

                  setMenu({ row, column });
                },
              },
            };
          }, [])}
        />
      </div>
    </>
  );
}
