//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import {
  AvatarCell,
  EmailCell,
  IdCell,
  PaymentMethodCell,
  PriceCell,
  ProductCell,
  PurchaseDateCell,
} from "./components.jsx";
import { useClientDataSource, Grid } from "@1771technologies/lytenyte-pro-experimental";
import { NoRowsSvgDark, NoRowsSvgLight } from "./no-rows-overlay.jsx";
//#end

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

export default function ComponentDemo() {
  const ds = useClientDataSource({ data: [] });

  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          rowHeight={50}
          columns={columns}
          rowSource={ds}
          slotRowsOverlay={
            <div className="z-12 sticky left-0 top-0 flex h-0 w-0">
              <div className="w-(--ln-vp-width) absolute left-0 top-0 flex flex-col items-center justify-center pt-12 text-lg">
                <div className="dark:hidden">
                  <NoRowsSvgLight />
                </div>
                <div className="hidden dark:block">
                  <NoRowsSvgDark />
                </div>
                <div className="relative -top-4 text-lg font-bold">No Rows</div>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}
