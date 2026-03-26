import type { RowView } from "@1771technologies/lytenyte-shared";

export function getChangedRows(
  layout: RowView,
  prevLayout: RowView,
  idPositions: Map<string, number>,
  prevIdPositions: Map<string, number>,
) {
  const moved = [];
  const added = [];

  const deleted = [...prevLayout.top, ...prevLayout.bottom, ...prevLayout.center]
    .map((x) => (!idPositions.has(x.id) ? x.id : null))
    .filter((x) => x) as string[];

  for (const x of [...layout.top, ...layout.center, ...layout.bottom]) {
    if (!idPositions.has(x.id)) continue;
    if (!prevIdPositions.has(x.id)) {
      added.push(x.id);
      continue;
    }
    const posNow = idPositions.get(x.id);
    const posBefore = prevIdPositions.get(x.id);

    if (posNow !== posBefore) moved.push(x);
  }

  return { moved, deleted, added };
}
