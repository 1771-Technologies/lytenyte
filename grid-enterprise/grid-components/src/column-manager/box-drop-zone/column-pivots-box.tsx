import { useMemo, type KeyboardEvent, type MouseEvent } from "react";
import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { Pill } from "../../pills/pill";
import { PillWrapper } from "./pill-wrapper";
import { PillDelete, PillDragger } from "./components";
import { useEvent } from "@1771technologies/react-utils";
import { useDraggable, useDroppable } from "@1771technologies/react-dragon";
import { groupTag, pivotTag } from "./tags";
import { getColumns } from "./get-columns-from-drag-data";
import { insertIdsIntoModel } from "./insert-ids-in-model";
import { dragCls, dragClsFirst } from "./classes";
import { clsx } from "@1771technologies/js-utils";

export function ColumnPivotsBox() {
  const { api, state } = useGrid();

  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconColumnPivots!;

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
      emptyIcon={<Empty />}
      icon={<Icon />}
      emptyLabel={config.labelEmptyColumnPivot!}
      label={config.labelColumnPivots!}
      tags={tags}
      onDrop={(p) => {
        const columns = getColumns(p.getData()).map((c) => c.id);
        const index = model.length;
        const newModel = insertIdsIntoModel(model, columns, index);

        state.columnPivotModel.set(newModel);
      }}
    />
  );
}

function PivotPill({ index, column }: BoxDropZoneRendererProps) {
  const grid = useGrid();
  const config = cc.columnManager.use();
  const Placeholder = config.dragPlaceholder!;

  const gridId = grid.state.gridId.use();
  const drag = useDraggable({
    dragData: () => column,
    dragTags: () => {
      const isG = grid.api.columnIsRowGroupable(column);

      const tags = [pivotTag(gridId)];
      if (isG) tags.push(groupTag(gridId));

      return tags;
    },
    placeholder: () => <Placeholder label={column.headerName ?? column.id} />,
  });

  const pivotTags = useMemo(() => {
    return [pivotTag(gridId)];
  }, [gridId]);
  const { isOver, canDrop, ...props } = useDroppable({
    tags: pivotTags,
    onDrop: (p) => {
      const columns = getColumns(p.getData()).map((c) => c.id);
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
