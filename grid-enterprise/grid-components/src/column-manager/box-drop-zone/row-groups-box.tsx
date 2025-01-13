import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone } from "./box-drop-zone";

export function RowGroupsBox() {
  const { state } = useGrid();
  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconRowGroups!;

  return (
    <BoxDropZone
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
