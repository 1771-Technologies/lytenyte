import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone } from "./box-drop-zone";

export function ColumnPivotsBox() {
  const { state } = useGrid();

  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconColumnPivots!;

  return (
    <BoxDropZone
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
