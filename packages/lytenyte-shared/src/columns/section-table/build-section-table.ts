import type { ColumnAbstract } from "../../types.js";
import type { PathMatrixItem, PathTableItem } from "../../path/+types.path-table.js";

/**
 * Builds a 2D path table for a single pinned section (start, center, or end). Each row in the
 * output corresponds to a depth level in the column group hierarchy, and each cell is either a
 * group header spanning one or more columns or a leaf cell representing an individual column.
 *
 * maxDepth should reflect the maximum group nesting depth across all sections so that row counts
 * are normalized. When lastGroupShouldFill is true, the last group header for a column extends
 * downward to fill the gap to the leaf row, preventing layout shifts as groups are collapsed or
 * expanded. seenMap is shared across multiple sections in the same render pass to ensure group
 * cell IDs are globally unique. colOffset positions the section's cells within the overall grid.
 */
export function buildSectionTable(
  section: ColumnAbstract[],
  maxDepth: number,
  lastGroupShouldFill: boolean,
  seenMap: Record<string, number>,
  pathDelimiter: string,
  colOffset: number,
): PathTableItem<ColumnAbstract>[][] {
  if (!section.length) return [];

  const table: PathTableItem<ColumnAbstract>[][] = Array.from({ length: maxDepth + 1 }, () => []);
  const minColDepths = new Array<number>(maxDepth).fill(Infinity);

  for (let ci = 0; ci < section.length; ci++) {
    const col = section[ci];
    const depth = col.groupPath?.length ?? 0;

    let id = "";
    for (let di = 0; di < depth; di++) {
      id = di === 0 ? col.groupPath![di] : `${id}${pathDelimiter}${col.groupPath![di]}`;
      const row = table[di];
      const last = row[row.length - 1];

      if (last?.kind === "group" && last.data.id === id) {
        (last as any).colSpan++;
        (last.data as any).end++;
        if (depth < minColDepths[di]) {
          minColDepths[di] = depth;
          (last as any).rowSpan = lastGroupShouldFill && depth === di + 1 ? maxDepth - di : 1;
        }
      } else {
        seenMap[id] ??= -1;
        minColDepths[di] = depth;
        row.push({
          kind: "group",
          data: {
            id,
            idOccurrence: `${id}${pathDelimiter}${++seenMap[id]}` as `${string}${string}${number}`,
            joinId: id,
            groupPath: col.groupPath!.slice(0, di + 1),
            joinPath: col.groupPath!.slice(0, di + 1),
            idsInNode: new Set([id]),
            start: ci,
            end: ci + 1,
          } as PathMatrixItem,
          rowStart: di,
          colStart: ci + colOffset,
          colSpan: 1,
          rowSpan: lastGroupShouldFill && depth === di + 1 ? maxDepth - di : 1,
        });
      }
    }

    const leafRow = lastGroupShouldFill && depth > 0 ? maxDepth : depth;
    table[leafRow].push({
      kind: "leaf",
      data: col,
      rowStart: leafRow,
      colStart: ci + colOffset,
      colSpan: 1,
      rowSpan: lastGroupShouldFill && depth > 0 ? 1 : maxDepth + 1 - depth,
    });
  }

  return table;
}
