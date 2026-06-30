import type { RowView } from "@1771technologies/lytenyte-shared";
import { EMPTY_ROW_CHANGES, type PositionEntry, type RowChanges } from "./types.js";

function collectViewIds(view: RowView, prevView: RowView): Set<string> {
  const ids = new Set<string>();
  for (const r of view.top) ids.add(r.id);
  for (const r of view.center) ids.add(r.id);
  for (const r of view.bottom) ids.add(r.id);
  for (const r of prevView.top) ids.add(r.id);
  for (const r of prevView.center) ids.add(r.id);
  for (const r of prevView.bottom) ids.add(r.id);
  return ids;
}

export function diffRowChanges(
  current: Record<string, PositionEntry>,
  previous: Record<string, PositionEntry>,
  view: RowView,
  prevView: RowView,
): RowChanges {
  const moved: RowChanges["moved"] = [];
  const removed: RowChanges["removed"] = [];
  const added: RowChanges["added"] = [];

  for (const id of collectViewIds(view, prevView)) {
    const next = current[id];
    const prev = previous[id];

    if (next && prev) {
      if (next.pin !== prev.pin) {
        removed.push({ id, pin: prev.pin });
        added.push({ id, pin: next.pin });
      } else if (next.y !== prev.y) {
        moved.push({ id, from: prev.y, to: next.y });
      }
    } else if (next && !prev) {
      added.push({ id, pin: next.pin });
    } else if (!next && prev) {
      removed.push({ id, pin: prev.pin });
    }
  }

  if (!moved.length && !removed.length && !added.length) return EMPTY_ROW_CHANGES;
  return { moved, removed, added };
}
