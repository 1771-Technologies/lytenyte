import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import type { PillRowItem } from "./pill-row-elements";
import { useEvent } from "@1771technologies/react-utils";

export function useColumnPills(api: ApiEnterpriseReact<any>) {
  const sx = api.getState();

  const columns = sx.columns.use();
  const base = sx.columnBase.use();

  const gridId = sx.gridId.use();

  const pillItems = useMemo(() => {
    const hidden: ColumnEnterpriseReact<any>[] = [];
    const visible: ColumnEnterpriseReact<any>[] = [];

    const normalColumns = columns.filter((c) => !api.columnIsGridGenerated(c));

    for (let i = 0; i < normalColumns.length; i++) {
      const c = normalColumns[i];
      if (c.hide ?? base.hide ?? false) hidden.push(c);
      else visible.push(c);
    }

    const merged = [
      ...visible.map<PillRowItem>((c) => {
        return {
          column: c,
          id: c.id,
          kind: "column",
          inactive: false,

          dragTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
          dropTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
        };
      }),
      ...hidden.map<PillRowItem>((c) => {
        return {
          column: c,
          id: c.id,
          kind: "column",
          inactive: true,

          dragTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
          dropTag: `${gridId}:column:${c.pin ? c.pin : "none"}`,
        };
      }),
    ];

    const expanded = normalColumns.map<PillRowItem>((c) => {
      return {
        column: c,
        id: c.id,
        kind: "column",
        inactive: c.hide ?? base.hide ?? false,
        dragTag: "",
        dropTag: "",
      };
    });

    return { merged, expanded };
  }, [api, base.hide, columns, gridId]);

  const onPillSelect = useEvent((p: PillRowItem) => {
    if (!api.columnIsHidable(p.column)) return;

    const nextState = !(p.column.hide ?? base.hide ?? false);

    api.columnUpdate(p.column, { hide: nextState });
  });

  const onDrop = useEvent((dragged: PillRowItem, over: PillRowItem, isBefore: boolean) => {
    const src = dragged.id;
    const target = over.id;
    if (src === target) return;

    if (isBefore) api.columnMoveBefore([src], target);
    else api.columnMoveAfter([src], target);
  });

  return {
    pillItems: pillItems.merged,
    expandedPillItems: pillItems.expanded,
    onPillSelect,
    onDrop,
  };
}
