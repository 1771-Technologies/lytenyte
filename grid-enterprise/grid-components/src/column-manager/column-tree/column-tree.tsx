import type {
  ListViewItemRendererProps,
  PathTreeInputItem,
  PathTreeNode,
} from "@1771technologies/react-list-view";
import { ListView } from "@1771technologies/react-list-view";
import { useGrid } from "../../provider/grid-provider";
import { useMemo } from "react";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { cc } from "../../component-configuration";
import { t } from "@1771technologies/grid-design";
import { CollapsedIcon, DragIcon, ExpandedIcon } from "../components";
import { Checkbox } from "../../checkbox/checkbox";
import { clsx } from "@1771technologies/js-utils";
import { handleItemHide } from "./handle-item-hide";
import { allLeafs } from "./all-leafs";
import { dragState, useDroppable } from "@1771technologies/react-dragon";
import { itemDragLabel } from "./item-drag-label";

export function ColumnTree() {
  const { api, state } = useGrid();

  const config = cc.columnManager.use();
  const columns = state.columns.use();

  const expansions = state.internal.columnManagerTreeExpansions.use();

  const paths = useMemo(() => {
    const paths = columns.map<PathTreeInputItem<ColumnEnterpriseReact<any>>>((c) => {
      return { path: c.groupPath ?? [], data: c };
    });

    return paths;
  }, [columns]);

  return (
    <ListView
      paths={paths}
      axe={config.columnTree!.axe!}
      expansions={expansions}
      onAction={(item) => {
        handleItemHide(item, api);
      }}
      className={css`
        padding-block-start: 8px;
        box-sizing: border-box;
        max-width: 400px;
        overflow-x: hidden;

        &:focus {
          outline: 1px solid ${t.colors.borders_focus};
          outline-offset: -2px;
        }
      `}
      itemClassName={css`
        padding-inline: ${t.spacing.space_10};
        user-select: none;
        cursor: pointer;

        &:focus {
          outline: none;

          & > div {
            background-color: ${t.colors.backgrounds_default};
            border-radius: ${t.spacing.box_radius_medium};

            position: relative;
            &::before {
              content: "";
              position: absolute;
              inset-inline-start: 0px;
              width: 2px;
              height: 100%;
              background-color: ${t.colors.borders_focus};
            }
          }
        }
      `}
      onExpansionChange={(id, s) =>
        state.internal.columnManagerTreeExpansions.set((prev) => ({ ...prev, [id]: s }))
      }
      itemHeight={30}
      renderer={ColumnTreeRenderer}
    />
  );
}

const treeClx = css`
  display: flex;
  align-items: center;
  gap: 1px;
  height: 100%;
  padding-inline-end: ${t.spacing.space_30};
`;

function ColumnTreeRenderer(props: ListViewItemRendererProps<ColumnEnterpriseReact<any>>) {
  const { api, state } = useGrid();
  const base = state.columnBase.use();
  const columns = state.internal.columnLookup.use();
  const pivotMode = state.columnPivotModeIsOn.use();

  const gridId = state.gridId.use();

  const dragTags = useMemo(() => {
    if (pivotMode) return [];

    return [itemDragLabel(gridId, props.data)];
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

      const target = props.data.type === "leaf" ? props.data.data : allLeafs(props.data).at(0)!;

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
    treeClx,
    isOver &&
      !canDrop &&
      css`
        background-color: ${t.colors.system_red_30};
      `,
    isOver &&
      isBefore &&
      canDrop &&
      css`
        position: relative;
        &::before {
          content: "";
          height: 1px;
          width: 90%;
          position: absolute;
          top: 0px;
          background-color: blue;
        }
      `,
    isOver &&
      !isBefore &&
      canDrop &&
      css`
        position: relative;
        &::after {
          content: "";
          height: 1px;
          width: 90%;
          position: absolute;
          bottom: 0px;
          background-color: blue;
        }
      `,
  );

  if (props.data.type === "leaf") {
    const data = props.data.data;

    const column = columns.get(data.id)!;
    const hidden = column.hide ?? base.hide;
    const hidable = !pivotMode && api.columnIsHidable(column);

    return (
      <div
        style={{
          paddingInlineStart: `calc(${t.spacing.space_30} + ${props.depth > 0 ? props.depth + 1 : 0} * ${t.spacing.space_30} + 22px)`,
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={className}
      >
        <DragIcon data={props.data} dragIndex={props.treeFlatIndex} />
        <Checkbox isDisabled={!hidable} tabIndex={-1} isChecked={!hidden} disabled={!hidable} />
        <span
          className={clsx(
            "lng1771-text-medium",
            css`
              margin-inline-start: 4px;
            `,
            draggedIndex === props.treeFlatIndex &&
              css`
                color: ${t.colors.text_light};
              `,
          )}
        >
          {data.headerName ?? data.id}
        </span>
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
          paddingInlineStart: `calc(${t.spacing.space_30} + ${props.depth} * ${t.spacing.space_30})`,
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={className}
      >
        {props.expanded ? <ExpandedIcon id={id} /> : <CollapsedIcon id={id} />}
        <DragIcon data={props.data} dragIndex={props.treeFlatIndex} />
        <Checkbox
          tabIndex={-1}
          isDisabled={!hidable}
          isChecked={checked || isIndeterminate}
          isDeterminate={isIndeterminate}
        />

        <span
          className={clsx(
            "lng1771-text-medium",
            css`
              margin-inline-start: 4px;
            `,
            draggedIndex === props.treeFlatIndex &&
              css`
                color: ${t.colors.text_light};
              `,
          )}
        >
          {path}
        </span>
      </div>
    );
  }
}
