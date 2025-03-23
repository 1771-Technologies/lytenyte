import "./pill-manager.css";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { GridProvider } from "../use-grid";
import { forwardRef, type JSX } from "react";
import { type PillProps } from "../pill/pill";
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

interface RootProps {
  readonly grid: StoreEnterpriseReact<any>;
}

const Root = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RootProps>(function Root(
  { grid, children, ...props },
  ref,
) {
  return (
    <DragProvider>
      <GridProvider value={grid}>
        <div {...props} className={clsx("lng1771-pill-manager", props.className)} ref={ref}>
          {children}
        </div>
      </GridProvider>
    </DragProvider>
  );
});

export type DragTag = "row-group" | "column-pivot" | "columns" | "aggregations" | "measures";

export interface PillManagerPillItem {
  readonly kind: Required<PillProps>["kind"];
  readonly label: string;
  readonly secondaryLabel?: string;
  readonly active: boolean;

  readonly draggable: boolean;
  readonly dragTags: DragTag[];
  readonly dragData?: any;
  readonly dropTags: DragTag[];

  readonly onClick: () => void;
}

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
