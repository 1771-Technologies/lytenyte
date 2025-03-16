import "./components.css";
import type { PathTreeNode } from "@1771technologies/react-list-view";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import { useDraggable } from "@1771technologies/react-dragon";
import { itemDragTag } from "./item-drag-label";
import { allLeafs } from "./all-leafs";
import { groupTag, measureTag, pivotTag, valueTag } from "../box-drop-zone/tags";
import { Button } from "../../../components-internal/button/button";
import { useGrid } from "../../../use-grid";
import { DragPlaceholder } from "../../../components-internal/drag-placeholder/drag-placeholder";

export const ExpandedIcon = ({ id }: { id: string }) => {
  const { state } = useGrid();

  return (
    <Button
      tabIndex={-1}
      kind="tertiary"
      onFocus={(ev) => ev.currentTarget.blur()}
      onClick={(ev) => {
        ev.stopPropagation();
        state.internal.columnManagerTreeExpansions.set((prev) => ({ ...prev, [id]: false }));
      }}
      className="lng1771-column-manager__expanded-icon"
    >
      <span>›</span>
    </Button>
  );
};

export const CollapsedIcon = ({ id }: { id: string }) => {
  const { state } = useGrid();
  return (
    <Button
      tabIndex={-1}
      kind="tertiary"
      onClick={(ev) => {
        ev.stopPropagation();
        state.internal.columnManagerTreeExpansions.set((prev) => ({ ...prev, [id]: true }));
      }}
      className="lng1771-column-manager__collapsed-icon"
    >
      <span>›</span>
    </Button>
  );
};

export const DragIcon = ({
  data,
  dragIndex,
}: {
  data: PathTreeNode<ColumnEnterpriseReact<any>>;
  dragIndex: number;
}) => {
  const { state, api } = useGrid();

  const gridId = state.gridId.use();
  const dragTag = useMemo(() => {
    const tags: string[] = [];
    const base = api.getState().columnBase.peek();

    const columns = data.type === "parent" ? allLeafs(data) : [data.data];
    const isMovable = columns.every((p) => api.columnIsMovable(p));
    const isRowGroupable = columns.every((p) => api.columnIsRowGroupable(p));
    const isPivotable = columns.every((p) => api.columnIsPivotable(p));
    const isMeasurable = columns.every((p) => api.columnIsMeasurable(p));
    const isAggregate = columns.every((p) =>
      Boolean(p.aggFuncDefault ?? p.aggFuncsAllowed?.length ?? base.aggFuncsAllowed?.length),
    );

    if (isRowGroupable) tags.push(groupTag(gridId));
    if (isMovable) tags.push(itemDragTag(gridId, data));
    if (isPivotable) tags.push(pivotTag(gridId));
    if (isMeasurable) tags.push(measureTag(gridId));
    if (isAggregate) tags.push(valueTag(gridId));

    return tags;
  }, [api, data, gridId]);

  const drag = useDraggable({
    dragData: () => ({ node: data, index: dragIndex }),
    dragTags: () => dragTag,
    placeholder: () => (
      <DragPlaceholder
        label={data.type === "leaf" ? (data.data.headerName ?? data.data.id) : data.path.at(-1)!}
      />
    ),
  });

  return (
    <Button
      {...drag}
      tabIndex={-1}
      kind="tertiary"
      className="lng1771-column-manager__drag-button"
      disabled={dragTag.length === 0}
      onClick={(ev) => {
        ev.stopPropagation();
      }}
    >
      <span className="lng1771-column-manager__drag-icon">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </Button>
  );
};
