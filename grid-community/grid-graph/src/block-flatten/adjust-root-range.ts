import type { RowPin } from "@1771technologies/grid-types/community";
import type { FlattenedRange } from "../range-tree.js";

/**
 * Adjusts range boundaries to account for unpinned totals rows that are handled separately from the main range flattening.
 *
 * When totals rows are present but not pinned, they affect the overall row indices but are processed by separate
 * flatten handlers (top/bottom) rather than the main center flatten function. This function compensates for that
 * offset by adjusting the range boundaries accordingly.
 *
 * @remarks
 * The function only modifies ranges when totals are present but not pinned:
 * - For top totals: Decrements the last range's start position to include the totals row space
 * - For bottom totals: Increments the last range's end position to include the totals row space
 *
 * No adjustments are made if:
 * - The ranges array is empty
 * - Totals are pinned
 * - No totals position is specified (null)
 *
 * @param ranges - Array of flattened ranges representing row selections. Each range has rowStart and rowEnd properties.
 * @param totalsPosition - Position of the totals row: "top", "bottom", or null if no totals
 * @param totalsPinned - Whether the totals row is pinned in place. If true, no range adjustment is needed
 * @returns The input ranges array, modified in place if adjustments were needed
 */
export function adjustRootRange(
  ranges: FlattenedRange[],
  totalsPosition: RowPin,
  totalsPinned: boolean,
) {
  if (totalsPinned || totalsPosition == null || !ranges.length) return ranges;

  if (totalsPosition === "top") ranges.at(-1)!.rowStart -= 1;

  ranges.at(-1)!.rowEnd += 1;
}
