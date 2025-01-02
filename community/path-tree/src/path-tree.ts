/**
 * Base node interface for the path tree structure.
 */
export interface PathTreeBaseNode {
  /** Array of path segments representing the node's location in the tree */
  path: string[];
  /** Reference to the parent node, null for root nodes */
  parent: PathTreeParentNode | null;
}

/**
 * Represents a leaf node in the path tree that contains data.
 * @template T The type of data stored in the leaf node
 */
export interface PathTreeLeafNode<T> extends PathTreeBaseNode {
  /** Discriminator to identify leaf nodes */
  type: "leaf";
  /** The data stored in the leaf node */
  data: T;
}

/**
 * Represents a parent node in the path tree that can contain children.
 */
export interface PathTreeParentNode extends PathTreeBaseNode {
  /** Discriminator to identify parent nodes */
  type: "parent";
  /** Array of child nodes, which can be either leaves or other parent nodes */
  children: (PathTreeLeafNode<any> | PathTreeParentNode)[];
  /** Unique identifier for the node based on its path and occurrence count */
  occurrence: string;
}

/**
 * Union type representing either a leaf or parent node in the path tree.
 * @template T The type of data stored in leaf nodes
 */
export type PathTreeNode<T> = PathTreeLeafNode<T> | PathTreeParentNode;

/**
 * Input item format for creating nodes in the path tree.
 * @template T The type of data to be stored in leaf nodes
 */
export interface PathTreeInputItem<T> {
  /** Array of path segments defining the location in the tree */
  path: string[];
  /** The data to be stored in the leaf node */
  data: T;
}

/**
 * Configuration options for path tree creation.
 */
export interface PathTreeConfig {
  /**
   * When true, creates separate parent nodes for non-adjacent identical paths.
   * When false, merges all identical paths under the same parent.
   */
  considerAdjacency: boolean;
}

/**
 * Creates a hierarchical tree structure from an array of path-based items. The function supports two modes
 * of operation based on the `considerAdjacency` configuration:
 *
 * In adjacency mode (`considerAdjacency: true`):
 * - Creates separate parent nodes for identical paths that aren't adjacent in the input array
 * - Adjacent items with identical paths are grouped under the same parent
 * - Non-adjacent items with identical paths get new parent nodes with unique occurrence IDs
 *
 * In non-adjacency mode (`considerAdjacency: false`):
 * - Merges all items with identical paths under the same parent node
 * - Order of items in the input array doesn't affect the tree structure
 * - All identical paths share the same parent regardless of position
 *
 * Special cases:
 * - Empty paths (`[]`) create leaf nodes at the root level
 * - Each path segment creates a parent node except for the last item which becomes a leaf
 * - Parent nodes maintain references to their children and parent (null for root)
 * - Each parent node has a unique occurrence ID in the format "path/to/node#number"
 *
 * @template T The type of data stored in leaf nodes
 *
 * @param items Array of input items, each containing:
 *   - path: string[] - Array of path segments defining the item's location in the tree
 *   - data: T - Data to be stored in the leaf node
 *
 * @param config Configuration object with:
 *   - considerAdjacency: boolean - When true, creates separate parents for non-adjacent identical paths
 *                                 When false, merges all identical paths under the same parent
 *
 * @returns An array of root nodes. Each root can be either:
 *   - A leaf node (for empty paths)
 *   - A parent node with a tree structure underneath it
 *
 * @example
 * ```typescript
 * // Input items
 * const items = [
 *   { path: ["folder1", "subA"], data: "X" },
 *   { path: ["folder1", "subA"], data: "Y" },
 *   { path: ["folder1", "subB"], data: "Z" },
 *   { path: ["folder1", "subA"], data: "W" }
 * ];
 *
 * // With adjacency (true):
 * // Creates:
 * // folder1
 * // ├── subA (X, Y)
 * // ├── subB (Z)
 * // └── subA (W) <-- New parent due to non-adjacency
 * const adjacentTree = createPathTree(items, { considerAdjacency: true });
 *
 * // Without adjacency (false):
 * // Creates:
 * // folder1
 * // ├── subA (X, Y, W) <-- All subA items merged
 * // └── subB (Z)
 * const mergedTree = createPathTree(items, { considerAdjacency: false });
 *
 * // Empty paths create root leaves
 * const mixedItems = [
 *   { path: [], data: "root1" },
 *   { path: ["folder1"], data: "A" },
 *   { path: [], data: "root2" }
 * ];
 * // Creates: root1 (leaf), folder1/A, root2 (leaf)
 * const mixedTree = createPathTree(mixedItems);
 * ```
 */
export function createPathTree<T>(
  items: PathTreeInputItem<T>[],
  config: PathTreeConfig = { considerAdjacency: false },
): PathTreeNode<T>[] {
  const roots: PathTreeNode<T>[] = [];
  const pathOccurrences = new Map<string, number>();
  const pathToParentMap = new Map<string, PathTreeParentNode>();

  function getOccurrenceKey(path: string[]): string {
    const pathKey = path.join("/");
    const count = pathOccurrences.get(pathKey) ?? 0;
    pathOccurrences.set(pathKey, count + 1);
    return `${pathKey}#${count}`;
  }

  function isAdjacentPath(
    existingParent: PathTreeParentNode,
    pathSegment: string,
    level: number,
  ): boolean {
    const lastChild = existingParent.children[existingParent.children.length - 1];
    if (!lastChild) return false;

    return lastChild.path.length === level + 1 && lastChild.path[level] === pathSegment;
  }

  function findOrCreateParent(
    path: string[],
    currentLevel: number,
    currentParent: PathTreeParentNode | null,
  ): PathTreeParentNode {
    // If we're at the last parent level (one before the leaf)
    if (currentLevel === path.length - 1) {
      if (!config.considerAdjacency) {
        const pathKey = path.slice(0, currentLevel + 1).join("/");
        const existingParent = pathToParentMap.get(pathKey);
        if (existingParent) {
          return existingParent;
        }
      }

      // For adjacency mode and if we have a current parent
      if (config.considerAdjacency && currentParent) {
        const lastChild = currentParent.children[currentParent.children.length - 1] as
          | PathTreeParentNode
          | undefined;
        if (
          lastChild?.type === "parent" &&
          isAdjacentPath(currentParent, path[currentLevel], currentLevel)
        ) {
          return lastChild;
        }
      }

      const newParent: PathTreeParentNode = {
        type: "parent",
        path: path.slice(0, currentLevel + 1),
        parent: currentParent,
        children: [],
        occurrence: getOccurrenceKey(path.slice(0, currentLevel + 1)),
      };

      if (currentParent) {
        currentParent.children.push(newParent);
      } else {
        roots.push(newParent);
      }

      if (!config.considerAdjacency) {
        pathToParentMap.set(path.slice(0, currentLevel + 1).join("/"), newParent);
      }

      return newParent;
    }

    // For root level in adjacency mode
    if (config.considerAdjacency && !currentParent) {
      const lastRoot = roots[roots.length - 1] as PathTreeParentNode | undefined;
      if (lastRoot?.type === "parent" && lastRoot.path[currentLevel] === path[currentLevel]) {
        return findOrCreateParent(path, currentLevel + 1, lastRoot);
      }
    } else if (config.considerAdjacency && currentParent) {
      // Check for adjacent paths at current level
      if (isAdjacentPath(currentParent, path[currentLevel], currentLevel)) {
        const lastChild = currentParent.children[
          currentParent.children.length - 1
        ] as PathTreeParentNode;
        return findOrCreateParent(path, currentLevel + 1, lastChild);
      }
    } else if (!config.considerAdjacency) {
      // In non-adjacency mode, use the path map
      const pathKey = path.slice(0, currentLevel + 1).join("/");
      const existingParent = pathToParentMap.get(pathKey);
      if (existingParent) {
        return findOrCreateParent(path, currentLevel + 1, existingParent);
      }
    }

    const newParent: PathTreeParentNode = {
      type: "parent",
      path: path.slice(0, currentLevel + 1),
      parent: currentParent,
      children: [],
      occurrence: getOccurrenceKey(path.slice(0, currentLevel + 1)),
    };

    if (currentParent) {
      currentParent.children.push(newParent);
    } else {
      roots.push(newParent);
    }

    if (!config.considerAdjacency) {
      pathToParentMap.set(path.slice(0, currentLevel + 1).join("/"), newParent);
    }

    return findOrCreateParent(path, currentLevel + 1, newParent);
  }

  // Process each item
  for (const item of items) {
    const { path, data } = item;

    // Handle root level items (empty path)
    if (path.length === 0) {
      const leafNode: PathTreeLeafNode<T> = {
        type: "leaf",
        path: [],
        parent: null,
        data,
      };
      roots.push(leafNode);
      continue;
    }

    // For non-empty paths, find or create the parent chain
    const parentNode = findOrCreateParent(path, 0, null);

    // Create and add the leaf node
    const leafNode: PathTreeLeafNode<T> = {
      type: "leaf",
      path,
      parent: parentNode,
      data,
    };

    parentNode.children.push(leafNode);
  }

  return roots;
}
