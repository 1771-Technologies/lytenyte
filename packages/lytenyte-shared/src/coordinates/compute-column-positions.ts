import {
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_COLUMN_WIDTH_MAX,
  DEFAULT_COLUMN_WIDTH_MIN,
} from "../+constants.js";
import { makeUint32PositionArray } from "./make-uint32-position-array.js";
import type { ColumnWidthItem } from "../+types.non-gen.js";
import { clamp } from "@1771technologies/lytenyte-shared";

type ComputedWidth = number;
type ColumnIndex = number;
type WidthLookup = Map<ColumnIndex, ComputedWidth>;

/**
 * Computes the x coordinate positions for columns given a set of width items.
 * This is done by cumulatively adding successive width amounts. Handles size
 * to fit calculations and free flex width adjustments.
 */
export function computeColumnPositions(
  widthItems: ColumnWidthItem[],
  base: ColumnWidthItem,
  containerWidth: number,
  sizeToFit: boolean,
) {
  // Calculate initial column widths, total width, and sum of flex values
  const { widths, totalWidth, flexTotal } = columnWidths(widthItems, base);

  // CASE 1: FLEX EXPANSION
  // If we have columns with flex values and available space in the container,
  // distribute the extra space according to flex ratios
  if (flexTotal && totalWidth < containerWidth) {
    const freeSpace = containerWidth - totalWidth;
    const unitFreeSpace = Math.floor(freeSpace / flexTotal);

    // Reserve 1px to prevent scrollbar appearance at container edge
    let spaceLeft = freeSpace - unitFreeSpace * flexTotal - 1;

    // Distribute extra space among flex columns, starting from the rightmost column
    for (let i = widthItems.length - 1; i >= 0; i--) {
      const item = widthItems[i];
      const flex = item.widthFlex ?? base.widthFlex;
      if (!flex) continue;

      // Add proportional space plus 1px from remainder if available
      const additionalWidth = flex * unitFreeSpace + (spaceLeft > 0 ? 1 : 0);
      spaceLeft--;

      widths.set(i, additionalWidth + widths.get(i)!);
    }
  }

  // CASE 2: SIZE-TO-FIT SHRINKING
  // If total column width exceeds container width and sizeToFit is enabled,
  // shrink columns proportionally to fit within the container
  if (sizeToFit && totalWidth > containerWidth) {
    const availableSpace = totalWidth - containerWidth + 1;
    let spaceLeftToShrink = availableSpace;

    // First pass: shrink columns proportionally to their width
    for (let i = widthItems.length - 1; i >= 0; i--) {
      const current = widths.get(i)!;
      const shrinkSize = Math.floor((current / totalWidth) * availableSpace);

      spaceLeftToShrink -= shrinkSize;
      widths.set(i, current - shrinkSize);
    }

    // Second pass: handle any remaining pixels that need shrinking
    // by going through columns one by one until we've accounted for all space
    if (spaceLeftToShrink > 0) {
      let i = 0;
      while (spaceLeftToShrink > 0) {
        const current = widths.get(i)!;
        spaceLeftToShrink--;
        widths.set(i, current - 1);
        i = (i + 1) % widthItems.length;
      }
    }
  }
  // CASE 3: SIZE-TO-FIT EXPANDING
  // If no flex columns exist but there's extra space, expand all columns proportionally
  else if (flexTotal === 0 && totalWidth < containerWidth && sizeToFit) {
    const availableSpace = containerWidth - totalWidth - 1;
    let spaceLeft = availableSpace;

    // First pass: expand columns proportionally to their width
    for (let i = widthItems.length - 1; i >= 0; i--) {
      const current = widths.get(i)!;
      const expandSize = Math.floor((current / totalWidth) * availableSpace);

      spaceLeft -= expandSize;
      widths.set(i, current + expandSize);
    }

    // Second pass: distribute any remaining pixels one by one
    if (spaceLeft > 0) {
      let i = 0;
      while (spaceLeft > 0) {
        const current = widths.get(i)!;
        spaceLeft--;
        widths.set(i, current + 1);
        i = (i + 1) % widthItems.length;
      }
    }
  }

  // Convert the width map to a position array for rendering
  return makeUint32PositionArray((i) => widths.get(i)!, widthItems.length);
}

/**
 * Helper function to calculate initial column widths based on width specifications.
 *
 * @param widthItems - Array of column width specifications
 * @param base - Default width settings for fallback values
 * @returns Object containing width map, total width, and sum of flex values
 */
function columnWidths(widthItems: ColumnWidthItem[], base: ColumnWidthItem) {
  let totalWidth = 0;
  let flexTotal = 0;
  const widths: WidthLookup = new Map();

  // Extract default values from base configuration
  const defaultMin = base.widthMin ?? DEFAULT_COLUMN_WIDTH_MIN;
  const defaultMax = base.widthMax ?? DEFAULT_COLUMN_WIDTH_MAX;
  const defaultWidth = base.width ?? DEFAULT_COLUMN_WIDTH;
  const defaultFlex = base.widthFlex ?? 0;

  // Process each column, prioritizing rightmost columns first
  for (let i = widthItems.length - 1; i >= 0; i--) {
    const item = widthItems[i];

    // Calculate width with min/max constraints
    // 1. Use column's width or fall back to default
    // 2. Ensure width is between min and max bounds
    // 3. Ensure width is non-negative
    const width = Math.max(
      clamp(item.widthMin ?? defaultMin, item.width ?? defaultWidth, item.widthMax ?? defaultMax),
      0,
    );

    // Store the computed width
    widths.set(i, width);

    // Track total flex value and total width for later calculations
    flexTotal += Math.max(item.widthFlex ?? defaultFlex, 0);
    totalWidth += width;
  }

  return { widths, totalWidth, flexTotal };
}
