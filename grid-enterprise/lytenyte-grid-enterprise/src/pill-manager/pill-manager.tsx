import "./pill-manager.css";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { GridProvider } from "../use-grid";
import { createContext, forwardRef, useContext, useMemo, type JSX, type ReactNode } from "react";
import { PillManagerPills } from "./pill-manager-pills/pill-manager-pills";
import { PillManagerPill } from "./pill-manager-pill";
import { PillManagerRow } from "./pill-manager-row";
import {
  PillManagerAggLabel,
  PillManagerColumnPivotsLabel,
  PillManagerColumnsLabel,
  PillManagerMeasureLabel,
  PillManagerRowGroupsLabel,
  PillManagerRowLabel,
} from "./pill-manager-row-label";
import { PillManagerRows } from "./pill-manager-rows";
import { clsx } from "@1771technologies/js-utils";
import { PillManagerExpander } from "./pill-manager-expander";
import { PillManagerSeparator } from "./pill-manager-separator";
import { DragProvider } from "@1771technologies/lytenyte-grid-community/internal";
import { PillManagerDragPlaceholder } from "./pill-manager-drag-placeholder";
import { PillManagerControlsProvider } from "./pill-manager-controls";
import {
  PillManagerAggMenu,
  PillManagerMeasureMenu,
  type PillManagerAggMenuProps,
} from "./pill-manager-agg-menu";

interface RootProps<D = any> {
  readonly grid: StoreEnterpriseReact<D>;
  readonly aggMenuRenderer?: (p: PillManagerAggMenuProps<D>) => ReactNode;
  readonly measureMenuRenderer?: (p: PillManagerAggMenuProps<D>) => ReactNode;
}

const context = createContext<{
  readonly aggMenuRenderer: (p: PillManagerAggMenuProps<any>) => ReactNode;
  readonly measureMenuRenderer: (p: PillManagerAggMenuProps<any>) => ReactNode;
}>({} as any);

export const useComponents = () => useContext(context);

const Root = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RootProps>(function Root(
  { grid, children, aggMenuRenderer, measureMenuRenderer, ...props },
  ref,
) {
  const components = useMemo(() => {
    return {
      aggMenuRenderer: aggMenuRenderer ?? PillManagerAggMenu,
      measureMenuRenderer: measureMenuRenderer ?? PillManagerMeasureMenu,
    };
  }, [aggMenuRenderer, measureMenuRenderer]);

  return (
    <context.Provider value={components}>
      <DragProvider>
        <GridProvider value={grid}>
          <PillManagerControlsProvider>
            <RootImpl {...props} ref={ref}>
              {children}
            </RootImpl>
          </PillManagerControlsProvider>
        </GridProvider>
      </DragProvider>
    </context.Provider>
  );
});

const RootImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RootImpl(
  { children, ...props },
  ref,
) {
  return (
    <div {...props} className={clsx("lng1771-pill-manager", props.className)} ref={ref}>
      {children}
    </div>
  );
});

export const PillManager = {
  Root,
  Rows: PillManagerRows,
  Row: PillManagerRow,
  RowLabel: PillManagerRowLabel,
  RowLabelColumns: PillManagerColumnsLabel,
  RowLabelMeasures: PillManagerMeasureLabel,
  RowLabelAggregations: PillManagerAggLabel,
  RowLabelColumnPivots: PillManagerColumnPivotsLabel,
  RowLabelRowGroups: PillManagerRowGroupsLabel,
  Separator: PillManagerSeparator,
  Expander: PillManagerExpander,
  Pills: PillManagerPills,
  Pill: PillManagerPill,

  DragPlaceholder: PillManagerDragPlaceholder,
};
