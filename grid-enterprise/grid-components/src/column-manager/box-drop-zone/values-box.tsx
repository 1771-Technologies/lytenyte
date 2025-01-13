import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone } from "./box-drop-zone";

export function ValuesBox() {
  const { state } = useGrid();
  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconValues!;

  return (
    <BoxDropZone
      collapsed={!expansions.values}
      onCollapseChange={() => {
        boxExpansions.set((p) => ({ ...p, values: !p.values }));
      }}
      emptyIcon={<Empty />}
      icon={<Icon />}
      emptyLabel={config.labelEmptyValues!}
      label={config.labelValues!}
    />
  );
}
