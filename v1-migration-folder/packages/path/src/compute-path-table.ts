/*
Copyright 2025 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { PathProvidedItem, PathTable, PathTableItem } from "./+types.path-table.js";
import { computePathMatrix } from "./compute-path-matrix.js";
import { transposePathMatrix } from "./transpose-path-table.js";

/**
 * Constructs a hierarchical table structure from path-based items, primarily used for creating
 * grouped table headers.
 *
 * The path table represents a layout with potentially asymmetric rows where:
 * - Each item in a row represents a column
 * - Each column defines its starting/ending positions and span ranges for both rows and columns
 * - Items are organized into a hierarchy based on their groupPath properties
 * - Leaf nodes (without children) will expand to fill available vertical space
 *
 * @example
 * ```ts
 * const table = computePathTable([
 *   { id: "x", groupPath: ["A", "B"] },
 *   { id: "y" },
 *   { id: "z", groupPath: ["A", "B", "C"] },
 *   { id: "d", groupPath: ["Y", "X", "C"] },
 *   { id: "v", groupPath: ["F"] },
 * ]);
 * ```
 *
 * This creates a table structure like:
 *
 * ```
 * ┌─────┬───┬───────┬───────┬───┐
 * │ A   │ y │ A     │ Y     │ F │
 * ├─────┤   ├───────┼───────┼───┤
 * │ A#B │   │ A#B   │ Y#X   │ v │
 * ├─────┤   ├───────┼───────┤   │
 * │ x   │   │ A#B#C │ Y#X#C │   │
 * │     │   ├───────┼───────┤   │
 * │     │   │ z     │ d     │   │
 * └─────┴───┴───────┴───────┴───┘
 * ```
 *
 * @param paths - Array of items with optional groupPath properties defining their hierarchical structure
 * @param maxDepth - Optional limit for the maximum depth of the hierarchy to process
 * @param mutableSeenMap - Optional map to track occurrence counts of path segments (used internally)
 * @returns A PathTable object containing the structured table layout and dimension information
 */
export function computePathTable<T extends PathProvidedItem>(
  paths: T[],
  maxDepth?: number,
  mutableSeenMap: Record<string, number> = {},
  pathDelimiter = "#",
  startOffset: number = 0,
): PathTable<T> {
  // Return an empty table structure if no paths are provided
  // This is an optimization that avoids unnecessary computation
  if (!paths.length) return { table: [], maxCol: 0, maxRow: 0 };

  // First compute the path matrix and transpose it
  // Transposition transforms the matrix from column-major to row-major order,
  // making it easier to process row by row
  const matrix = transposePathMatrix(
    computePathMatrix(paths, maxDepth, mutableSeenMap, pathDelimiter),
  );

  // Calculate the maximum row span
  // We add 1 because the matrix doesn't include the leaf nodes row,
  // which will be added during processing
  const maxRowSpan = matrix.length + 1;

  // Initialize the resulting table as a 2D array of path table items
  const pathTable: PathTableItem<T>[][] = [];

  // Track processed columns and group identifiers to avoid duplication
  // - completed: tracks columns that have been fully processed (including leaf nodes)
  // - seen: tracks specific group identifiers that have already been added to the table
  const completed = new Set<number>();
  const seen = new Set<string>();

  // Iterate through each row of the transposed matrix
  // Note: we use <= to process one more row than in the matrix (for leaf nodes)
  for (let ri = 0; ri <= matrix.length; ri++) {
    const rowToProcess = matrix[ri];

    // Create a new row for the path table
    const row: PathTableItem<T>[] = [];

    // Process each column in the current row
    for (let ci = 0; ci < paths.length; ci++) {
      // Skip columns that have already been fully processed
      if (completed.has(ci)) continue;

      const item = rowToProcess?.[ci];

      // Case: item is null - this indicates we've reached the end of a path
      // We need to create a leaf node that spans all remaining rows
      if (item == null) {
        const colSpan = 1; // Leaf nodes occupy exactly one column
        // Calculate how many rows this leaf node should span to fill the remaining space
        const rowSpan = maxRowSpan - ri;
        // Mark this column as completed so we don't process it again
        completed.add(ci);

        // Add the leaf node to the current row
        row.push({
          kind: "leaf",
          data: paths[ci], // Use the original path data
          rowStart: ri, // Start from the current row
          colStart: ci + startOffset, // Start from the current column
          colSpan, // Span exactly one column
          rowSpan, // Span all remaining rows
        });
      }
      // Case: item exists - this is a group node
      else {
        // Each group has a unique identifier to prevent duplication
        const id = item.idOccurrence;
        // Skip if we've already processed this specific group
        if (seen.has(id)) continue;
        // Mark this group as seen to avoid duplication
        seen.add(id);

        // Calculate column span based on the group's start and end positions
        const colSpan = item.end - item.start;

        // Add the group node to the current row
        row.push({
          kind: "group",
          data: item, // Use the group item data
          rowStart: ri, // Start from the current row
          colStart: ci + startOffset, // Start from the current column
          colSpan, // Span multiple columns as defined by the group
          rowSpan: 1, // Group nodes always span exactly one row
        });
      }
    }

    // Add the completed row to the path table
    pathTable.push(row);
  }

  // Return the final path table along with its dimensions
  return {
    table: pathTable, // The constructed table with all items properly positioned
    maxCol: paths.length, // Maximum number of columns equals the number of input paths
    maxRow: maxRowSpan, // Maximum number of rows as calculated earlier
  };
}
