import "./values-box.css";
import { useMemo, useRef } from "react";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { PillWrapper } from "./pill-wrapper";
import { groupTag, measureTag, pivotTag } from "./tags";
import { groupSource, measureSource, pivotSource } from "./sources";
import { useDraggable, useDroppable } from "@1771technologies/react-dragon";
import { PillDragger } from "./components";
import { getColumns, getDataSource } from "./get-columns-from-drag-data";
import { insertIdsIntoModel } from "./insert-ids-in-model";
import { useEvent } from "@1771technologies/react-utils";
import { clsx } from "@1771technologies/js-utils";
import { dragCls, dragClsFirst } from "./classes";
import type {
  ColumnBaseEnterpriseReact,
  ColumnEnterpriseReact,
} from "@1771technologies/grid-types";
import { useGrid } from "../../../use-grid";
import { Pill } from "../../../components-internal/pill/pill";
import { DragGroupIcon, MeasuresIcon } from "@1771technologies/lytenyte-grid-community/icons";
import { DragPlaceholder } from "../../../components-internal/drag-placeholder/drag-placeholder";

export function MeasuresBox() {
  const { state, api } = useGrid();
  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const model = state.measureModel.use();

  const columns = useMemo(() => {
    return model.map((c) => api.columnById(c)!);
  }, [api, model]);

  const gridId = state.gridId.use();
  const tags = useMemo(() => {
    return [measureTag(gridId)];
  }, [gridId]);

  return (
    <BoxDropZone
      items={columns}
      renderer={MeasurePillRenderer}
      collapsed={!expansions.measures}
      onCollapseChange={() => {
        boxExpansions.set((p) => ({ ...p, measures: !p.measures }));
      }}
      emptyIcon={<DragGroupIcon />}
      icon={<MeasuresIcon />}
      emptyLabel="Drag here to add a measure"
      label="Measures"
      tags={tags}
      onDrop={(p) => {
        const data = p.getData();
        const columns = getColumns(data).map((c) => c.id);
        const source = getDataSource(data);

        if (source === groupSource) {
          state.rowGroupModel.set((prev) => prev.filter((c) => !columns.includes(c)));
        }
        if (source === pivotSource) {
          state.columnPivotModel.set((prev) => prev.filter((c) => !columns.includes(c)));
        }

        const index = model.length;
        const newModel = insertIdsIntoModel(model, columns, index);
        state.measureModel.set(newModel);
      }}
    />
  );
}

function MeasurePillRenderer({ index, column }: BoxDropZoneRendererProps) {
  const grid = useGrid();

  const base = grid.state.columnBase.use();
  const gridId = grid.state.gridId.use();
  const drag = useDraggable({
    dragData: () => ({ column, source: measureSource }),
    dragTags: () => {
      const isG = grid.api.columnIsRowGroupable(column);
      const isP = grid.api.columnIsPivotable(column);

      const tags = [measureTag(gridId)];
      if (isG) tags.push(groupTag(gridId));
      if (isP) tags.push(pivotTag(gridId));

      return tags;
    },
    placeholder: () => <DragPlaceholder label={column.headerName ?? column.id} />,
  });

  const measureTags = useMemo(() => {
    return [measureTag(gridId)];
  }, [gridId]);

  const { isOver, canDrop, ...props } = useDroppable({
    tags: measureTags,
    onDrop: (p) => {
      const data = p.getData();
      const columns = getColumns(data).map((c) => c.id);
      const source = getDataSource(data);

      if (source === groupSource) {
        grid.state.rowGroupModel.set((prev) => prev.filter((c) => !columns.includes(c)));
      }
      if (source === pivotSource) {
        grid.state.columnPivotModel.set((prev) => prev.filter((c) => !columns.includes(c)));
      }

      const newModel = insertIdsIntoModel(grid.state.measureModel.peek(), columns, index);
      grid.state.measureModel.set(newModel);
    },
  });

  const pillRef = useRef<HTMLDivElement | null>(null);
  const del = useEvent(() => {
    grid.state.measureModel.set((prev) => prev.filter((c) => c !== column.id));
    const thisDiv = pillRef.current!;
    const next =
      thisDiv.nextElementSibling ?? thisDiv.previousElementSibling ?? thisDiv.parentElement;

    setTimeout(() => {
      (next as HTMLElement)?.focus();
    }, 40);
  });

  const measureFunc = getMeasureFunc(column, base) ?? "Fn(x)";

  return (
    <PillWrapper
      pillRef={pillRef}
      isFirst={index === 0}
      {...props}
      onKeyDown={(ev) => {
        if (ev.key === "Delete") {
          ev.preventDefault();
          del();
        }
        if (ev.key === "Enter") {
          ev.preventDefault();
        }
      }}
      className={clsx(
        isOver && canDrop && dragCls,
        isOver && canDrop && index === 0 && dragClsFirst,
      )}
    >
      <Pill
        kind="column"
        label={
          <div className="lng1771-values-pill-label">
            <span>{column.headerName ?? column.id}</span>
            <span className="lng1771-values-pill-label__agg">
              {typeof measureFunc === "string" ? `(${measureFunc})` : "Fn(x)"}
            </span>
          </div>
        }
        startItem={<PillDragger {...drag} />}
      />
    </PillWrapper>
  );
}

function getMeasureFunc(c: ColumnEnterpriseReact<any>, base: ColumnBaseEnterpriseReact<any>) {
  return c.measureFunc ?? c.measureFuncDefault ?? base.measureFunc;
}
