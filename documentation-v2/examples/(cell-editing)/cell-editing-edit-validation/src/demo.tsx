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
  Popover,
} from "@1771technologies/lytenyte-pro-experimental";
import { useCallback, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NumberInput } from "@ark-ui/react/number-input";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export interface GridSpec {
  readonly data: OrderData;
}

//#end
const columns: Grid.Column<GridSpec>[] = [
  { id: "id", width: 60, widthMin: 60, cellRenderer: IdCell, name: "ID" },
  { id: "product", cellRenderer: ProductCell, width: 200, name: "Product" },
  {
    id: "price",
    type: "number",
    cellRenderer: PriceCell,
    width: 100,
    name: "Price",
    editable: true, //!
    editRenderer: NumberEditor, //!
  },
  {
    id: "customer",
    cellRenderer: AvatarCell,
    width: 180,
    name: "Customer",
  },
  { id: "purchaseDate", cellRenderer: PurchaseDateCell, name: "Purchase Date", width: 130, editable: true },
  { id: "paymentMethod", cellRenderer: PaymentMethodCell, name: "Payment Method", width: 150 },
  { id: "email", cellRenderer: EmailCell, width: 220, name: "Email", editable: true },
];

export default function CellEditingDemo() {
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
      <Grid
        rowHeight={50}
        columns={columns}
        rowSource={ds}
        slotShadows={ViewportShadows}
        editMode="cell"
        editRowValidatorFn={useCallback<Required<Grid.Props<GridSpec>>["editRowValidatorFn"]>((p) => {
          if (typeof p.editData !== "object") return false;

          const data = p.editData as Record<string, number>;
          if (data.price <= 0) {
            return { price: "Price must be greater than 0." };
          }

          return true;
        }, [])}
      />
    </div>
  );
}

function NumberEditor(props: Grid.T.EditParams<GridSpec>) {
  const { changeValue, editValue, editValidation, column } = props;
  const valid = typeof editValidation === "boolean" ? editValidation : !editValidation[column.id];
  const errorMessage =
    typeof editValidation === "boolean"
      ? "Invalid number input."
      : ((editValidation[column.id] as string) ?? "Invalid number input.");

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Popover
        anchor={anchor}
        placement="top"
        hide
        open={!valid}
        modal={false}
        lockScroll={false}
        focusTrap={false}
      >
        <Popover.Container>
          <Popover.Arrow />
          {errorMessage}
        </Popover.Container>
      </Popover>

      <NumberInput.Root
        className={tw(
          "focus-within:outline-ln-primary-50 flex h-full w-full items-center rounded px-2 focus-within:outline focus-within:-outline-offset-1",
          !valid && "bg-ln-red-30 focus-within:outline-ln-red-50",
        )}
        value={`${editValue}`}
        onValueChange={(d) => {
          changeValue(Number.isNaN(d.valueAsNumber) ? 0 : d.valueAsNumber);
        }}
        onKeyDown={(e) => {
          if (e.key === "," || e.key === "-") {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        min={0}
        allowOverflow={false}
      >
        <NumberInput.Input ref={setAnchor} className={tw("h-full w-full flex-1 focus:outline-none")} />
      </NumberInput.Root>
    </>
  );
}
