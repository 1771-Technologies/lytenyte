import { clsx } from "@1771technologies/js-utils";
import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import { useDragBox } from "./column-manager-drag-box";
import { ColumnPivotIcon, MeasuresIcon, RowGroupIcon } from "../icons";

interface ColumnManagerDragBoxLabelProps {
  icon?: ReactNode;
}

export const ColumnManagerDragBoxLabel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & ColumnManagerDragBoxLabelProps
>(function ColumnManagerDragBoxLabel({ className, children, icon, ...props }, ref) {
  const { pillSource: source } = useDragBox();

  const I = useMemo(() => {
    if (icon) return icon;

    if (source === "aggregations") return <MeasuresIcon />;
    if (source === "measures") return <MeasuresIcon />;
    if (source === "column-pivots") return <ColumnPivotIcon />;
    if (source === "row-groups") return <RowGroupIcon />;
  }, [icon, source]);

  return (
    <div {...props} className={clsx("lng1771-column-manager__drag-box-label", className)} ref={ref}>
      {I}
      {children}
    </div>
  );
});
