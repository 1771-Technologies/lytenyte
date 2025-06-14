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

import type { PathBranch, PathProvidedItem, PathRoot } from "./+types.path-table.js";
import { computePathMatrix } from "./compute-path-matrix.js";

/**
 * Transforms a collection of paths into a hierarchical tree structure.
 *
 * This function converts the matrix output from `computePathTable` into a
 * structured tree with well-defined parent-child relationships. Each path
 * becomes a branch in the tree, with leaf nodes containing the original path data.
 *
 * Use cases for the resulting tree structure:
 * - Hierarchical data navigation
 * - Building nested UI components (menus, breadcrumbs, etc.)
 * - Efficient ancestor/descendant lookups
 *
 * @example
 * ```ts
 * const paths = [
 *   { id: "x", groupPath: ["A", "B"] },
 *   { id: "y" },
 *   { id: "z", groupPath: ["A", "B", "C"] },
 *   { id: "d", groupPath: ["Y", "X", "C"] },
 *   { id: "v", groupPath: ["F"] },
 * ];
 *
 * const tree = computePathTree(paths);
 * ```
 *
 * Results in:
 * ```
 * root
 * ├─ A / root / branch
 * │  └─ A#B / A / branch
 * │     ├─ x / A#B / leaf
 * │     └─ A#B#C / A#B / branch
 * │        └─ z / A#B#C / leaf
 * ├─ y / root / leaf
 * ├─ Y / root / branch
 * │  └─ Y#X / Y / branch
 * │     └─ Y#X#C / Y#X / branch
 * │        └─ d / Y#X#C / leaf
 * └─ F / root / branch
 *    └─ v / F / leaf
 * ```
 *
 * @param paths - Array of path items with groupPath properties defining the hierarchy
 * @param mutableSeenMap - Optional map to track occurrences of path IDs for uniqueness
 * @param nonAdjacentAreDistinct - When true, treats paths with the same ID but different
 *                               occurrences as distinct branches, even when not adjacent
 * @returns A hierarchical tree structure with all paths organized under a root node
 */
export function computePathTree<T extends PathProvidedItem>(
  paths: T[],
  mutableSeenMap: Record<string, number> = {},
  nonAdjacentAreDistinct: boolean = false,
): PathRoot<T> {
  // Generate the path matrix (MxN structure) using the existing utility
  const matrix = computePathMatrix(paths, undefined, mutableSeenMap);

  // Initialize the root node of our tree
  const tree: PathRoot<T> = { kind: "root", children: new Map() };

  // Process each column in the matrix (each column represents a complete path)
  for (let c = 0; c < matrix.length; c++) {
    // Start at the root for each new path
    let current: PathRoot<T> | PathBranch<T> = tree;

    // Traverse each row in the current column (representing hierarchy levels)
    for (let r = 0; r < matrix[c].length; r++) {
      const data = matrix[c][r];
      // Skip null entries (gaps in the hierarchy)
      if (data == null) continue;

      // Determine node identifier - use occurrence-specific ID or basic ID
      // depending on how we handle duplicates across the tree
      const id = nonAdjacentAreDistinct ? data.idOccurrence : data.id;

      // Create branch if it doesn't exist yet
      if (!current.children.has(id)) {
        current.children.set(id, {
          kind: "branch",
          id,
          data,
          parent: current,
          children: new Map(),
        });
      }

      // Retrieve the child branch with proper typing
      const child = current.children.get(id)! as PathBranch<T>;

      // Ensure consistency in the children map
      current.children.set(id, child);

      // Advance to this child for the next hierarchy level
      current = child;
    }

    // After processing all levels, add the original path item as a leaf node
    current.children.set(paths[c].id, {
      kind: "leaf",
      data: paths[c],
      parent: current,
    });
  }

  return tree;
}
