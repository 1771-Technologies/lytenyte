import { useMemo, type KeyboardEvent, type MouseEvent } from "react";
import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { Pill } from "../../pills/pill";
import { PillWrapper } from "./pill-wrapper";
import { PillDelete, PillDragger } from "./components";
import { useDraggable, useDroppable } from "@1771technologies/react-dragon";
import { clsx } from "@1771technologies/js-utils";
import { dragCls, dragClsFirst } from "./classes";
import { getColumns, getDataSource } from "./get-columns-from-drag-data";
import { groupTag, measureTag, pivotTag } from "./tags";
import { insertIdsIntoModel } from "./insert-ids-in-model";
import { useEvent } from "@1771technologies/react-utils";
import { groupSource, measureSource, pivotSource } from "./sources";

export function RowGroupsBox() {
  const { state, api } = useGrid();
  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconRowGroups!;

  const model = state.rowGroupModel.use();
  const columns = useMemo(() => {
    return model.map((c) => api.columnById(c)!);
  }, [api, model]);

  const gridId = state.gridId.use();
  const tags = useMemo(() => {
    return [groupTag(gridId)];
  }, [gridId]);

  return (
    <BoxDropZone
      items={columns}
      renderer={RowGroupsPillRenderer}
      collapsed={!expansions.rowGroups}
      onCollapseChange={() => {
        boxExpansions.set((p) => ({ ...p, rowGroups: !p.rowGroups }));
      }}
      emptyIcon={<Empty />}
      icon={<Icon />}
      emptyLabel={config.labelEmptyRowGroups!}
      label={config.labelRowGroups!}
      tags={tags}
      onDrop={(p) => {
        const data = p.getData();
        const columns = getColumns(data).map((c) => c.id);
        const source = getDataSource(data);
        const index = model.length;
        const newModel = insertIdsIntoModel(model, columns, index);

        if (source === pivotSource) {
          state.columnPivotModel.set((prev) => prev.filter((c) => !columns.includes(c)));
        }
        if (source === measureSource) {
          state.measureModel.set((prev) => prev.filter((c) => !columns.includes(c)));
        }

        state.rowGroupModel.set(newModel);
      }}
    />
  );
}

function RowGroupsPillRenderer({ column, index }: BoxDropZoneRendererProps) {
  const grid = useGrid();
  const config = cc.columnManager.use();
  const Placeholder = config.dragPlaceholder!;
  const gridId = grid.state.gridId.use();
  const drag = useDraggable({
    dragData: () => ({ column, source: groupSource }),
    dragTags: () => {
      const tags = [groupTag(gridId)];

      const isP = grid.api.columnIsPivotable(column);
      const isM = grid.api.columnIsMeasurable(column);
      if (isP) tags.push(pivotTag(gridId));
      if (isM) tags.push(measureTag(gridId));

      return tags;
    },
    placeholder: () => <Placeholder label={column.headerName ?? column.id} />,
  });

  const groupTags = useMemo(() => {
    return [groupTag(gridId)];
  }, [gridId]);

  const { isOver, canDrop, ...props } = useDroppable({
    tags: groupTags,
    onDrop: (p) => {
      const data = p.getData();
      const columns = getColumns(data).map((c) => c.id);
      const source = getDataSource(data);

      if (source === pivotSource) {
        grid.state.columnPivotModel.set((prev) => prev.filter((c) => !columns.includes(c)));
      }
      if (source === measureSource) {
        grid.state.measureModel.set((prev) => prev.filter((c) => !columns.includes(c)));
      }

      const newModel = insertIdsIntoModel(grid.state.rowGroupModel.peek(), columns, index);
      grid.state.rowGroupModel.set(newModel);
    },
  });

  const del = useEvent((ev: KeyboardEvent | MouseEvent) => {
    grid.state.rowGroupModel.set((prev) => prev.filter((c) => c !== column.id));
    ev.preventDefault();
    const thisDiv = ev.currentTarget;
    const next =
      thisDiv.nextElementSibling ?? thisDiv.previousElementSibling ?? thisDiv.parentElement;

    (next as HTMLElement)?.focus();
  });

  return (
    <PillWrapper
      isFirst={index === 0}
      {...props}
      onKeyDown={(ev) => {
        if (ev.key === "Delete") del(ev);
      }}
      className={clsx(
        isOver && canDrop && dragCls,
        isOver && canDrop && index === 0 && dragClsFirst,
      )}
    >
      <Pill
        kind="group"
        label={column.headerName ?? column.id}
        startItem={<PillDragger {...drag} />}
        endItem={
          <PillDelete
            tabIndex={-1}
            role="button"
            onClick={(ev) => {
              del(ev);
            }}
          />
        }
      />
    </PillWrapper>
  );
}
