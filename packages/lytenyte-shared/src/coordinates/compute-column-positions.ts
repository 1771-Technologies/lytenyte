import { makeUint32PositionArray } from "./make-uint32-position-array.js";
import type { ColumnAbstract } from "../types.js";
import { columnWidthMeta } from "./column-width-meta/column-width-meta.js";

/**
 * Computes the x coordinate positions for columns given a set of width items.
 * This is done by cumulatively adding successive width amounts. Handles size
 * to fit calculations and free flex width adjustments.
 */
export function computeColumnPositions(
  widthItems: ColumnAbstract[],
  base: ColumnAbstract,
  containerWidth: number,
  sizeToFit: boolean,
) {
  // Calculate initial column widths, total width, and sum of flex values
  const { widths, totalWidth, flexTotal } = columnWidthMeta(widthItems, base);

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

      widths[i] = additionalWidth + widths[i];
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
      const current = widths[i];
      const shrinkSize = Math.floor((current / totalWidth) * availableSpace);

      spaceLeftToShrink -= shrinkSize;
      widths[i] = current - shrinkSize;
    }

    // Second pass: handle any remaining pixels that need shrinking
    // by going through columns one by one until we've accounted for all space
    if (spaceLeftToShrink > 0) {
      let i = 0;
      while (spaceLeftToShrink > 0) {
        const current = widths[i];
        spaceLeftToShrink--;
        widths[i] = current - 1;
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
      const current = widths[i];
      const expandSize = Math.floor((current / totalWidth) * availableSpace);

      spaceLeft -= expandSize;
      widths[i] = current + expandSize;
    }

    // Second pass: distribute any remaining pixels one by one
    if (spaceLeft > 0) {
      let i = 0;
      while (spaceLeft > 0) {
        const current = widths[i];
        spaceLeft--;
        widths[i] = current + 1;
        i = (i + 1) % widthItems.length;
      }
    }
  }

  return makeUint32PositionArray((i) => widths[i]!, widthItems.length);
}
