import type { ColumnAbstract } from "../../types";
import type { ColumnPartitions } from "../partition-by-pin/partition-columns-by-pin-state";
import { buildSectionTable } from "../section-table/build-section-table.js";
import type { PathTableItem } from "./types.path-table";

/**
 * Builds the combined path table for all three pin sections. Each section is built independently
 * with the correct column offset so that colStart values are globally consistent across the full
 * grid. A shared seen map is passed across all three sections to ensure group cell IDs remain
 * unique even when the same group name appears in multiple sections. The resulting rows from all
 * three sections are then merged in start, center, end order to form the final combined view.
 */
export function pathTable(
  { start, center, end }: ColumnPartitions,
  maxDepth: number,
  lastShouldFill: boolean,
  joinDelimiter: string,
) {
  const seen: Record<string, number> = {};
  const endOffset = start.length + center.length;

  const startTable = buildSectionTable(start, maxDepth, lastShouldFill, seen, joinDelimiter, 0);
  const centerTable = buildSectionTable(center, maxDepth, lastShouldFill, seen, joinDelimiter, start.length);
  const endTable = buildSectionTable(end, maxDepth, lastShouldFill, seen, joinDelimiter, endOffset);

  const combinedView: PathTableItem<ColumnAbstract>[][] = [];
  for (let i = 0; i <= maxDepth; i++) {
    const row: PathTableItem<ColumnAbstract>[] = [];
    row.push(...(startTable[i] ?? []));
    row.push(...(centerTable[i] ?? []));
    row.push(...(endTable[i] ?? []));
    combinedView.push(row);
  }

  return combinedView;
}
