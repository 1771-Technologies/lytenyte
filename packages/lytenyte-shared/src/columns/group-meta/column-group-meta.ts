import type { ColumnAbstract } from "../../types.js";
import type { ColumnGroupMeta } from "../types.js";

/**
 * Creates the column group meta object. The meta object contains information about the created column
 * groups, e.g. whether the groups are expandable or collapsible.
 */
export function columnGroupMeta(candidates: ColumnAbstract[], groupJoinDelimiter: string): ColumnGroupMeta {
  const collapsibilityInfo: Record<string, { open: boolean; close: boolean }> = {};
  const colIdToGroupIds = new Map<string, string[]>();
  const colIdToOccurrenceGroupIds = new Map<string, string[]>();
  const validGroupIds = new Set<string>();

  // Tracks the plain group ID last seen at each depth level. Used to detect when a new
  // contiguous run of a group begins (i.e. when the group at a given depth changes).
  const lastGroupAtDepth: string[] = [];
  // Tracks how many runs of each plain group ID have been seen so far.
  const runIndex: Record<string, number> = {};

  for (const c of candidates) {
    // A column with no groupPath contributes nothing to group meta, but it does break
    // the continuity of any active group runs at all depths.
    if (!c.groupPath?.length) {
      lastGroupAtDepth.length = 0;
      continue;
    }

    const groupIds: string[] = [];
    const occurrenceGroupIds: string[] = [];
    const directParentDepth = c.groupPath.length - 1;

    let plainId = "";

    for (let d = 0; d < c.groupPath.length; d++) {
      if (d > 0) plainId += groupJoinDelimiter;
      plainId += c.groupPath[d];

      // A new run begins when the group at this depth differs from the last seen group.
      // Changing the group at depth d also invalidates any previously seen groups at deeper
      // depths, so we truncate the tracker.
      if (lastGroupAtDepth[d] !== plainId) {
        runIndex[plainId] = (runIndex[plainId] ?? -1) + 1;
        lastGroupAtDepth[d] = plainId;
        lastGroupAtDepth.length = d + 1;
      }

      const occId = `${plainId}${groupJoinDelimiter}${runIndex[plainId]}`;

      groupIds.push(plainId);
      occurrenceGroupIds.push(occId);
      validGroupIds.add(plainId);
      collapsibilityInfo[occId] ??= { open: false, close: false };

      /**
       * For a group to be collapsible, it must have one child that will be visible when closed,
       * and one child that will be hidden when closed. The child that is visible when closed,
       * must be a direct child. Collapsibility is tracked per occurrence so that a run with only
       * one type of visibility is not made collapsible by a separate run of the same group name.
       */
      if (d === directParentDepth) {
        const vis = c.groupVisibility ?? "open";
        if (vis === "open") collapsibilityInfo[occId].close = true;
        else collapsibilityInfo[occId].open = true;
      } else {
        // Deeper descendant: always hidden when ancestor collapses
        collapsibilityInfo[occId].close = true;
      }
    }

    colIdToGroupIds.set(c.id, groupIds);
    colIdToOccurrenceGroupIds.set(c.id, occurrenceGroupIds);
  }

  const groupIsCollapsible = new Map<string, boolean>(
    Object.entries(collapsibilityInfo).map(([gid, info]) => [gid, info.open && info.close]),
  );

  return { colIdToGroupIds, colIdToOccurrenceGroupIds, validGroupIds, groupIsCollapsible };
}
