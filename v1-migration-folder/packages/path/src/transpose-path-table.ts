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

import type { PathMatrix } from "./+types.path-table.js";

/**
 * Transposes a column-based path matrix into a row-based path matrix.
 *
 * This function converts the matrix representation from a format where:
 * - The primary array contains columns (each representing a path)
 * - Each column contains cells for different depth levels
 *
 * Into a format where:
 * - The primary array contains rows (each representing a depth level)
 * - Each row contains cells for different paths
 *
 * This transformation is useful when you need to switch between column-oriented
 * and row-oriented processing of the hierarchical data.
 *
 * @param path - The column-based path table to transpose
 * @returns A row-based version of the same path table
 */
export function transposePathMatrix(path: PathMatrix): PathMatrix {
  // Early return for empty input - nothing to transpose
  if (!path.length) return path;

  // Initialize the result array that will hold our transposed data
  const rows: PathMatrix = [];

  // Determine the depth (number of rows) from the first column
  // This assumes all columns have the same depth (which should be true by design)
  const depth = path[0].length;

  // Iterate through each depth level (which will become rows)
  for (let i = 0; i < depth; i++) {
    // Create a new row for this depth level
    const row = [];

    // For each column in the original table
    for (let j = 0; j < path.length; j++) {
      // Take the cell at the current depth from each column
      // and add it to our new row
      row.push(path[j][i]);
    }

    // Add the completed row to our result
    rows.push(row);
  }

  // Return the transposed table
  return rows;
}
