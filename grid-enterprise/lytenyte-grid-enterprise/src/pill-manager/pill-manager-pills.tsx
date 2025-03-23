import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import type { PillManagerPillItem } from "./pill-manager";
import { clsx } from "@1771technologies/js-utils";

export interface RowProps {
  readonly pillSource: "columns" | "column-pivots" | "row-groups" | "measures" | "aggregations";
  readonly children: (p: { pills: PillManagerPillItem[] }) => ReactNode;
}

export const PillManagerPills = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & RowProps
>(function PillManagerRow({ pillSource, children, ...props }, ref) {
  const { api, state: sx } = useGrid();

  const rowModel = sx.rowGroupModel.peek();
  const columns = sx.columns.peek();
  const measureModel = sx.measureModel.peek();
  const aggModel = sx.aggModel.peek();
  const pivotModel = sx.columnPivotModel.peek();

  const sourceItems = useMemo(() => {
    if (pillSource === "columns") {
      const active: PillManagerPillItem[] = [];
      const inactive: PillManagerPillItem[] = [];

      for (const c of columns) {
        if (api.columnIsGridGenerated(c)) continue;

        if (api.columnIsVisible(c, true)) {
          active.push({ kind: "column", active: true, label: c.headerName ?? c.id });
        } else {
          inactive.push({ kind: "column", active: false, label: c.headerName ?? c.id });
        }
      }

      return [...active, ...inactive];
    }
    if (pillSource === "column-pivots") {
      const appliedPivots = new Set(pivotModel);
      const canBePivotted = columns.filter(
        (c) => !appliedPivots.has(c.id) && api.columnIsPivotable(c),
      );
      const pivttedColumns = pivotModel.map((c) => api.columnById(c)!);

      const activeItems = pivttedColumns.map<PillManagerPillItem>((c) => ({
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: true,
      }));

      const inactiveItems = canBePivotted.map<PillManagerPillItem>((c) => ({
        kind: "column-pivot",
        label: c.headerName ?? c.id,
        active: false,
      }));

      return [...activeItems, ...inactiveItems];
    }

    if (pillSource === "row-groups") {
      const activeItems = rowModel
        .map((c) => api.columnById(c)!)
        .map<PillManagerPillItem>((c) => ({
          kind: "row-group",
          label: c.headerName ?? c.id,
          active: true,
        }));
      const inactiveItems = columns
        .filter((c) => api.columnIsRowGroupable(c) && !rowModel.includes(c.id))
        .map<PillManagerPillItem>((c) => ({
          kind: "row-group",
          label: c.headerName ?? c.id,
          active: true,
        }));

      return [...activeItems, ...inactiveItems];
    }

    if (pillSource === "aggregations") {
      const entries = Object.entries(aggModel);

      const active: PillManagerPillItem[] = [];
      for (const [key, m] of entries) {
        let column = api.columnById(key) ?? null;
        if (column && (api.columnIsPivot(column) || api.columnIsGridGenerated(column)))
          column = null;

        const secondaryLabel = typeof m.fn === "string" ? `(${m.fn})` : "Fn(x)";
        if (column) {
          active.push({
            kind: "column",
            active: true,
            label: column.headerName ?? column.id,
            secondaryLabel,
          });
        } else {
          active.push({ kind: "column", active: true, label: key, secondaryLabel });
        }
      }

      const base = sx.columnBase.peek();
      const inactive = columns
        .filter((c) => {
          const agg =
            c.aggFn ??
            c.aggFnDefault ??
            c.aggFnsAllowed?.length ??
            base.aggFn ??
            base.aggFnsAllowed?.length;
          const isAgged = !!aggModel[c.id];

          return !!agg && !isAgged;
        })
        .map<PillManagerPillItem>((c) => {
          const aggFn =
            c.aggFn ??
            c.aggFnDefault ??
            c.aggFnsAllowed?.[0] ??
            base.aggFn ??
            base.aggFnsAllowed?.at(0);
          const aggName = typeof aggFn === "string" ? `(${aggFn})` : "Fn(x)";

          return {
            kind: "column",
            label: c.headerName ?? c.id,
            active: false,
            secondaryLabel: aggName,
          };
        });

      return [...active, ...inactive];
    }

    if (pillSource === "measures") {
      const entries = Object.entries(measureModel);

      const active: PillManagerPillItem[] = [];
      for (const [key, m] of entries) {
        let column = api.columnById(key) ?? null;
        if (column && (api.columnIsPivot(column) || api.columnIsGridGenerated(column)))
          column = null;

        const secondaryLabel = typeof m.fn === "string" ? `(${m.fn})` : "Fn(x)";
        if (column) {
          active.push({
            kind: "column",
            active: true,
            label: column.headerName ?? column.id,
            secondaryLabel,
          });
        } else {
          active.push({ kind: "column", active: true, label: key, secondaryLabel });
        }
      }

      const base = sx.columnBase.peek();
      const inactive = columns
        .filter((c) => {
          const measure =
            c.measureFn ??
            c.measureFnDefault ??
            c.measureFnsAllowed?.length ??
            base.measureFn ??
            base.measureFnsAllowed?.length;
          const isMeasured = !!measureModel[c.id];

          return !!measure && !isMeasured;
        })

        .map<PillManagerPillItem>((c) => {
          const measureFn =
            c.measureFn ??
            c.measureFnDefault ??
            c.measureFnsAllowed?.[0] ??
            base.measureFn ??
            base.measureFnsAllowed?.at(0);
          const measureName = typeof measureFn === "string" ? `(${measureFn})` : "Fn(x)";

          return {
            kind: "column",
            label: c.headerName ?? c.id,
            active: false,
            secondaryLabel: measureName,
          };
        });

      return [...active, ...inactive];
    }

    return [];
  }, [aggModel, api, columns, measureModel, pillSource, pivotModel, rowModel, sx.columnBase]);

  return (
    <div
      {...props}
      className={clsx("lng1771-pill-manager__pills", props.className)}
      ref={ref}
      data-pill-source={pillSource}
    >
      {children({ pills: sourceItems })}
    </div>
  );
});
