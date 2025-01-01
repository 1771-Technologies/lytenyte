/**
 * Calculates the maximum width needed for each column in a 2D string array table.
 *
 * @description
 * For a given 2D array of strings representing a table, this function calculates
 * the minimum width needed for each column based on the longest string in that column.
 * The function handles irregular tables where rows may have different lengths.
 *
 * @param data - A 2D array of strings representing table data.
 *               Each inner array represents a row, and each string represents a cell.
 *               Rows can have different lengths.
 *
 * @returns An array of numbers where each number represents the width needed for
 *          the corresponding column. Returns an empty array if input is empty.
 *          The length of the returned array equals the length of the longest row.
 *
 * @example
 * // Regular table
 * getStringTableWidths([
 *   ["name", "age"],
 *   ["John", "30"],
 *   ["Elizabeth", "25"]
 * ]) // [9, 3]
 *
 * // Irregular table
 * getStringTableWidths([
 *   ["a", "bb", "ccc"],
 *   ["d", "ee"],
 *   ["ggg", "h", "i", "jjj"]
 * ]) // [3, 2, 3, 3]
 *
 * // Empty table
 * getStringTableWidths([]) // []
 */
export function getStringTableWidths(data: string[][]): number[] {
  if (data.length === 0) {
    return [];
  }

  const numColumns = Math.max(...data.map((row) => row.length));
  const columnWidths: number[] = new Array<number>(numColumns).fill(0);

  for (const row of data) {
    for (let i = 0; i < row.length; i++) {
      columnWidths[i] = Math.max(columnWidths[i], row[i].length);
    }
  }

  return columnWidths;
}
