/**
 * LyteNyte grid represents the row space as a flat set of indices. It is convenient
 * to be able to request row indices based on their sectional position, for example
 * requesting row index 0 as the first scrollable row. The function below will adjust
 * the requested row index  to something LyteNyte grid understands.
 *
 * If the request index is outside of the row index bounds the `null` is returned. An index
 * may be out of bounds when:
 * - it is negative
 * - greater than the role count
 * - greater row count
 * - requesting an index in a section that won't have it, like requesting a top row
 *   when the are not top rows.
 */
export function rowIndexForSection(
  requestedIndex: number,
  section: "top" | "center" | "bottom" | "flat",
  topCount: number,
  bottomCount: number,
  rowCount: number,
): number | null {
  if (section === "top" && (!topCount || requestedIndex > topCount)) return null;
  if (section === "bottom" && (!bottomCount || requestedIndex > bottomCount)) return null;

  if (requestedIndex >= rowCount || requestedIndex < 0) return null;

  // If the section is "flat", then we can assume that the
  // requested index is the actual row index the user wants.
  // If the section is "top", then we don't actually need to perform
  // any offset calculations, since we start counting from the top section.
  if (section === "flat" || section === "top") return requestedIndex;

  // If the section is `center`, the user is requesting a center row index. The center
  // row indices are offset by the number of top rows, hence we add the top count.
  if (section === "center") return requestedIndex + topCount;

  // If the section is "bottom", we are requesting a row at the very bottom
  // of the grid. Hence the section should be offset by the number of rows
  // above the bottom section.
  const firstBottomIndex = rowCount - bottomCount;
  return requestedIndex + firstBottomIndex;
}
