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

/**
 * Diffs two id->position snapshots into moved/added/removed. Only ids that are (or were) actually
 * rendered are considered, bounding the work to viewport+overscan size rather than dataset size -
 * but position/pin lookups still go through the global maps, which is what lets "scrolled out of
 * view" be told apart from "really removed". A pin change (e.g. center -> top) is treated as a
 * remove from the old section plus an add to the new one rather than a move, since pinned and
 * center rows are positioned in fundamentally different ways.
 */
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
        // The previous position is always real, even if the row wasn't currently rendered there
        // (it existed, just outside the virtualized window) - so the true distance is reported,
        // however far, rather than clamped to "near the rendered edge".
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
