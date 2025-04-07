import "./column-manager.css";
import { clsx } from "@1771technologies/js-utils";
import { DragProvider } from "@1771technologies/lytenyte-core/internal";
import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import { GridProvider } from "../use-grid";
import { ColumnStateProvider } from "./column-manager-state";
import { ColumnManagerTree } from "./column-manager-tree";
import { ColumnManagerTreeItem } from "./column-manager-tree-item";
import { ColumnManagerDragPlaceholder } from "./column-manager-drag-placeholder";
import { ColumnManagerDragBox } from "./column-manager-drag-box";
import { ColumnManagerDragBoxControls } from "./column-manager-drag-box-controls";
import { ColumnManagerDragBoxLabel } from "./column-manager-drag-box-label";
import { ColumnManagerDragBoxExpander } from "./column-manager-drag-box-expander";
import { ColumnManagerDropZone, ColumnManagerDropZoneVisibility } from "./column-manager-drop-zone";
import { Separator } from "../components-internal/separator/separator";
import {
  PillManagerAggMenu,
  PillManagerMeasureMenu,
  type PillManagerAggMenuProps,
} from "../pill-manager/pill-manager-agg-menu";
import { MoreDotsIcon } from "../icons";
import { ColumnManagerPill } from "./column-manager-pill";
import { ColumnMangerContextProvider } from "./column-mananger-context";
import { ColumnManagerSearch } from "./column-manager-search";
import { PivotModeToggle } from "./column-manager-pivot-mode-toggle";
import type { GridProReact } from "../types";

interface RootProps<D = any> {
  readonly aggMenuRenderer?: (p: PillManagerAggMenuProps<D>) => ReactNode;
  readonly measureMenuRenderer?: (p: PillManagerAggMenuProps<D>) => ReactNode;
  readonly menuTriggerIcon?: (p: JSX.IntrinsicElements["svg"]) => ReactNode;
  readonly grid: GridProReact<D>;
}

const Root = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RootProps>(function Root(
  { children, className, grid, aggMenuRenderer, measureMenuRenderer, menuTriggerIcon, ...props },
  ref,
) {
  const components = useMemo(() => {
    return {
      aggMenuRenderer: aggMenuRenderer ?? PillManagerAggMenu,
      measureMenuRenderer: measureMenuRenderer ?? PillManagerMeasureMenu,
      menuTriggerIcon: menuTriggerIcon ?? MoreDotsIcon,
    };
  }, [aggMenuRenderer, measureMenuRenderer, menuTriggerIcon]);

  return (
    <ColumnStateProvider>
      <ColumnMangerContextProvider value={components}>
        <GridProvider value={grid}>
          <DragProvider>
            <div {...props} className={clsx("lng1771-column-manager", className)} ref={ref}>
              {children}
            </div>
          </DragProvider>
        </GridProvider>
      </ColumnMangerContextProvider>
    </ColumnStateProvider>
  );
});

export const ColumnManager = {
  Root,
  Tree: ColumnManagerTree,
  TreeItem: ColumnManagerTreeItem,
  PivotModeToggle: PivotModeToggle,

  Separator: Separator,
  Search: ColumnManagerSearch,

  DragBox: ColumnManagerDragBox,
  DragBoxControls: ColumnManagerDragBoxControls,
  DragBoxLabel: ColumnManagerDragBoxLabel,
  DragBoxExpander: ColumnManagerDragBoxExpander,
  DropZoneVisibility: ColumnManagerDropZoneVisibility,
  DropZone: ColumnManagerDropZone,
  Pill: ColumnManagerPill,

  DragPlaceholder: ColumnManagerDragPlaceholder,
};
