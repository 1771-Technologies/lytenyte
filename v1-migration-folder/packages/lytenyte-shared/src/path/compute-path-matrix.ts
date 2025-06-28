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

import type { PathProvidedItem, PathMatrix, PathMatrixItem } from "./+types.path-table.js";

/**
 * Extracts the ID and join ID parts from a path component.
 *
 * @param c - Either a string (where id and joinId are the same) or an object with id and optional joinId
 * @returns A tuple containing [id, joinId] where joinId defaults to id if not specified
 */
function getIdPartAndJoinPart(c: string | { id: string; joinId?: string }) {
  if (typeof c === "string") return [c, c];

  return [c.id, c.joinId ?? c.id];
}

/**
 * Computes a matrix representation of hierarchical path data.
 *
 * This function transforms a tree-like structure (represented by paths) into a 2D matrix where:
 * - Each column represents a path from the input array
 * - Each row represents a depth level in the hierarchy
 * - Each cell contains metadata about the node at that position or null
 *
 * The resulting matrix is particularly useful for:
 * - Column-grouped matrices with hierarchical headers
 * - Tree-grid layouts with proper spanning cells
 * - Visualizations that require flattening hierarchical data into a grid
 *
 * Each node in the output matrix includes:
 * - Unique ID and occurrence count
 * - Position in the matrix (start/end columns)
 * - Complete path to reach this node
 * - Related nodes that should be joined/grouped together
 *
 * @example
 * ```ts
 * const table = computePathMatrix([
 *   { id: "x", groupPath: ["A", "B"] },
 *   { id: "y" },
 *   { id: "z", groupPath: ["A", "B", "C"] },
 *   { id: "d", groupPath: ["Y", "X", "C"] },
 *   { id: "v", groupPath: ["F"] },
 * ]);
 * ```
 *
 * Results in:
 * ```
 * ┌─────────┬───────────┬─────────────┐
 * │ A|0 / 1 │ A#B|0 / 1 │ -           │
 * ├─────────┼───────────┼─────────────┤
 * │ -       │ -         │ -           │
 * ├─────────┼───────────┼─────────────┤
 * │ A|2 / 3 │ A#B|2 / 3 │ A#B#C|2 / 3 │
 * ├─────────┼───────────┼─────────────┤
 * │ Y|3 / 4 │ Y#X|3 / 4 │ Y#X#C|3 / 4 │
 * ├─────────┼───────────┼─────────────┤
 * │ F|4 / 5 │ -         │ -           │
 * └─────────┴───────────┴─────────────┘
 * ```
 *
 * @param paths - Array of items with groupPath properties defining their hierarchical structure
 * @param maxDepth - Optional override for the matrix height (must be >= actual max depth)
 * @param mutMatrixSeenMap - Optional map to track occurrences of path IDs (making them globally unique)
 * @returns A column-based matrix where each element is either null or a PathMatrixItem
 */
export function computePathMatrix<T extends PathProvidedItem>(
  paths: T[],
  maxDepth?: number,
  mutMatrixSeenMap: Record<string, number> = {},
  pathDelimiter = "#",
): PathMatrix {
  // Early return for empty input - nothing to process
  if (!paths.length) return [];

  // Calculate the required matrix height (number of rows)
  // This is determined by the deepest path in the input data
  const maxDepthComputed = Math.max(...paths.map((c) => c.groupPath?.length ?? 0));

  // Use the greater of computed depth or provided maxDepth to ensure matrix can accommodate all data
  // This allows for creating matrices that can be joined with others of different depths
  maxDepth = maxDepth == undefined ? maxDepthComputed : Math.max(maxDepth, maxDepthComputed);

  // Initialize the first column to establish the pattern
  // We process the first path separately as a starting point
  const first = paths[0];
  const firstRow: (PathMatrixItem | null)[] = [];

  // These arrays track the cumulative path as we descend through the hierarchy
  const idPath: string[] = [];
  const joinPath: string[] = [];

  // Process each level of depth for the first path
  for (let i = 0; i < maxDepth; i++) {
    const current = first.groupPath?.[i];

    // If there's no element at this depth, add null to maintain matrix dimensions
    if (current == null) {
      firstRow.push(null);
      continue;
    }

    // Extract the id and join parts from the current path component
    const [pathPart, joinPart] = getIdPartAndJoinPart(current);

    // Build up the cumulative path arrays
    idPath.push(pathPart);
    joinPath.push(joinPart);

    // Create composite IDs by joining the path segments with "#"
    const id = idPath.join(pathDelimiter);
    const joinId = joinPath.join(pathDelimiter);

    // Track occurrences of this ID to make it globally unique
    // Initialize to -1 if not seen before (will be incremented to 0)
    mutMatrixSeenMap[id] ??= -1;
    mutMatrixSeenMap[id]++;

    // Create the path matrix item with all necessary metadata
    firstRow.push({
      id, // Unique identifier for this node
      idOccurrence: `${id}${pathDelimiter}${mutMatrixSeenMap[id]}`, // ID with occurrence count appended
      groupPath: [...idPath], // Full path to this node (for identification)
      joinPath: [...joinPath], // Path used for determining joins
      joinId, // ID used for joining with other nodes
      idsInNode: new Set([id]), // Track all IDs contained in this node
      start: 0, // Column index where this node starts
      end: 1, // Column index where this node ends (exclusive)
    });
  }

  // Initialize the matrix with the first column we've processed
  const matrix: (PathMatrixItem | null)[][] = [firstRow];

  // Process each remaining path
  for (let i = 1; i < paths.length; i++) {
    const c = paths[i];
    const previousRow = matrix[i - 1]; // Reference the previous column for comparison

    const row: (PathMatrixItem | null)[] = [];
    const idPath: string[] = [];
    const joinPath: string[] = [];

    // Process each depth level for this path
    for (let j = 0; j < maxDepth; j++) {
      const prevColumn = previousRow[j];
      const current = c.groupPath?.[j];

      // Add null for missing levels to maintain matrix dimensions
      if (current == null) {
        row.push(null);
        continue;
      }

      // Extract the parts from the current component
      const [idPart, joinPart] = getIdPartAndJoinPart(current);

      // Build the cumulative paths
      idPath.push(idPart);
      joinPath.push(joinPart);

      const joinId = joinPath.join(pathDelimiter);
      const id = idPath.join(pathDelimiter);

      // Check if this node should be merged with the previous node at the same level
      // This happens when they share the same joinId, indicating they're part of the same group
      if (prevColumn?.joinId === joinId) {
        // Extend the previous node to include this column
        (prevColumn as any).end++;
        row.push(prevColumn); // Reuse the previous node reference

        // Add this node's ID to the set of IDs in the merged node
        prevColumn.idsInNode.add(id);
      } else {
        // This is a new group, so create a new node
        // Track occurrences for uniqueness
        mutMatrixSeenMap[id] ??= -1;
        mutMatrixSeenMap[id]++;

        // Create a new path matrix item
        row.push({
          id,
          idOccurrence: `${id}${pathDelimiter}${mutMatrixSeenMap[id]}`,
          joinId,
          groupPath: [...idPath],
          joinPath: [...joinPath],
          idsInNode: new Set([id]),
          start: i, // This node starts at the current column
          end: i + 1, // And initially spans just one column
        });
      }
    }

    matrix.push(row);
  }

  return matrix;
}
