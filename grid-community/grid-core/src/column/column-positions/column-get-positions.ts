import { makeUint32PositionArray } from "@1771technologies/js-utils";
import { columnGetWidths } from "./column-get-widths.js";

export type ColumnWidthLike = {
  id: string;
  widthFlex?: number;
  widthMin?: number;
  widthMax?: number;
  width?: number;
};

/**
 * Calculates cumulative positions for columns taking into account flex sizing and viewport width.
 *
 * This function first calculates individual column widths, then distributes any remaining viewport
 * space among flex columns proportionally. Finally, it converts these widths into cumulative
 * positions.
 *
 * @typeParam T - Column type that extends ColumnWidthLike with width-related properties
 *
 * @param columns - Array of columns to calculate positions for
 * @param columnBase - Default column properties to use when not specified in individual columns
 * @param deltas - Record of width adjustments by column ID, or null if no adjustments
 * @param viewportWidth - Total available width to distribute among columns
 *
 * @returns Uint32Array where each element represents the cumulative position (x-coordinate)
 *          of the right edge of each column. The array starts with 0 and has length of columns.length + 1.
 *
 * @remarks
 * The function handles flex distribution with these rules:
 * - Free space is only distributed when total column width is less than viewport width
 * - Space is distributed proportionally based on flex values
 * - Distribution ignores min/max constraints to ensure all space is used
 * - Fractional pixels are handled by flooring and distributing remainder one pixel at a time
 *
 * @example
 * ```typescript
 * const columns = [
 *   { id: 'col1', width: 100, widthFlex: 1 },
 *   { id: 'col2', width: 100, widthFlex: 2 }
 * ];
 *
 * const positions = columnGetPositions(
 *   columns,
 *   { widthMin: 50 },  // base properties
 *   { col1: 10 },      // delta adjustments
 *   400                // viewport width
 * );
 * // If total width < 400, remaining space is distributed in 1:2 ratio
 * ```
 */
export function columnGetPositions<T extends ColumnWidthLike>(
  columns: T[],
  columnBase: Partial<Omit<T, "id">>,
  deltas: Record<string, number> | null,
  viewportWidth: number,
) {
  const { widths, totalWidth, flexTotal } = columnGetWidths(columns, columnBase, deltas);

  // There is free space available. If the columns have a flex value, then
  // this space needs to be distributed among the columns
  if (flexTotal && totalWidth < viewportWidth) {
    const freeSpace = viewportWidth - totalWidth;

    // Dividing by free space may result in a fraction. We floor our ratio addition below,
    // which means there may be some free space. We simply distribute this space 1px at time.
    const unitFreeSpace = Math.floor(freeSpace / flexTotal);
    let spaceThatWillBeLeft = freeSpace - unitFreeSpace * flexTotal;

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (!column.widthFlex) continue;

      // The flex ratio ignores the min and max width setting intentionally. The purpose
      // of purpose of the flex ratio is to use all the remaining free space. It does not make
      // sense to allow there to be some available free space. Calculating running spaces is a little
      // costly - so it's better to just disallow weird configurations.
      const ratioMultiplier = column.widthFlex / flexTotal;
      const additionalWidth =
        Math.floor(freeSpace * ratioMultiplier) + (spaceThatWillBeLeft > 0 ? 1 : 0);
      spaceThatWillBeLeft--;

      widths[column.id] += additionalWidth;
    }
  }

  return makeUint32PositionArray((i) => widths[columns[i].id], columns.length);
}
