import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX, type ReactNode } from "react";
import { ColumnPivotIcon, ManageColumnsIcon, MeasuresIcon, RowGroupIcon } from "../icons";

export const PillManagerRowLabel = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function PillManagerRowLabel(props, ref) {
    return (
      <div
        {...props}
        className={clsx("lng1771-pill-manager__row-label", props.className)}
        ref={ref}
      />
    );
  },
);

export const PillManagerColumnsLabel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { labelText?: string; icon?: ReactNode }
>(function PillManagerColumnsLabel(
  { labelText = "Columns", icon = <ManageColumnsIcon />, ...props },
  ref,
) {
  return (
    <PillManagerRowLabel
      {...props}
      className={"lng1771-pill-manager__row-label-built-in"}
      ref={ref}
    >
      {icon}
      <span>{labelText}</span>
    </PillManagerRowLabel>
  );
});

export const PillManagerAggLabel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { labelText?: string; icon?: ReactNode }
>(function PillManagerColumnsLabel(
  { labelText = "Aggregations", icon = <MeasuresIcon />, ...props },
  ref,
) {
  return (
    <PillManagerRowLabel
      {...props}
      className={"lng1771-pill-manager__row-label-built-in"}
      ref={ref}
    >
      {icon}
      <span>{labelText}</span>
    </PillManagerRowLabel>
  );
});

export const PillManagerMeasureLabel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { labelText?: string; icon?: ReactNode }
>(function PillManagerColumnsLabel(
  { labelText = "Measure", icon = <MeasuresIcon />, ...props },
  ref,
) {
  return (
    <PillManagerRowLabel
      {...props}
      className={"lng1771-pill-manager__row-label-built-in"}
      ref={ref}
    >
      {icon}
      <span>{labelText}</span>
    </PillManagerRowLabel>
  );
});

export const PillManagerColumnPivotsLabel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { labelText?: string; icon?: ReactNode }
>(function PillManagerColumnsLabel(
  { labelText = "Column Pivots", icon = <ColumnPivotIcon />, ...props },
  ref,
) {
  return (
    <PillManagerRowLabel
      {...props}
      className={"lng1771-pill-manager__row-label-built-in"}
      ref={ref}
    >
      {icon}
      <span>{labelText}</span>
    </PillManagerRowLabel>
  );
});

export const PillManagerRowGroupsLabel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { labelText?: string; icon?: ReactNode }
>(function PillManagerColumnsLabel(
  { labelText = "Row Groups", icon = <RowGroupIcon />, ...props },
  ref,
) {
  return (
    <PillManagerRowLabel
      {...props}
      className={"lng1771-pill-manager__row-label-built-in"}
      ref={ref}
    >
      {icon}
      <span>{labelText}</span>
    </PillManagerRowLabel>
  );
});
