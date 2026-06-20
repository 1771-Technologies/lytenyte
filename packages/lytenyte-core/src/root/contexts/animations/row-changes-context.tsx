import { createContext, useContext, useMemo, useRef, type PropsWithChildren } from "react";
import type { RowView } from "@1771technologies/lytenyte-shared";
import { useYCoordinates } from "../coordinates.js";
import { useRowSourceContext } from "../row-source-provider.js";
import { useRowCountsContext } from "../grid-areas/row-counts-context.js";
import { useRowViewContext } from "../row-layout/row-layout-context.js";
import { useIdToPosition } from "./use-id-to-position.js";
import { diffRowChanges } from "./diff-row-changes.js";
import { EMPTY_ROW_CHANGES, type PositionEntry, type RowChanges } from "./types.js";

export type { RowChanges, RowMoved, RowAddedOrRemoved } from "./types.js";

const context = createContext<RowChanges>(EMPTY_ROW_CHANGES);

export function RowChangesProvider({ children }: PropsWithChildren) {
  const view = useRowViewContext();
  const yPositions = useYCoordinates();

  const rs = useRowSourceContext();
  const { topCount, bottomCount, rowCount } = useRowCountsContext();

  const idToPosition = useIdToPosition(rs, yPositions, topCount, bottomCount, rowCount);

  const prevRef = useRef<{ idToPosition: Record<string, PositionEntry>; view: RowView } | null>(null);

  const changes = useMemo<RowChanges>(() => {
    const prevSnapshot = prevRef.current;
    prevRef.current = { idToPosition, view };

    if (!prevSnapshot) return EMPTY_ROW_CHANGES;

    return diffRowChanges(idToPosition, prevSnapshot.idToPosition, view, prevSnapshot.view);
  }, [idToPosition, view]);

  return <context.Provider value={changes}>{children}</context.Provider>;
}

export const useRowChanges = () => useContext(context);
