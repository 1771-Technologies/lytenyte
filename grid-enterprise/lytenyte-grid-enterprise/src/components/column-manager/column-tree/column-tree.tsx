import "./column-tree.css";
import type {
  ListViewItemRendererProps,
  PathTreeInputItem,
  PathTreeNode,
  ListViewAxe,
} from "@1771technologies/react-list-view";
import { ListView } from "@1771technologies/react-list-view";
import { useId, useMemo } from "react";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { CollapsedIcon, DragIcon, ExpandedIcon } from "./components";
import { clsx } from "@1771technologies/js-utils";
import { handleItemHide } from "./handle-item-hide";
import { allLeafs } from "./all-leafs";
import { dragState, useDroppable } from "@1771technologies/react-dragon";
import { itemDragTag } from "./item-drag-label";
import { Checkbox } from "@1771technologies/lytenyte-grid-community/internal";
import { useGrid } from "../../../use-grid";

const itemAxe: ListViewAxe<any> = {
  axeDescription:
    "Select an item. Use the up and down arrow keys to navigate to an item. " +
    "Press enter to accept the option. Escape to cancel.",
  axeItemLabels: (item) => (item.type === "leaf" ? item.data.label : ""),
  axeLabel: (cnt) => `There are ${cnt} items to choose from`,
};

interface ColumnTree {
  readonly query?: string;
}

export function ColumnTree({ query = "" }: ColumnTree) {
  const { api, state } = useGrid();

  const columns = state.columns.use();

  const expansions = state.internal.columnManagerTreeExpansions.use();

  const paths = useMemo(() => {
    const paths = columns
      .filter((c) => {
        if (api.columnIsGridGenerated(c) && !api.columnIsGroupAutoColumn(c)) return false;

        if (!query) return true;

        const label = c.headerName ?? c.id;
        return label.toLowerCase().includes(query.toLowerCase());
      })
      .map<PathTreeInputItem<ColumnEnterpriseReact<any>>>((c) => {
        return { path: c.groupPath ?? [], data: c };
      });

    return paths;
  }, [api, columns, query]);

  return (
    <ListView
      paths={paths}
      axe={itemAxe}
      expansions={expansions}
      onAction={(item) => {
        handleItemHide(item, api);
      }}
      className="lng1771-column-manager__column-tree"
      itemClassName="lng1771-column-manager__column-tree-item"
      onExpansionChange={(id, s) =>
        state.internal.columnManagerTreeExpansions.set((prev) => ({ ...prev, [id]: s }))
      }
      itemHeight={30}
      renderer={ColumnTreeRenderer}
    />
  );
}

function ColumnTreeRenderer(props: ListViewItemRendererProps<ColumnEnterpriseReact<any>>) {
  const { api, state } = useGrid();
  const base = state.columnBase.use();
  const columns = state.internal.columnLookup.use();
  const pivotMode = state.columnPivotModeIsOn.use();
  const labelId = useId();

  const gridId = state.gridId.use();

  const dragTags = useMemo(() => {
    if (pivotMode) return [];

    const tags = [itemDragTag(gridId, props.data)];

    return tags;
  }, [gridId, pivotMode, props.data]);

  const draggedIndex = (dragState.dragData.use()?.() as { index?: number })?.index ?? -1;
  const isBefore = props.treeFlatIndex < draggedIndex;

  dragState.dragActive.use();

  const { isOver, canDrop, onDragOver, onDrop } = useDroppable({
    tags: dragTags,

    onDrop: (p) => {
      const dropData = p.getData() as { node: PathTreeNode<ColumnEnterpriseReact<any>> };

      const columns =
        dropData.node.type === "leaf" ? [dropData.node.data] : allLeafs(dropData.node);

      const target = props.data.type === "leaf" ? props.data.data : allLeafs(props.data).at(-1)!;

      // It contains the target, so the move doesn't make sense
      if (columns.find((c) => c.id === target.id)) return;

      if (isBefore)
        api.columnMoveBefore(
          columns.map((c) => c.id),
          target.id,
        );
      else
        api.columnMoveAfter(
          columns.map((c) => c.id),
          target.id,
        );
    },
  });

  const className = clsx(
    "lng1771-column-manager__column-renderer",
    isOver && !canDrop && "lng1771-column-manager__column-renderer--is-over-cannot-drop",
    isOver &&
      isBefore &&
      canDrop &&
      "lng1771-column-manager__column-renderer--is-over-can-drop-before",
    isOver &&
      !isBefore &&
      canDrop &&
      "lng1771-column-manager__column-renderer--is-over-can-drop-after",
  );

  if (props.data.type === "leaf") {
    const data = props.data.data;

    const column = columns.get(data.id)!;
    const hidden = column.hide ?? base.hide;
    const hidable = !pivotMode && api.columnIsHidable(column);

    return (
      <div
        style={{
          paddingInlineStart: `calc(12px + ${props.depth > 0 ? props.depth + 1 : 0} * 12px + 22px)`,
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={className}
      >
        <DragIcon data={props.data} dragIndex={props.treeFlatIndex} />
        <Checkbox
          htmlFor={labelId}
          aria-labelledby={labelId}
          isDisabled={!hidable}
          tabIndex={-1}
          isChecked={!hidden}
          disabled={!hidable}
        />
        <label
          id={labelId}
          className={clsx(
            "lng1771-column-manager__column-renderer-label",
            draggedIndex === props.treeFlatIndex &&
              "lng1771-column-manager__column-renderer-label--dragging",
          )}
        >
          {data.headerName ?? data.id}
        </label>
      </div>
    );
  } else {
    const id = props.data.occurrence;
    const path = props.data.path.at(-1)!;

    const columns = allLeafs(props.data);
    const checked = columns.every((c) => !(c.hide ?? base.hide));
    const isIndeterminate = columns.some((c) => !(c.hide ?? base.hide)) && !checked;

    const hidable = !pivotMode && columns.every((c) => api.columnIsHidable(c));

    return (
      <div
        style={{
          paddingInlineStart: `calc(12px + ${props.depth > 0 ? props.depth + 1 : 0} * 12px + 22px)`,
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={className}
      >
        {props.expanded ? <ExpandedIcon id={id} /> : <CollapsedIcon id={id} />}
        <DragIcon data={props.data} dragIndex={props.treeFlatIndex} />
        <Checkbox
          htmlFor={labelId}
          aria-labelledby={labelId}
          tabIndex={-1}
          isDisabled={!hidable}
          isChecked={checked || isIndeterminate}
          isDeterminate={isIndeterminate}
        />

        <label
          id={labelId}
          className={clsx(
            "lng1771-column-manager__column-renderer-label",
            draggedIndex === props.treeFlatIndex &&
              "lng1771-column-manager__column-renderer-label--dragging",
          )}
        >
          {path}
        </label>
      </div>
    );
  }
}
