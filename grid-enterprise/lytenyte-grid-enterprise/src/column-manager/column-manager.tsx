import "./column-manager.css";
/**
 * <Root>
 *  <ColumnTree>
 *      <ColumnTreeItem/>
 *  </ColumnTree>
 *  <DragBox source="row-groups">
 *      <DragBoxLabel />
 *      <DragBoxExpander />
 *      <DragBoxPills>
 *          <DragBoxPill />
 *      </DragBoxPills>
 *  </DragBox>
 * </Root>
 */

import { clsx } from "@1771technologies/js-utils";
import { DragProvider } from "@1771technologies/lytenyte-grid-community/internal";
import { forwardRef, type JSX } from "react";
import { GridProvider } from "../use-grid";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { ColumnStateProvider } from "./column-manager-state";
import { ColumnManagerTree } from "./column-manager-tree";
import { ColumnManagerTreeItem } from "./column-manager-tree-item";
import { ColumnManagerDragPlaceholder } from "./column-manager-drag-placeholder";
import { ColumnManagerDragBox } from "./column-manager-drag-box";
import { ColumnManagerDragBoxControls } from "./column-manager-drag-box-controls";
import { ColumnManagerDragBoxLabel } from "./column-manager-drag-box-label";
import { ColumnManagerDragBoxExpander } from "./column-manager-drag-box-expander";
import { ColumnManagerDropZone } from "./column-manager-drop-zone";
import { Separator } from "../components-internal/separator/separator";

interface RootProps<D = any> {
  readonly grid: StoreEnterpriseReact<D>;
}

const Root = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RootProps>(function Root(
  { children, className, grid, ...props },
  ref,
) {
  return (
    <ColumnStateProvider>
      <GridProvider value={grid}>
        <DragProvider>
          <div {...props} className={clsx("lng1771-column-manager", className)} ref={ref}>
            {children}
          </div>
        </DragProvider>
      </GridProvider>
    </ColumnStateProvider>
  );
});

export const ColumnManager = {
  Root,
  Tree: ColumnManagerTree,
  TreeItem: ColumnManagerTreeItem,

  Separator: Separator,

  DragBox: ColumnManagerDragBox,
  DragBoxControls: ColumnManagerDragBoxControls,
  DragBoxLabel: ColumnManagerDragBoxLabel,
  DragBoxExpander: ColumnManagerDragBoxExpander,
  DropZone: ColumnManagerDropZone,

  DragPlaceholder: ColumnManagerDragPlaceholder,
};
