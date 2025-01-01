import { getStringTableWidths } from "./get-string-table-widths.js";
import { padStringRight } from "./pad-string-right.js";

/**
 * Formats tabular data into a string representation with aligned columns and headers.
 *
 * The function creates a formatted table string where:
 * - Columns are separated by " | "
 * - Headers are separated from data by a line of dashes
 * - All columns are right-padded to align with the widest element in each column
 * - Non-string values are converted to their string representation
 *
 * @param tableData - A 2D array containing the table data. Each inner array represents
 *                   a row, and each element within represents a cell. Elements can be
 *                   of any type and will be converted to strings.
 * @param headers - An array of strings representing the column headers.
 *
 * @returns A formatted string representing the table with a leading and trailing newline.
 *          Returns an empty string if tableData is empty.
 *
 * @example
 * ```typescript
 * const headers = ['Name', 'Age'];
 * const data = [
 *   ['John', 30],
 *   ['Jane', 25]
 * ];
 *
 * const table = formatTable(data, headers);
 * // Returns:
 * //
 * // Name | Age
 * // -----------
 * // John | 30
 * // Jane | 25
 * //
 * ```
 */
export function formatTable(tableData: unknown[][], headers: string[]) {
  if (!tableData.length) return "";

  const data = [headers, ...tableData.map((row) => row.map((c) => `${c as string}`))];

  const widths = getStringTableWidths(data);

  const table = data
    .map((row, i) => {
      if (i === 0) {
        const header = row.map((c, i) => padStringRight(c, widths[i])).join(" | ");
        const separator = "-".repeat(header.length);

        return header + "\n" + separator;
      }
      return row.map((c, i) => padStringRight(c, widths[i])).join(" | ");
    })
    .join("\n");

  return `\n${table}\n`;
}
