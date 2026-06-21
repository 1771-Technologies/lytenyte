import { EMPTY_COLUMN_CHANGES, type ColumnChanges, type ColumnPositionEntry } from "./column-types.js";

export function diffColumnChanges(
  current: Record<string, ColumnPositionEntry>,
  previous: Record<string, ColumnPositionEntry>,
  windowedIds: Set<string>,
  prevWindowedIds: Set<string>,
): ColumnChanges {
  const moved: ColumnChanges["moved"] = [];
  const removed: ColumnChanges["removed"] = [];
  const added: ColumnChanges["added"] = [];

  const candidateIds = new Set<string>([...windowedIds, ...prevWindowedIds]);

  for (const id of candidateIds) {
    const next = current[id];
    const prev = previous[id];

    if (next && prev) {
      if (next.pin !== prev.pin) {
        removed.push({ id, pin: prev.pin });
        added.push({ id, pin: next.pin });
      } else if (next.index !== prev.index) {
        moved.push({ id, fromX: prev.x, toX: next.x });
      }
    } else if (next && !prev) {
      added.push({ id, pin: next.pin });
    } else if (!next && prev) {
      removed.push({ id, pin: prev.pin });
    }
  }

  if (!moved.length && !removed.length && !added.length) return EMPTY_COLUMN_CHANGES;

  return { moved, removed, added };
}
