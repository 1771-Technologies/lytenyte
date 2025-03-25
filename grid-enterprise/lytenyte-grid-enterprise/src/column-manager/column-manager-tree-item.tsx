import { forwardRef, useId, type JSX } from "react";
import type { ListViewItemRendererProps } from "../list-view/list-view";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useGrid } from "../use-grid";
import { ArrowDownIcon, ArrowRightIcon, DragIcon } from "../icons";
import {
  Checkbox,
  useDraggable,
  useDroppable,
} from "@1771technologies/lytenyte-grid-community/internal";
import { allLeafs } from "./utils/all-leafs";
import { clsx } from "@1771technologies/js-utils";
import { useCombinedRefs } from "@1771technologies/react-utils";

export const ColumnManagerTreeItem = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & {
    columnItem: ListViewItemRendererProps<ColumnEnterpriseReact<any>>;
    depthPadding?: number;
  }
>(function TreeItem({ className, depthPadding = 12, style, columnItem: ci, ...props }, ref) {
  const { api, state } = useGrid();
  const base = state.columnBase.use();
  const columns = state.internal.columnLookup.use();
  const pivotMode = state.columnPivotModeIsOn.use();
  const labelId = useId();

  const { onPointerDown } = useDraggable({
    id: ci.data.type === "leaf" ? ci.data.data.id : ci.data.occurrence,
    getData: () => ci.data,
    getTags: () => ["columns"],
  });

  const {
    ref: dropRef,
    canDrop,
    yHalf,
  } = useDroppable({
    id: ci.data.type === "leaf" ? ci.data.data.id : ci.data.occurrence,
    accepted: ["columns"],
    data: ci.data,
  });

  const combinedRefs = useCombinedRefs(ref, dropRef);

  if (ci.data.type === "leaf") {
    const data = ci.data.data;

    const column = columns.get(data.id)!;
    const hidden = column.hide ?? base.hide;
    const hidable = !pivotMode && api.columnIsHidable(column);

    return (
      <div
        {...props}
        className={clsx("lng1771-column-manager__tree-item", className)}
        ref={combinedRefs}
        data-can-drop={canDrop}
        style={{
          paddingInlineStart: `calc(${depthPadding}px + ${ci.depth > 0 ? ci.depth + 1 : 0} * ${depthPadding}px + 22px)`,
          ...style,
        }}
      >
        {canDrop && yHalf === "top" && (
          <div className="lng1771-column-manager__tree-item-drop-indicator-top" />
        )}
        {canDrop && yHalf === "bottom" && (
          <div className="lng1771-column-manager__tree-item-drop-indicator-bottom" />
        )}
        <DragIcon onPointerDown={onPointerDown} />
        <Checkbox
          htmlFor={labelId}
          aria-labelledby={labelId}
          isDisabled={!hidable}
          tabIndex={-1}
          isChecked={!hidden}
          disabled={!hidable}
        />

        <label id={labelId}>{data.headerName ?? data.id}</label>
      </div>
    );
  } else {
    const id = ci.data.occurrence;
    const path = ci.data.path.at(-1)!;

    const columns = allLeafs(ci.data);
    const checked = columns.every((c) => !(c.hide ?? base.hide));
    const isIndeterminate = columns.some((c) => !(c.hide ?? base.hide)) && !checked;

    const hidable = !pivotMode && columns.every((c) => api.columnIsHidable(c));

    return (
      <div
        {...props}
        style={{
          paddingInlineStart: `calc(${depthPadding}px + ${ci.depth} * ${depthPadding}px)`,
          ...style,
        }}
        ref={combinedRefs}
        className={clsx("lng1771-column-manager__tree-item", className)}
      >
        {canDrop && yHalf === "top" && (
          <div className="lng1771-column-manager__tree-item-drop-indicator-top" />
        )}
        {canDrop && yHalf === "bottom" && (
          <div className="lng1771-column-manager__tree-item-drop-indicator-bottom" />
        )}
        <button
          className="lng1771-column-manager__tree-item-expander"
          onFocus={(ev) => ev.currentTarget.blur()}
          onClick={(ev) => {
            ev.stopPropagation();
            state.internal.columnManagerTreeExpansions.set((prev) => ({
              ...prev,
              [id]: !ci.expanded,
            }));
          }}
        >
          {ci.expanded ? (
            <ArrowDownIcon width={16} height={16} id={id} />
          ) : (
            <ArrowRightIcon id={id} width={16} height={16} />
          )}
        </button>
        <DragIcon onPointerDown={onPointerDown} />
        <Checkbox
          htmlFor={labelId}
          aria-labelledby={labelId}
          tabIndex={-1}
          isDisabled={!hidable}
          isChecked={checked || isIndeterminate}
          isDeterminate={isIndeterminate}
        />

        <label id={labelId}>{path}</label>
      </div>
    );
  }
});
