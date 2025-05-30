import type { ColumnGroupRowCore, ColumnGroupRowsCore } from "@1771technologies/grid-types/core";
import { columnsByPin } from "./columns-by-pin.js";
import type { ColumnLike } from "./columns-visible/columns-visible.js";

export function columnGroups<T extends ColumnLike>(
  columns: T[],
  delimiter: string,
): {
  startLevels: ColumnGroupRowsCore;
  centerLevels: ColumnGroupRowsCore;
  endLevels: ColumnGroupRowsCore;
  allLevels: ColumnGroupRowsCore;
} {
  // Separate columns by their pin position (start, center, end)
  const { start, center, end } = columnsByPin(columns);

  // Calculate the maximum depth of group nesting across all columns
  let hierarchyHeight = 0;
  for (let i = 0; i < columns.length; i++) {
    const currentHeight = columns[i]?.groupPath?.length ?? 0;
    if (hierarchyHeight < currentHeight) hierarchyHeight = currentHeight;
  }

  // Track how many times each group appears to generate unique keys
  const occurrenceCount: Record<string, number> = {};

  // Create hierarchy levels for each pin position
  // indexOffset ensures correct column indices across pinned sections
  const startLevels = createHierarchyLevels(start, hierarchyHeight, delimiter, 0, occurrenceCount);
  const centerLevels = createHierarchyLevels(
    center,
    hierarchyHeight,
    delimiter,
    start.length,
    occurrenceCount,
  );
  const endLevels = createHierarchyLevels(
    end,
    hierarchyHeight,
    delimiter,
    start.length + center.length,
    occurrenceCount,
  );

  // Combine all levels into a single array while maintaining pin order
  const allLevels: ColumnGroupRowsCore = [];
  for (let i = 0; i < hierarchyHeight; i++) {
    allLevels.push([...startLevels[i], ...centerLevels[i], ...endLevels[i]]);
  }

  return {
    startLevels,
    centerLevels,
    endLevels,
    allLevels,
  };
}

/**
 * Creates hierarchical group levels for a set of columns.
 *
 * @description
 * Processes a set of columns to create a multi-level hierarchy of groups.
 * Each level represents one depth in the grouping structure, with groups
 * spanning multiple columns when consecutive columns share the same group.
 *
 * @template T - Type extending ColumnLike interface
 * @param {T[]} columns - Array of columns to process
 * @param {number} height - Maximum depth of the group hierarchy
 * @param {string} delimiter - Character(s) to separate group path segments
 * @param {number} indexOffset - Offset to add to column indices (for pinned columns)
 * @param {Record<string, number>} occurrenceCount - Tracks occurrences of each group
 *
 * @returns {ColumnGroupRows} Array of levels, each containing group spans
 *
 * @private
 */
function createHierarchyLevels<T extends ColumnLike>(
  columns: T[],
  height: number,
  delimiter: string,
  indexOffset: number,
  occurrenceCount: Record<string, number> = {},
): ColumnGroupRowsCore {
  const levels: ColumnGroupRowsCore = [];

  // Process each level of the hierarchy
  for (let i = 0; i < height; i++) {
    const level: ColumnGroupRowCore = [];

    // Process each column at the current level
    for (let j = 0; j < columns.length; j++) {
      // Skip columns with no group at this level
      if (!columns[j].groupPath?.[i]) {
        level.push(null);
      } else {
        // Get the parent group's ID (if any) from the previous level
        const parentKey = levels[i - 1]?.[j]?.id ?? "";

        // Create the current group's ID by combining parent ID and current path segment
        const pathId = columns[j].groupPath![i];
        const key = parentKey ? `${parentKey}${delimiter}${pathId}` : pathId;

        // If this group matches the previous column's group, extend its span
        if (key === level[j - 1]?.id) {
          level[j - 1]!.end++;
          level.push(level[j - 1]);
        } else {
          // Initialize occurrence counter for new groups
          occurrenceCount[key] ??= 0;
          const count = occurrenceCount[key];

          // Create a new group span
          level.push({
            id: key,
            start: j + indexOffset,
            end: j + indexOffset + 1,
            occurrenceKey: `${key}-${count}`,
            isCollapsible: false,
          });
          occurrenceCount[key]++;
        }
      }
    }

    // Determine collapsibility for each group in the level
    for (let i = 0; i < level.length; i++) {
      const item = level[i];
      if (!item) continue;

      // A group is collapsible if any of its columns aren't marked as always-visible
      const isCollapsible = columns
        .slice(item.start - indexOffset, item.end - indexOffset)
        .some((c) => c.groupVisibility !== "always-visible");

      item.isCollapsible = isCollapsible;
    }

    levels.push(level);
  }

  return levels;
}
