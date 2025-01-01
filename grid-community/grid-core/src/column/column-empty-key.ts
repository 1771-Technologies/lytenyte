import { COLUMN_EMPTY_PREFIX } from "@1771technologies/grid-constants";
import type { ColumnPin } from "@1771technologies/grid-types/community";

/**
 * Generates a unique key for an empty column placeholder based on its group path and pin status.
 *
 * This function creates a deterministic identifier for empty columns that replace hidden grouped columns.
 * The key format is: `prefix|>group1|>group2|>empty[pin]` where pin is optional.
 *
 * @param groupPath - Array of group identifiers representing the column's group hierarchy
 * @param pin - The pin position of the column ('start', 'end', or null/undefined)
 *
 * @returns A string key that uniquely identifies the empty column position within its group and pin context
 *
 * @example
 * ```typescript
 * // For an empty column in group 'users/details' pinned to start
 * const key = getEmptyColumnKey(['users', 'details'], 'start');
 * // Returns: "lytenyte-empty:users|>details|>emptystart"
 *
 * // For an unpinned empty column in group 'settings'
 * const key = getEmptyColumnKey(['settings'], null);
 * // Returns: "lytenyte-empty:settings|>empty"
 * ```
 *
 * @remarks
 * The generated key is used internally to track and manage empty column placeholders
 * when groups are collapsed. The key structure ensures uniqueness within the same
 * group path and pin combination.
 */
export function columnEmptyKey(groupPath: string[], pin: ColumnPin) {
  return `${COLUMN_EMPTY_PREFIX}${groupPath.join("|>")}|>empty${pin ?? ""}`;
}
