import { useMemo } from "react";
import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { Pill } from "../../pills/pill";
import { PillWrapper } from "./pill-wrapper";
import { valueTag } from "./tags";
import { getColumns } from "./get-columns-from-drag-data";

export function ValuesBox() {
  const { api, state } = useGrid();
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

  const gridId = state.gridId.use();
  const tags = useMemo(() => {
    return [valueTag(gridId)];
  }, [gridId]);

  return (
    <BoxDropZone
      onlyContainer
      items={items}
      renderer={ValuesPillRenderer}
      collapsed={!expansions.values}
      onCollapseChange={() => {
        boxExpansions.set((p) => ({ ...p, values: !p.values }));
      }}
      emptyIcon={<Empty />}
      icon={<Icon />}
      emptyLabel={config.labelEmptyValues!}
      label={config.labelValues!}
      tags={tags}
      onDrop={(p) => {
        const data = p.getData();
        const columns = getColumns(data);

        const updates = Object.fromEntries(
          columns
            .map((c) => {
              if (c.aggFunc ?? base.aggFunc) return null;

              const fn =
                c.aggFuncDefault ?? c.aggFuncsAllowed?.at(0) ?? base.aggFuncsAllowed?.at(0);
              if (!fn) return null;

              return [c.id, { aggFunc: fn }];
            })
            .filter((c) => c != null),
        );

        api.columnUpdateMany(updates);
      }}
    />
  );
}

function ValuesPillRenderer({ column, index }: BoxDropZoneRendererProps) {
  return (
    <PillWrapper isFirst={index === 0}>
      <Pill kind="plain" label={column.headerName ?? column.id} />
    </PillWrapper>
  );
}
