import { useMemo, type KeyboardEvent, type MouseEvent } from "react";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { PillWrapper } from "./pill-wrapper";
import { PillDelete, PillDragger } from "./components";
import { useEvent } from "@1771technologies/react-utils";
import { useDraggable, useDroppable } from "@1771technologies/react-dragon";
import { groupTag, measureTag, pivotTag } from "./tags";
import { getColumns, getDataSource } from "./get-columns-from-drag-data";
import { insertIdsIntoModel } from "./insert-ids-in-model";
import { dragCls, dragClsFirst } from "./classes";
import { clsx } from "@1771technologies/js-utils";
import { groupSource, measureSource, pivotSource } from "./sources";
import { useGrid } from "../../../use-grid";
import { Pill } from "../../../components-internal/pill/pill";
import { ColumnPivotIcon, DragGroupIcon } from "@1771technologies/lytenyte-grid-community/icons";
import { DragPlaceholder } from "../../../components-internal/drag-placeholder/drag-placeholder";

export function ColumnPivotsBox() {
  const { api, state } = useGrid();

  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const model = state.columnPivotModel.use();
  const columns = useMemo(() => {
    return model.map((c) => api.columnById(c)!);
  }, [api, model]);

  const gridId = state.gridId.use();
  const tags = useMemo(() => {
    return [pivotTag(gridId)];
  }, [gridId]);

  return (
    <BoxDropZone
      items={columns}
      renderer={PivotPill}
      collapsed={!expansions.columnPivots}
      onCollapseChange={() => {
        boxExpansions.set((p) => ({ ...p, columnPivots: !p.columnPivots }));
      }}
      emptyIcon={<DragGroupIcon />}
      icon={<ColumnPivotIcon />}
      emptyLabel="Drag here to creata a pivot"
      label="Column Pivots"
      tags={tags}
      onDrop={(p) => {
        const data = p.getData();
        const columns = getColumns(data).map((c) => c.id);
        const source = getDataSource(data);

        if (source === groupSource) {
          state.rowGroupModel.set((prev) => prev.filter((c) => !columns.includes(c)));
        }
        if (source === measureSource) {
          state.measureModel.set((prev) => prev.filter((c) => !columns.includes(c)));
        }

        const index = model.length;
        const newModel = insertIdsIntoModel(model, columns, index);
        state.columnPivotModel.set(newModel);
      }}
    />
  );
}

function PivotPill({ index, column }: BoxDropZoneRendererProps) {
  const grid = useGrid();

  const gridId = grid.state.gridId.use();
  const drag = useDraggable({
    dragData: () => ({ column, source: pivotSource }),
    dragTags: () => {
      const isG = grid.api.columnIsRowGroupable(column);
      const isM = grid.api.columnIsMeasurable(column);

      const tags = [pivotTag(gridId)];
      if (isG) tags.push(groupTag(gridId));
      if (isM) tags.push(measureTag(gridId));

      return tags;
    },
    placeholder: () => <DragPlaceholder label={column.headerName ?? column.id} />,
  });

  const pivotTags = useMemo(() => {
    return [pivotTag(gridId)];
  }, [gridId]);

  const { isOver, canDrop, ...props } = useDroppable({
    tags: pivotTags,
    onDrop: (p) => {
      const data = p.getData();
      const columns = getColumns(data).map((c) => c.id);
      const source = getDataSource(data);

      if (source === groupSource) {
        grid.state.rowGroupModel.set((prev) => prev.filter((c) => !columns.includes(c)));
      }
      if (source === measureSource) {
        grid.state.measureModel.set((prev) => prev.filter((c) => !columns.includes(c)));
      }

      const newModel = insertIdsIntoModel(grid.state.columnPivotModel.peek(), columns, index);
      grid.state.columnPivotModel.set(newModel);
    },
  });

  const del = useEvent((ev: KeyboardEvent | MouseEvent) => {
    grid.state.columnPivotModel.set((prev) => prev.filter((c) => c !== column.id));
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
        kind="pivot"
        label={column.headerName ?? column.id}
        startItem={<PillDragger {...drag} />}
        endItem={<PillDelete tabIndex={-1} role="button" onClick={(ev) => del(ev)} />}
      />
    </PillWrapper>
  );
}
