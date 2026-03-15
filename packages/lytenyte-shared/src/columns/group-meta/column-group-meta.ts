import type { ColumnAbstract } from "../../types";

export interface ColumnGroupMeta {
  /**
   * A map that gives all the group IDs that a given column is a part of.
   * For example:
   * ```ts
   * const column = { id: "x", groupPath: ["A", "B", "C" ] };
   * meta.colIdToGroupIds.get("x") // ["A", "A>B", "A>B>C"]
   * ```
   */
  readonly colIdToGroupIds: Map<string, string[]>;
  /**
   * A map that gives all the occurrence-qualified group IDs that a given column is a part of.
   * Occurrence IDs distinguish separate runs of the same group name (e.g. two non-adjacent blocks
   * of columns sharing the same groupPath). The run index is appended using the groupJoinDelimiter.
   * For example, if "A" appears in two separate runs:
   * ```ts
   * meta.colIdToOccurrenceGroupIds.get("col-in-first-run")  // ["A>0"]
   * meta.colIdToOccurrenceGroupIds.get("col-in-second-run") // ["A>1"]
   * ```
   */
  readonly colIdToOccurrenceGroupIds: Map<string, string[]>;
  /**
   * A set containing all the valid column group IDs. This can be used to either get all the
   * possible IDs, or check if an ID is valid. Note that these are the groupPath IDs, joined
   * by the `groupJoinDelimiter` used to create the column groups.
   */
  readonly validGroupIds: Set<string>;
  /**
   * A map where the key is the occurrence-qualified group ID and the value is a boolean indicating
   * if that group occurrence can be expanded and collapsed, or if it is always open. Each
   * contiguous run of the same group is evaluated independently, so two runs of the same group
   * name may have different collapsibility.
   */
  readonly groupIsCollapsible: Map<string, boolean>;
}

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
