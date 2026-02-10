//#start
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { data as initialData } from "@1771technologies/grid-sample-data/orders";
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
  SmartSelect,
} from "@1771technologies/lytenyte-pro-experimental";
import { useState } from "react";

export interface GridSpec {
  readonly data: OrderData;
}

//#end
const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  {
    id: "product",
    cellRenderer: ProductCell,
    width: 200,
    name: "Product",
    editable: true,
    editOnPrintable: false, //!
    editRenderer: ProductSelect, //!
  },
  {
    id: "price",
    type: "number",
    cellRenderer: PriceCell,
    width: 100,
    name: "Price",
    editable: true,
    editRenderer: NumberEditor,
  },
  {
    id: "customer",
    cellRenderer: AvatarCell,
    width: 180,
    name: "Customer",
  },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130 },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email", editable: true },
];

export default function Demo() {
  const [data, setData] = useState(initialData);
  const ds = useClientDataSource({
    data,
    onRowDataChange: ({ center }) => {
      setData((prev) => {
        const next = prev.map((row, i) => {
          if (center.has(i)) return center.get(i)!;
          return row;
        });

        return next as OrderData[];
      });
    },
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowHeight={50} columns={columns} rowSource={ds} slotShadows={ViewportShadows} editMode="cell" />
    </div>
  );
}

const options = initialData.map((x) => ({
  id: x.product,
  product: x.product,
  productThumbnail: x.productThumbnail,
  price: x.price,
  productDescription: x.productDescription,
}));

function ProductSelect({ changeData, editValue, editData, commit }: Grid.T.EditParams<GridSpec>) {
  const value = options.find((x) => x.id === editValue) ?? null;

  const [open, setOpen] = useState(false);

  return (
    <SmartSelect
      kind="basic"
      options={options}
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(b) => {
        if (!b) commit();
      }}
      openKeys={[" ", "ArrowDown"]}
      container={<SmartSelect.Container className="max-h-50 overflow-auto" />}
      trigger={
        <SmartSelect.BasicTrigger
          className="focus:outline-ln-primary-50 flex h-full w-full items-center gap-2 focus:outline focus:-outline-offset-1"
          autoFocus
          onFocus={() => setOpen(true)}
        >
          {value?.productThumbnail && (
            <img
              className="border-ln-border-strong h-7 w-7 rounded-lg border"
              src={value.productThumbnail}
              alt={value.id}
            />
          )}
          {editValue as string}
        </SmartSelect.BasicTrigger>
      }
      value={value}
      onOptionChange={(p) => {
        if (p) {
          changeData({
            ...(editData as Record<string, unknown>),
            product: p.product,
            price: p.price,
            productThumbnail: p.productThumbnail,
            productDescription: p.productDescription,
          });
          setOpen(false);
        }
      }}
    >
      {(p) => {
        return (
          <SmartSelect.Option key={p.option.id} {...p} className="flex items-center gap-2">
            <img
              className="border-ln-border-strong flex h-7 w-7 rounded-lg border"
              src={p.option.productThumbnail}
              alt={p.option.id}
            />
            <div>{p.option.product}</div>
          </SmartSelect.Option>
        );
      }}
    </SmartSelect>
  );
}

function TextCellEditor({ changeValue, editValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <input
      className="focus:outline-ln-primary-50 h-full w-full px-2"
      value={`${editValue}`} //!
      onChange={(e) => changeValue(e.target.value)} //!
    />
  );
}

function NumberEditor({ changeValue, editValue }: Grid.T.EditParams<GridSpec>) {
  return (
    <input
      className="focus:outline-ln-primary-50 h-full w-full px-2"
      value={`${editValue}`} //!
      type="number"
      onChange={(e) => changeValue(Number.parseFloat(e.target.value))} //!
    />
  );
}
