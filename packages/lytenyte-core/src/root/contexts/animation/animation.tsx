import { itemsWithIdToMap, type LayoutRow, type RowView } from "@1771technologies/lytenyte-shared";
import { createContext, useContext, useMemo, useRef, type PropsWithChildren } from "react";
import { getChangedRows, type ChangedRows } from "./get-changed-rows.js";

export const additionalMoveRenderContext = createContext({} as { rows: LayoutRow[] });
export const updatesContext = createContext({} as ChangedRows);

interface AnimationProviderProps {
  readonly rowLayout: RowView;
  readonly idToPosition: Map<string, number>;
}

export function AnimationProvider({
  rowLayout,
  idToPosition,
  children,
}: PropsWithChildren<AnimationProviderProps>) {
  const prevLayoutRef = useRef(rowLayout);
  const prevPositionsRef = useRef(idToPosition);

  const updates = useMemo(() => {
    const prevPositions = prevPositionsRef.current;
    const currPositions = idToPosition;
    const changes = getChangedRows(rowLayout, prevLayoutRef.current, currPositions, prevPositions);

    prevLayoutRef.current = rowLayout;
    prevPositionsRef.current = idToPosition;

    return changes;
  }, [idToPosition, rowLayout]);

  const additionalMoveToRender = useMemo(() => {
    // Only center rows could've been moved and no longer in view. Pinned rows will always be in view.
    // Furthermore if a pinned row changes pin state, we tree it as a deletion, and addition.
    const allItems = itemsWithIdToMap(rowLayout.center);
    // The ones that have been moved but are not in the current view.
    const movedNotInView = updates.moved.filter((x) => !allItems.has(x.id));

    return { rows: movedNotInView };
  }, [rowLayout.center, updates.moved]);

  return (
    <updatesContext.Provider value={updates}>
      <additionalMoveRenderContext.Provider value={additionalMoveToRender}>
        {children}
      </additionalMoveRenderContext.Provider>
    </updatesContext.Provider>
  );
}

export const useAdditionalMoveRender = () => useContext(additionalMoveRenderContext);
export const useChangedRows = () => useContext(updatesContext);
