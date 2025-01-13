import { useMemo } from "react";
import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone } from "./box-drop-zone";
import { Pill } from "../../pills/pill";
import { PillWrapper } from "./pill-wrapper";

export function ValuesBox() {
  const { state } = useGrid();
  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconValues!;

  const columns = state.columns.use();
  const base = state.columnBase.use();
  const items = useMemo(() => {
    return columns.filter((c) => c.aggFunc ?? base.aggFunc);
  }, [base.aggFunc, columns]);

  return (
    <BoxDropZone
      items={items}
      renderer={({ column, index }) => (
        <PillWrapper isFirst={index === 0}>
          <Pill kind="plain" label={column.headerName ?? column.id} />
        </PillWrapper>
      )}
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
