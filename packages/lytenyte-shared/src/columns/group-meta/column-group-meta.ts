import type { ColumnAbstract } from "../../types";

export interface ColumnGroupMeta {
  /**
   * A map that gives all the group IDs that a given column is a part of.
   * For example:
   * ```ts
   * const column = { id: "x", groupPath: ["A", "B", "C" ] };
   * meta.colIdToGroupsIds.get("x") // [["A"], ["A", "B"], ["A", "B", "C"]]
   * ```
   */
  readonly colIdToGroupIds: Map<string, string[]>;
  /**
   * A set containing all the valid column group IDs. This can be used to either get all the
   * possible IDs, or check if an ID is valid. Note that these are the groupPath IDs, joined
   * by the `groupJoinDelimiter` used to create the column groups.
   */
  readonly validGroupIds: Set<string>;
  /**
   * A map where the key is the joined column group ID and the value is a boolean indicating if the
   * column group can be expanded and collapsed, or if it is always open.
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
  const validGroupIds = new Set<string>();

  for (const c of candidates) {
    // If the column is not part of a group, we can just skip it since it will not contribute to the column group meta.
    if (!c.groupPath?.length) continue;

    const groupIds: string[] = [];
    const directParentDepth = c.groupPath.length - 1;

    let id = "";

    for (let d = 0; d < c.groupPath.length; d++) {
      if (d > 0) id += groupJoinDelimiter;
      id += c.groupPath[d];

      groupIds.push(id);
      validGroupIds.add(id);
      collapsibilityInfo[id] ??= { open: false, close: false };

      /**
       * For a group to be collapsible, it must have one child that will be visible when closed,
       * and one child that will be hidden when closed. The child that is visible when closed,
       * must be a direct child.
       */
      if (d === directParentDepth) {
        const vis = c.groupVisibility ?? "open";
        if (vis === "open") collapsibilityInfo[id].close = true;
        else collapsibilityInfo[id].open = true;
      } else {
        // Deeper descendant: always hidden when ancestor collapses
        collapsibilityInfo[id].close = true;
      }
    }

    colIdToGroupIds.set(c.id, groupIds);
  }

  const groupIsCollapsible = new Map<string, boolean>(
    Object.entries(collapsibilityInfo).map(([gid, info]) => [gid, info.open && info.close]),
  );

  return { colIdToGroupIds, validGroupIds, groupIsCollapsible };
}
