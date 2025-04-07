import {
  DEFAULT_MAX_WIDTH,
  DEFAULT_MIN_WIDTH,
  DEFAULT_WIDTH,
} from "@1771technologies/grid-constants";
import { clamp } from "@1771technologies/js-utils";
import type { ColumnWidthLike } from "./column-get-positions.js";
import { columnIsEmptyById } from "../column-is-empty.js";

/**
 * Calculates widths for columns while respecting min/max constraints and handling empty columns.
 *
 * This function processes each column to determine its width based on:
 * - Column's own width properties
 * - Base (default) width properties
 * - Delta adjustments
 * - Special handling for empty columns
 *
 * @typeParam T - Column type that extends ColumnWidthLike with width-related properties
 *
 * @param columns - Array of columns to calculate widths for
 * @param columnBase - Default column properties to use when not specified in individual columns
 * @param deltas - Record of width adjustments by column ID, or null if no adjustments
 *
 * @returns Object containing:
 *   - widths: Record mapping column IDs to their calculated widths
 *   - totalWidth: Sum of all column widths
 *   - flexTotal: Sum of all flex values for use in subsequent space distribution
 *
 * @remarks
 * Width calculation follows these rules:
 * - Empty columns get a fixed width of 30px
 * - Non-empty columns use width + delta, clamped between min and max
 * - Properties fallback order: column -> columnBase -> defaults
 * - Default values are used when neither column nor base specify a value
 *   - DEFAULT_MIN_WIDTH for minimum width
 *   - DEFAULT_WIDTH for base width
 *   - DEFAULT_MAX_WIDTH for maximum width
 *
 * @example
 * ```typescript
 * const columns = [
 *   { id: 'col1', width: 100, widthMin: 50 },
 *   { id: 'col2', width: 200, widthMax: 300 }
 * ];
 *
 * const { widths, totalWidth, flexTotal } = columnGetWidths(
 *   columns,
 *   { widthMin: 30, widthMax: 500 },  // base properties
 *   { col1: 10 }                       // delta adjustments
 * );
 * // widths = { col1: 110, col2: 200 }
 * // totalWidth = 310
 * // flexTotal = 0
 * ```
 */
export function columnGetWidths<T extends ColumnWidthLike>(
  columns: T[],
  columnBase: Partial<Omit<T, "id">>,
  deltas: Record<string, number> | null,
) {
  let totalWidth = 0;
  let flexTotal = 0;
  const widths: Record<string, number> = {};

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (columnIsEmptyById(column.id)) {
      totalWidth += 30;
      widths[column.id] = 30;
    } else {
      const changeDelta = deltas?.[column.id] ?? 0;

      widths[column.id] = clamp(
        column.widthMin ?? columnBase.widthMin ?? DEFAULT_MIN_WIDTH,
        (column.width ?? columnBase.width ?? DEFAULT_WIDTH) + changeDelta,
        column.widthMax ?? columnBase.widthMax ?? DEFAULT_MAX_WIDTH,
      );

      flexTotal += column.widthFlex ?? columnBase.widthFlex ?? 0;
      totalWidth += widths[column.id];
    }
  }

  return { widths, totalWidth, flexTotal };
}
