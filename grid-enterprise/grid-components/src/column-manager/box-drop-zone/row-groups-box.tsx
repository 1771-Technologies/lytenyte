import { useMemo } from "react";
import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { Pill } from "../../pills/pill";
import { PillWrapper } from "./pill-wrapper";
import { PillDelete, PillDragger } from "./components";
import { useDraggable, useDroppable } from "@1771technologies/react-dragon";
import { clsx } from "@1771technologies/js-utils";
import { dragCls, dragClsFirst } from "./classes";
import { getColumns } from "./get-columns-from-drag-data";

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
    />
  );
}

function RowGroupsPillRenderer({ column, index }: BoxDropZoneRendererProps) {
  const grid = useGrid();
  const config = cc.columnManager.use();
  const Placeholder = config.dragPlaceholder!;
  const gridId = grid.state.gridId.use();
  const drag = useDraggable({
    dragData: () => column,
    dragTags: () => [`${gridId}:row-group`],
    placeholder: () => <Placeholder label={column.headerName ?? column.id} />,
  });

  const groupTags = useMemo(() => {
    return [`${gridId}:row-group`];
  }, [gridId]);

  const { isOver, canDrop, ...props } = useDroppable({
    tags: groupTags,
    onDrop: (p) => {
      const columns = getColumns(p.getData()).map((c) => c.id);

      const model = grid.state.rowGroupModel.peek();

      const left = model.slice(0, index).filter((c) => !columns.includes(c));
      const right = model.slice(index).filter((c) => !columns.includes(c));

      const newModel = [...left, ...columns, ...right];

      grid.state.rowGroupModel.set(newModel);
    },
  });

  return (
    <PillWrapper
      isFirst={index === 0}
      {...props}
      className={clsx(
        isOver && canDrop && dragCls,
        isOver && canDrop && index === 0 && dragClsFirst,
      )}
    >
      <Pill
        kind="group"
        label={column.headerName ?? column.id}
        startItem={<PillDragger {...drag} />}
        endItem={<PillDelete />}
      />
    </PillWrapper>
  );
}
