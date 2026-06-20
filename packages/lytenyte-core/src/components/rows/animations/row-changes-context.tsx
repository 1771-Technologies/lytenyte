import { createContext, useContext, useMemo, useRef, type PropsWithChildren } from "react";
import type { RowPin, RowView } from "@1771technologies/lytenyte-shared";
import { useYCoordinates } from "../../../root/contexts/coordinates.js";
import { useRowSourceContext } from "../../../root/contexts/row-source-provider.js";
import { useRowCountsContext } from "../../../root/contexts/grid-areas/row-counts-context.js";
import { useRowViewContext } from "../../../root/contexts/row-layout/row-layout-context.js";

interface PositionEntry {
  readonly y: number;
  readonly pin: RowPin;
}

export interface RowMoved {
  readonly id: string;
  readonly from: number;
  readonly to: number;
}

export interface RowAddedOrRemoved {
  readonly id: string;
  readonly pin: RowPin;
}

export interface RowChanges {
  readonly moved: RowMoved[];
  readonly removed: RowAddedOrRemoved[];
  readonly added: RowAddedOrRemoved[];
}

const EMPTY: RowChanges = { moved: [], removed: [], added: [] };

const context = createContext<RowChanges>(EMPTY);

export function RowChangesProvider({ children }: PropsWithChildren) {
  const view = useRowViewContext();
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

  const prevRef = useRef<{ idToPosition: Record<string, PositionEntry>; view: RowView } | null>(null);

  const changes = useMemo<RowChanges>(() => {
    const prevSnapshot = prevRef.current;
    prevRef.current = { idToPosition, view };

    if (!prevSnapshot) return EMPTY;

    const prev = prevSnapshot.idToPosition;
    const prevView = prevSnapshot.view;

    const moved: RowMoved[] = [];
    const removed: RowAddedOrRemoved[] = [];
    const added: RowAddedOrRemoved[] = [];

    // Only ids that are (or were) actually rendered can need a visual reaction, bounded by
    // viewport+overscan size, not dataset size. Existence/position/pin lookups still use the
    // global idToPosition maps, which is what lets us tell "scrolled out of view" apart from
    // "really removed".
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
          // The previous position is always real, even if the row wasn't currently rendered
          // there (it existed, just outside the virtualized window) - so the true distance is
          // animated, however far, rather than clamped to "near the rendered edge".
          moved.push({ id, from: previous.y, to: current.y });
        }
      } else if (current && !previous) {
        added.push({ id, pin: current.pin });
      } else if (!current && previous) {
        removed.push({ id, pin: previous.pin });
      }
    }

    if (!moved.length && !removed.length && !added.length) return EMPTY;
    return { moved, removed, added };
  }, [idToPosition, view]);

  return <context.Provider value={changes}>{children}</context.Provider>;
}

export const useRowChanges = () => useContext(context);
