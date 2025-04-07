import type { ColumnPinCore } from "@1771technologies/grid-types/core";

/**
 * Groups an array of columns into three arrays based on their pin position: start, center (unpinned), or end.
 *
 * @template T - Type of column objects, must have a 'pin' property of type ColumnPin
 * @param columns - Array of column objects to group by pin position
 * @returns An object containing three arrays:
 * - start: Columns pinned to the left/start
 * - center: Unpinned columns
 * - end: Columns pinned to the right/end
 *
 * @example
 * ```typescript
 * const columns = [
 *   { id: '1', pin: 'start' },
 *   { id: '2', pin: 'center' },
 *   { id: '3', pin: 'end' }
 * ];
 *
 * const grouped = columnsByPin(columns);
 * // Returns: {
 * //   start: [{ id: '1', pin: 'start' }],
 * //   center: [{ id: '2', pin: 'center' }],
 * //   end: [{ id: '3', pin: 'end' }]
 * // }
 * ```
 *
 * @remarks
 * - Maintains the relative order of columns within each group
 * - Columns without an explicit pin value are placed in the center group
 */
export function columnsByPin<T extends { pin?: ColumnPinCore }>(
  columns: T[],
): { start: T[]; center: T[]; end: T[] } {
  const start: T[] = [];
  const center: T[] = [];
  const end: T[] = [];

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.pin === "start") start.push(column);
    else if (column.pin === "end") end.push(column);
    else center.push(column);
  }

  return {
    start,
    center,
    end,
  };
}
