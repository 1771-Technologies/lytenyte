import { useMemo } from "react";
import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone } from "./box-drop-zone";
import { Pill } from "../../pills/pill";
import { PillWrapper } from "./pill-wrapper";
import { PillDelete, PillDragger } from "./components";

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
      renderer={({ column, index }) => (
        <PillWrapper isFirst={index === 0}>
          <Pill
            kind="group"
            label={column.headerName ?? column.id}
            startItem={<PillDragger />}
            endItem={<PillDelete />}
          />
        </PillWrapper>
      )}
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
