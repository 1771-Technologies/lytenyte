/**
 * Determines whether a string is one of Excel's built-in error values, such
 * as `#REF!`, `#N/A`, `#DIV/0!`, `#VALUE!`, `#NAME?`, `#NUM!`, `#NULL!`, or
 * `#GETTING_DATA`.
 *
 * Error values require special handling when writing cell XML: they must be
 * emitted with the cell type attribute `t="e"` and their value placed inside
 * the `<v>` element verbatim, rather than being treated as a regular string
 * or number. This function is used during cell serialization to detect error
 * values and switch to the correct output path.
 */
const EXCEL_ERRORS = new Set(["#NULL!", "#DIV/0!", "#VALUE!", "#REF!", "#NAME?", "#NUM!", "#N/A", "#GETTING_DATA"]);

export function isExcelError(value: string): boolean {
  return EXCEL_ERRORS.has(value);
}
