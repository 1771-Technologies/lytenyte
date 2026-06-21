import { createContext, useContext, useMemo, useRef, type PropsWithChildren } from "react";
import { useXCoordinates } from "../coordinates.js";
import { useColumnsContext } from "../columns/column-context.js";
import { useBoundsContext } from "../bounds.js";
import { useHeaderHierarchyContext } from "../header-hierarchy.js";
import { useColumnIdToPosition } from "./use-column-id-to-position.js";
import { useGroupIdToPosition, type GroupPositionEntry } from "./use-group-id-to-position.js";
import { useWindowedColumnIds } from "./use-windowed-column-ids.js";
import { diffColumnChanges } from "./diff-column-changes.js";
import { EMPTY_COLUMN_CHANGES, type ColumnChanges, type ColumnPositionEntry } from "./column-types.js";

export interface ColumnChangesContextValue {
  readonly leaf: ColumnChanges;
  readonly group: ColumnChanges;
}

const EMPTY: ColumnChangesContextValue = { leaf: EMPTY_COLUMN_CHANGES, group: EMPTY_COLUMN_CHANGES };

const context = createContext<ColumnChangesContextValue>(EMPTY);

function windowedGroupIds(
  groupPositions: Record<string, GroupPositionEntry>,
  windowedLeafIds: Set<string>,
): Set<string> {
  const ids = new Set<string>();
  for (const idOccurrence in groupPositions) {
    const { columnIds } = groupPositions[idOccurrence];
    if (columnIds.some((id) => windowedLeafIds.has(id))) ids.add(idOccurrence);
  }
  return ids;
}

export function ColumnChangesProvider({
  virtualizeCols,
  children,
}: PropsWithChildren<{ virtualizeCols: boolean | undefined }>) {
  const { view } = useColumnsContext();
  const xPositions = useXCoordinates();
  const bounds = useBoundsContext();
  const headerHierarchy = useHeaderHierarchyContext();

  const leafIdToPosition = useColumnIdToPosition(view.visibleColumns, xPositions);
  const leafWindowedIds = useWindowedColumnIds(view.visibleColumns, bounds, virtualizeCols);

  const groupIdToPosition = useGroupIdToPosition(headerHierarchy, xPositions);
  const groupWindowedIds = useMemo(
    () => windowedGroupIds(groupIdToPosition, leafWindowedIds),
    [groupIdToPosition, leafWindowedIds],
  );

  const prevRef = useRef<{
    leafIdToPosition: Record<string, ColumnPositionEntry>;
    leafWindowedIds: Set<string>;
    groupIdToPosition: Record<string, GroupPositionEntry>;
    groupWindowedIds: Set<string>;
  } | null>(null);

  const changes = useMemo<ColumnChangesContextValue>(() => {
    const prevSnapshot = prevRef.current;
    prevRef.current = { leafIdToPosition, leafWindowedIds, groupIdToPosition, groupWindowedIds };
    if (!prevSnapshot) return EMPTY;

    const leaf = diffColumnChanges(
      leafIdToPosition,
      prevSnapshot.leafIdToPosition,
      leafWindowedIds,
      prevSnapshot.leafWindowedIds,
    );
    const group = diffColumnChanges(
      groupIdToPosition,
      prevSnapshot.groupIdToPosition,
      groupWindowedIds,
      prevSnapshot.groupWindowedIds,
    );

    if (leaf === EMPTY_COLUMN_CHANGES && group === EMPTY_COLUMN_CHANGES) return EMPTY;
    return { leaf, group };
  }, [leafIdToPosition, leafWindowedIds, groupIdToPosition, groupWindowedIds]);

  return <context.Provider value={changes}>{children}</context.Provider>;
}

export const useColumnChangesContext = () => useContext(context);
