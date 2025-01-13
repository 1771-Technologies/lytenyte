import { t } from "@1771technologies/grid-design";
import { IconButton } from "../buttons/icon-button";
import { useGrid } from "../provider/grid-provider";
import type { PathTreeNode } from "@1771technologies/react-list-view";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import { useDraggable } from "@1771technologies/react-dragon";
import { itemDragLabel } from "./column-tree/item-drag-label";
import { allLeafs } from "./column-tree/all-leafs";

export const ExpandedIcon = ({ id }: { id: string }) => {
  const { state } = useGrid();

  return (
    <IconButton
      tabIndex={-1}
      kind="ghost"
      small
      onFocus={(ev) => ev.currentTarget.blur()}
      onClick={(ev) => {
        ev.stopPropagation();
        state.internal.columnManagerTreeExpansions.set((prev) => ({ ...prev, [id]: false }));
      }}
      className={css`
        transform: rotate(90deg);
        color: ${t.colors.borders_icons_default};
        font-size: 20px;
      `}
    >
      <span
        className={css`
          position: relative;
          inset-block-end: 2px;
        `}
      >
        ›
      </span>
    </IconButton>
  );
};

export const CollapsedIcon = ({ id }: { id: string }) => {
  const { state } = useGrid();
  return (
    <IconButton
      tabIndex={-1}
      kind="ghost"
      onClick={(ev) => {
        ev.stopPropagation();
        state.internal.columnManagerTreeExpansions.set((prev) => ({ ...prev, [id]: true }));
      }}
      small
      className={css`
        color: ${t.colors.borders_icons_default};
        font-size: 20px;
      `}
    >
      <span
        className={css`
          position: relative;
          inset-block-end: 2px;
        `}
      >
        ›
      </span>
    </IconButton>
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
    return [itemDragLabel(gridId, data)];
  }, [data, gridId]);

  const isMovable = useMemo(() => {
    if (data.type === "parent") {
      const all = allLeafs(data);
      return all.every((c) => api.columnIsMovable(c));
    }

    return api.columnIsMovable(data.data);
  }, [api, data]);

  const drag = useDraggable({
    dragData: () => ({ node: data, index: dragIndex }),
    dragTags: () => dragTag,
    placeholder: () => <div>Ragi</div>,
    disabled: !isMovable,
  });

  return (
    <IconButton
      {...drag}
      tabIndex={-1}
      kind="ghost"
      small
      disabled={!isMovable}
      onClick={(ev) => {
        ev.stopPropagation();
      }}
    >
      <span
        className={css`
          display: grid;
          grid-template-columns: 2px 2px;
          grid-template-rows: 2px 2px 2px;
          grid-row-gap: 2px;
          grid-column-gap: 2px;

          & span {
            background-color: ${t.colors.borders_icons_default};
          }
        `}
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </IconButton>
  );
};
