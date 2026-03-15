import type { ColumnAbstract } from "../types.js";
import type { PathMatrixItem, PathTableItem } from "../path/+types.path-table.js";
import { computePathMatrix } from "../path/compute-path-matrix.js";
import { transposePathMatrix } from "../path/transpose-path-table.js";

export function buildSectionTable(
  section: ColumnAbstract[],
  maxDepth: number,
  lastGroupShouldFill: boolean,
  seenMap: Record<string, number>,
  pathDelimiter: string,
  colOffset: number,
): PathTableItem<ColumnAbstract>[][] {
  if (!section.length) return [];

  const matrix = transposePathMatrix(computePathMatrix(section, maxDepth, seenMap, pathDelimiter));
  const maxRowSpan = maxDepth + 1;
  const pathTable: PathTableItem<ColumnAbstract>[][] = [];
  const completed = new Set<number>();
  const seen = new Set<string>();

  for (let ri = 0; ri <= maxDepth; ri++) {
    const rowToProcess = matrix[ri];
    const row: PathTableItem<ColumnAbstract>[] = [];

    for (let ci = 0; ci < section.length; ci++) {
      if (completed.has(ci)) continue;

      const item = rowToProcess?.[ci];

      if (item == null) {
        const hasGroup = (section[ci].groupPath?.length ?? 0) > 0;

        // With lastGroupShouldFill: defer grouped columns until the last row
        if (lastGroupShouldFill && hasGroup && ri < maxDepth) continue;

        completed.add(ci);
        if (lastGroupShouldFill && hasGroup) {
          row.push({
            kind: "leaf",
            data: section[ci],
            rowStart: maxDepth,
            colStart: ci + colOffset,
            colSpan: 1,
            rowSpan: 1,
          });
        } else {
          row.push({
            kind: "leaf",
            data: section[ci],
            rowStart: ri,
            colStart: ci + colOffset,
            colSpan: 1,
            rowSpan: maxRowSpan - ri,
          });
        }
      } else {
        const id = item.idOccurrence;
        if (seen.has(id)) continue;
        seen.add(id);

        let rowSpan = 1;
        if (lastGroupShouldFill) {
          // Find the shallowest grouped column in this group's span
          let minColDepth = Infinity;
          for (let k = item.start; k < item.end; k++) {
            const d = section[k].groupPath?.length ?? 0;
            if (d > 0 && d < minColDepth) minColDepth = d;
          }
          // If this is the last group level for the shallowest column, extend to fill to the leaf row
          if (isFinite(minColDepth) && minColDepth === ri + 1) {
            rowSpan = maxDepth - ri;
          }
        }

        row.push({
          kind: "group",
          data: item as PathMatrixItem,
          rowStart: ri,
          colStart: item.start + colOffset,
          colSpan: item.end - item.start,
          rowSpan,
        });
      }
    }

    pathTable.push(row);
  }

  return pathTable;
}
