import { useMemo, useRef, useState } from "react";
import { cc } from "../../component-configuration";
import { useGrid } from "../../provider/grid-provider";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { Pill } from "../../pills/pill";
import { PillWrapper } from "./pill-wrapper";
import { valueTag } from "./tags";
import { getColumns } from "./get-columns-from-drag-data";
import { AggMenu } from "./agg-menu";
import { t } from "@1771technologies/grid-design";
import type {
  ColumnBaseEnterpriseReact,
  ColumnEnterpriseReact,
} from "@1771technologies/grid-types";
import { useEvent } from "@1771technologies/react-utils";

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
    return columns.filter((c) => c.aggFn ?? base.aggFn);
  }, [base.aggFn, columns]);

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
              if (c.aggFn ?? base.aggFn) return null;

              const fn = c.aggFnDefault ?? c.aggFnsAllowed?.at(0) ?? base.aggFnsAllowed?.at(0);
              if (!fn) return null;

              return [c.id, { aggFn: fn }];
            })
            .filter((c) => c != null),
        );

        api.columnUpdateMany(updates);
      }}
    />
  );
}

function ValuesPillRenderer({ column, index }: BoxDropZoneRendererProps) {
  const grid = useGrid();
  const base = grid.state.columnBase.use();

  const config = cc.columnManager.use();

  const measureFn = getAggFn(column, base) ?? "Fn(x)";
  const allowed = column.measureFnsAllowed ?? base.measureFnsAllowed ?? [];

  const [open, setOpen] = useState(false);

  const pillRef = useRef<HTMLDivElement | null>(null);
  const del = useEvent(() => {
    grid.api.columnUpdate(column, { aggFn: undefined });
    const thisDiv = pillRef.current!;
    const next =
      thisDiv.nextElementSibling ?? thisDiv.previousElementSibling ?? thisDiv.parentElement;

    setTimeout(() => {
      (next as HTMLElement)?.focus();
    }, 40);
  });

  return (
    <PillWrapper
      isFirst={index === 0}
      pillRef={pillRef}
      onKeyDown={(ev) => {
        if (ev.key === "Delete") {
          ev.preventDefault();
          del();
        }
        if (ev.key === "Enter") {
          ev.preventDefault();
          setOpen(true);
        }
      }}
    >
      <Pill
        kind="plain"
        label={
          <div
            className={css`
              display: flex;
              align-items: center;
              gap: ${t.spacing.space_05};
            `}
          >
            <span>{column.headerName ?? column.id}</span>
            <span
              className={css`
                color: ${t.colors.primary_50};
              `}
            >
              {typeof measureFn === "string" ? `(${measureFn})` : "Fn(x)"}
            </span>
          </div>
        }
        endItem={
          <AggMenu
            allowed={allowed}
            label={config.columnBoxes?.labelAggregationButton(column.headerName ?? column.id) ?? ""}
            current={typeof measureFn === "string" ? measureFn : "Fn(x)"}
            onOpenChange={setOpen}
            open={open}
            onRemove={del}
            onSelect={(s) => {
              grid.api.columnUpdate(column, { aggFn: s });
            }}
          />
        }
      />
    </PillWrapper>
  );
}

function getAggFn(c: ColumnEnterpriseReact<any>, base: ColumnBaseEnterpriseReact<any>) {
  return c.aggFn ?? c.aggFnDefault ?? base.aggFn;
}
