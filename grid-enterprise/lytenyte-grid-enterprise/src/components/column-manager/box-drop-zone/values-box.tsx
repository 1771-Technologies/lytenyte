import { useMemo, useRef } from "react";
import { BoxDropZone, type BoxDropZoneRendererProps } from "./box-drop-zone";
import { PillWrapper } from "./pill-wrapper";
import { valueTag } from "./tags";
import { getColumns } from "./get-columns-from-drag-data";
import { t } from "@1771technologies/grid-design";
import type {
  ColumnBaseEnterpriseReact,
  ColumnEnterpriseReact,
} from "@1771technologies/grid-types";
import { useEvent } from "@1771technologies/react-utils";
import { useGrid } from "../../../use-grid";
import { Pill } from "../../../components-internal/pill/pill";
import { DragGroupIcon, MeasuresIcon } from "@1771technologies/lytenyte-grid-community/icons";

export function ValuesBox() {
  const { api, state } = useGrid();
  const boxExpansions = state.internal.columnManagerBoxExpansions;
  const expansions = boxExpansions.use();

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
      emptyIcon={<DragGroupIcon />}
      icon={<MeasuresIcon />}
      emptyLabel="Drag here to aggregate"
      label="Values"
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
  const grid = useGrid();
  const base = grid.state.columnBase.use();

  const measureFunc = getAggFunc(column, base) ?? "Fn(x)";

  const pillRef = useRef<HTMLDivElement | null>(null);
  const del = useEvent(() => {
    grid.api.columnUpdate(column, { aggFunc: undefined });
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
              {typeof measureFunc === "string" ? `(${measureFunc})` : "Fn(x)"}
            </span>
          </div>
        }
      />
    </PillWrapper>
  );
}

function getAggFunc(c: ColumnEnterpriseReact<any>, base: ColumnBaseEnterpriseReact<any>) {
  return c.aggFunc ?? c.aggFuncDefault ?? base.aggFunc;
}
