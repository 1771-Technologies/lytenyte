import type { LayoutRow, RowView } from "@1771technologies/lytenyte-shared";

export interface ChangedRows {
  readonly moved: LayoutRow[];
  readonly deleted: LayoutRow[];
  readonly added: LayoutRow[];
}

export function getChangedRows(
  layout: RowView,
  prevLayout: RowView,
  idPositions: Map<string, number>,
  prevIdPositions: Map<string, number>,
): ChangedRows {
  const moved = [];
  const added = [];

  const deleted = [...prevLayout.top, ...prevLayout.bottom, ...prevLayout.center]
    .map((x) => (!idPositions.has(x.id) ? x : null))
    .filter((x) => x) as LayoutRow[];

  const seen = new Set<string>();
  for (const x of [
    ...layout.top,
    ...layout.center,
    ...layout.bottom,
    ...prevLayout.top,
    ...prevLayout.center,
    ...prevLayout.bottom,
  ]) {
    if (!idPositions.has(x.id) || seen.has(x.id)) continue;

    seen.add(x.id);
    if (!prevIdPositions.has(x.id)) {
      added.push(x);
      continue;
    }

    const posNow = idPositions.get(x.id);
    const posBefore = prevIdPositions.get(x.id);

    if (posNow !== posBefore) moved.push(x);
  }

  return { moved, deleted, added };
}
