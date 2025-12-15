import type {
  CellRendererParams,
  HeaderCellRendererParams,
} from "@1771technologies/lytenyte-pro/types";
import { Checkbox as C } from "radix-ui";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { type JSX, type ReactNode } from "react";
import type { OrderData } from "@1771technologies/grid-sample-data/orders";
import { CheckIcon, MinusIcon } from "@radix-ui/react-icons";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export function ProductCell({ grid: { api }, row }: CellRendererParams<OrderData>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  const url = row.data?.productThumbnail;
  const title = row.data.product;
  const desc = row.data.productDescription;

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img className="border-ln-gray-50 h-7 w-7 rounded-lg border" src={url} alt={title + desc} />
      <div className="text-ln-gray-90 flex flex-col gap-0.5">
        <div className="font-semibold">{title}</div>
        <div className="text-ln-gray-70 text-xs">{desc}</div>
      </div>
    </div>
  );
}

export function AvatarCell({ grid: { api }, row }: CellRendererParams<OrderData>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  const url = row.data?.customerAvatar;

  const name = row.data.customer;

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img className="border-ln-gray-50 h-7 w-7 rounded-full border" src={url} alt={name} />
      <div className="text-ln-gray-90 flex flex-col gap-0.5">
        <div>{name}</div>
      </div>
    </div>
  );
}

const formatter = new Intl.NumberFormat("en-Us", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export function PriceCell({ grid: { api }, row }: CellRendererParams<OrderData>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  const price = formatter.format(row.data.price);
  const [dollars, cents] = price.split(".");

  return (
    <div className="flex h-full w-full items-center justify-end">
      <div className="flex items-baseline tabular-nums">
        <span className="text-ln-gray-80 font-semibold">${dollars}</span>.
        <span className="relative text-xs">{cents}</span>
      </div>
    </div>
  );
}

export function PurchaseDateCell({ grid: { api }, row }: CellRendererParams<OrderData>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  const formattedDate = format(row.data.purchaseDate, "dd MMM, yyyy");

  return <div className="flex h-full w-full items-center">{formattedDate}</div>;
}

export function IdCell({ grid: { api }, row }: CellRendererParams<OrderData>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  return <div className="text-xs tabular-nums">{row.data.id}</div>;
}

export function PaymentMethodCell({ grid: { api }, row }: CellRendererParams<OrderData>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  const cardNumber = row.data.cardNumber;
  const provider = row.data.paymentMethod;

  let Logo: ReactNode = null;
  if (provider === "Visa") Logo = <VisaLogo className="w-6" />;
  if (provider === "Mastercard") Logo = <MastercardLogo className="w-6" />;

  return (
    <div className="flex h-full w-full items-center gap-2">
      <div className="flex w-7 items-center justify-center">{Logo}</div>
      <div className="flex items-center">
        <div className="bg-ln-gray-40 size-2 rounded-full"></div>
        <div className="bg-ln-gray-40 size-2 rounded-full"></div>
        <div className="bg-ln-gray-40 size-2 rounded-full"></div>
        <div className="bg-ln-gray-40 size-2 rounded-full"></div>
      </div>
      <div className="tabular-nums">{cardNumber}</div>
    </div>
  );
}

export function EmailCell({ grid: { api }, row }: CellRendererParams<OrderData>) {
  if (!api.rowIsLeaf(row) || !row.data) return;

  return <div className="text-ln-primary-50 flex h-full w-full items-center">{row.data.email}</div>;
}

const VisaLogo = (props: JSX.IntrinsicElements["svg"]) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={2500}
    height={812}
    viewBox="0.5 0.5 999 323.684"
    {...props}
  >
    <path
      fill="#1434cb"
      d="M651.185.5c-70.933 0-134.322 36.766-134.322 104.694 0 77.9 112.423 83.28 112.423 122.415 0 16.478-18.884 31.229-51.137 31.229-45.773 0-79.984-20.611-79.984-20.611l-14.638 68.547s39.41 17.41 91.734 17.41c77.552 0 138.576-38.572 138.576-107.66 0-82.316-112.89-87.537-112.89-123.86 0-12.91 15.501-27.053 47.662-27.053 36.286 0 65.892 14.99 65.892 14.99l14.326-66.204S696.614.5 651.185.5zM2.218 5.497.5 15.49s29.842 5.461 56.719 16.356c34.606 12.492 37.072 19.765 42.9 42.353l63.51 244.832h85.138L379.927 5.497h-84.942L210.707 218.67l-34.39-180.696c-3.154-20.68-19.13-32.477-38.685-32.477H2.218zm411.865 0L347.449 319.03h80.999l66.4-313.534h-80.765zm451.759 0c-19.532 0-29.88 10.457-37.474 28.73L709.699 319.03h84.942l16.434-47.468h103.483l9.994 47.468H999.5L934.115 5.497h-68.273zm11.047 84.707 25.178 117.653h-67.454z"
    />
  </svg>
);

const MastercardLogo = (props: JSX.IntrinsicElements["svg"]) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={2500}
    height={1524}
    viewBox="55.2 38.3 464.5 287.8"
    {...props}
  >
    <path
      fill="#f79f1a"
      d="M519.7 182.2c0 79.5-64.3 143.9-143.6 143.9s-143.6-64.4-143.6-143.9S296.7 38.3 376 38.3s143.7 64.4 143.7 143.9z"
    />
    <path
      fill="#ea001b"
      d="M342.4 182.2c0 79.5-64.3 143.9-143.6 143.9S55.2 261.7 55.2 182.2 119.5 38.3 198.8 38.3s143.6 64.4 143.6 143.9z"
    />
    <path
      fill="#ff5f01"
      d="M287.4 68.9c-33.5 26.3-55 67.3-55 113.3s21.5 87 55 113.3c33.5-26.3 55-67.3 55-113.3s-21.5-86.9-55-113.3z"
    />
  </svg>
);

export function MarkerHeader({ grid }: HeaderCellRendererParams<OrderData>) {
  const allSelected = grid.state.rowDataSource.get().rowAreAllSelected();

  const selected = grid.state.rowSelectedIds.useValue();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <GridCheckbox
        checked={allSelected || selected.size > 0}
        indeterminate={!allSelected && selected.size > 0}
        onClick={(ev) => {
          ev.preventDefault();
          grid.api.rowSelectAll({ deselect: allSelected });
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ")
            grid.api.rowSelectAll({ deselect: allSelected });
        }}
      />
    </div>
  );
}

export function MarkerCell({ grid, rowSelected }: CellRendererParams<OrderData>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <GridCheckbox
        checked={rowSelected}
        onClick={(ev) => {
          ev.stopPropagation();
          grid.api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target });
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ")
            grid.api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target });
        }}
      />
    </div>
  );
}

export function GridCheckbox({
  children,
  indeterminate,
  ...props
}: C.CheckboxProps & { indeterminate?: boolean }) {
  return (
    <label className="text-md text-light flex items-center gap-2">
      <C.Root
        {...props}
        type="button"
        className={tw(
          "bg-ln-gray-02 rounded border-transparent",
          "shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--lng1771-gray-40)]",
          "data-[state=checked]:bg-ln-primary-50 data-[state=checked]:shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--lng1771-primary-50)]",
          "h-4 w-4",
          props.className,
        )}
      >
        <C.CheckboxIndicator className={tw("flex items-center justify-center")}>
          {!indeterminate && <CheckIcon className="text-white dark:text-black" />}
          {indeterminate && <MinusIcon className="text-white dark:text-black" />}
        </C.CheckboxIndicator>
      </C.Root>
      {children}
    </label>
  );
}
