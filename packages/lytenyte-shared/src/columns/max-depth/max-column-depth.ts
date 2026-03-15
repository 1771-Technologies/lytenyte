import type { ColumnAbstract } from "../../types";

/**
 * Returns the max group depth of the column hierarchy.
 *
 * - The `groupVisible` columns
 *   are the columns that remain after taking into account the hide property and
 *   column group visibility of the column.
 * - The `allVisible` columns are the columns that remain after only taking into account
 *   the hide property of the column.
 * - `filledDepth` indicates if the hierarchy should consider `groupVisible` or `allVisible`.
 *
 * A user may want the depth to be filled for the group visible to prevent hierarchy layout
 * shifts as column groups are collapsed or shown.
 */
export function maxColumnDepth(
  groupVisible: ColumnAbstract[],
  allVisible: ColumnAbstract[],
  filledDepth: boolean,
): number {
  const depthSource = filledDepth ? allVisible : groupVisible;
  let maxDepth = 0;

  for (const c of depthSource) {
    const d = c.groupPath?.length ?? 0;
    if (d > maxDepth) maxDepth = d;
  }

  return maxDepth;
}
