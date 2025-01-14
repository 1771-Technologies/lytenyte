import { useMemo } from "react";
import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { Pill } from "../../pills/pill";
import { PillWrapper } from "./pill-wrapper";
import { PillDelete, PillDragger } from "./components";

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
    />
  );
}

function PivotPill({ index, column }: BoxDropZoneRendererProps) {
  return (
    <PillWrapper isFirst={index === 0}>
      <Pill
        kind="pivot"
        label={column.headerName ?? column.id}
        startItem={<PillDragger />}
        endItem={<PillDelete />}
      />
    </PillWrapper>
  );
}
