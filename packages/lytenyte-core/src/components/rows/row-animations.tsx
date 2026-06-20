import { useMemo, useRef } from "react";
import type { RowPin } from "@1771technologies/lytenyte-shared";
import { useYCoordinates } from "../../root/contexts/coordinates.js";
import { useRowSourceContext } from "../../root/contexts/row-source-provider.js";
import { useRowCountsContext } from "../../root/contexts/grid-areas/row-counts-context.js";
import { useIsoEffect } from "../../hooks/use-iso-effect.js";
import { useRowLayoutContext, useRowViewContext } from "../../root/contexts/row-layout/row-layout-context.js";
import { useGridIdContext } from "../../root/contexts/grid-id.js";

interface PositionEntry {
  readonly y: number;
  readonly pin: RowPin;
}

const getRow = (id: string, gridId: string) => {
  const query = `[data-ln-gridid="${gridId}"][data-ln-row="true"][data-ln-row-id="${id}"]`;

  const row = document.querySelector(query) as HTMLElement | null;

  return row;
};

export function RowAnimationDriver() {
  const rowLayout = useRowLayoutContext();
  const prevRowLayout = useRef(rowLayout);

  const gridId = useGridIdContext();

  const view = useRowViewContext();
  const prevViewRef = useRef(view);

  const yPositions = useYCoordinates();
  const rs = useRowSourceContext();

  const { topCount, bottomCount, rowCount } = useRowCountsContext();

  const idToPosition = useMemo(() => {
    const x: Record<string, PositionEntry> = {};
    const bottomCutoff = rowCount - bottomCount;

    for (let i = 0; i < yPositions.length - 1; i++) {
      const row = rs.rowByIndex(i);
      const id = row.get()?.id;
      if (!id) continue;

      const pin: RowPin = i < topCount ? "top" : i >= bottomCutoff ? "bottom" : null;
      x[id] = { y: yPositions[i], pin };
    }

    return x;
  }, [rs, yPositions, topCount, bottomCount, rowCount]);

  const prevIdToPosition = useRef(idToPosition);

  useIsoEffect(() => {
    // we need to track the previous layout to get a reference to the row node, since it might've been deleted from the current
    // node? Maybe for deleted nodes we actually just clone the element and animate it out. Essentially it becomes frozen in space then? ?
    const prevLayout = prevRowLayout.current;
    prevRowLayout.current = rowLayout;

    const prev = prevIdToPosition.current;
    prevIdToPosition.current = idToPosition;

    const prevView = prevViewRef.current;
    prevViewRef.current = view;

    const moved: { id: string; from: number; to: number }[] = [];
    const removed: { id: string; pin: RowPin }[] = [];
    const added: { id: string; pin: RowPin }[] = [];

    const candidateIds = new Set<string>();
    for (const r of view.top) candidateIds.add(r.id);
    for (const r of view.center) candidateIds.add(r.id);
    for (const r of view.bottom) candidateIds.add(r.id);
    for (const r of prevView.top) candidateIds.add(r.id);
    for (const r of prevView.center) candidateIds.add(r.id);
    for (const r of prevView.bottom) candidateIds.add(r.id);

    for (const id of candidateIds) {
      const current = idToPosition[id];
      const previous = prev[id];

      if (current && previous) {
        if (current.pin !== previous.pin) {
          removed.push({ id, pin: previous.pin });
          added.push({ id, pin: current.pin });
        } else if (current.y !== previous.y) {
          moved.push({ id, from: previous.y, to: current.y });
        }
      } else if (current && !previous) {
        added.push({ id, pin: current.pin });
      } else if (!current && previous) {
        removed.push({ id, pin: previous.pin });
      }
    }
  }, [idToPosition, view]);

  return <></>;
}
