import { clamp } from "../../js-utils/clamp.js";
import type { ColumnAbstract } from "../../types.js";

const DEFAULT_COLUMN_WIDTH = 200;
const DEFAULT_COLUMN_WIDTH_MAX = 1000;
const DEFAULT_COLUMN_WIDTH_MIN = 80;

/**
 * Returns the column width information for a set of columns. This meta will then be
 * used to determine final width of columns in the grid, based on additional settings
 * such as size to fit.
 */
export function columnWidthMeta(widthItems: ColumnAbstract[], base: ColumnAbstract) {
  let totalWidth = 0;
  let flexTotal = 0;
  const widths: Map<number, number> = new Map();

  // Extract default values from base configuration
  const defaultMin = base.widthMin ?? DEFAULT_COLUMN_WIDTH_MIN;
  const defaultMax = base.widthMax ?? DEFAULT_COLUMN_WIDTH_MAX;
  const defaultWidth = base.width ?? DEFAULT_COLUMN_WIDTH;
  const defaultFlex = base.widthFlex ?? 0;

  // Process each column, prioritizing rightmost columns first
  for (let i = widthItems.length - 1; i >= 0; i--) {
    const item = widthItems[i];

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
