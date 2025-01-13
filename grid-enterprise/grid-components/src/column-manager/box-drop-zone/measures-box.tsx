import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone } from "./box-drop-zone";

export function MeasuresBox() {
  const { state } = useGrid();
  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const config = cc.columnManager.use().columnBoxes!;
  const Empty = config.iconEmpty!;
  const Icon = config.iconMeasures!;

  return (
    <BoxDropZone
      collapsed={!expansions.measures}
      onCollapseChange={() => {
        boxExpansions.set((p) => ({ ...p, measures: !p.measures }));
      }}
      emptyIcon={<Empty />}
      icon={<Icon />}
      emptyLabel={config.labelEmptyMeasures!}
      label={config.labelMeasures!}
    />
  );
}
