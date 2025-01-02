/**
 * Base node interface for the path tree structure.
 */
export interface PathTreeBaseNode<T> {
  /** Array of path segments representing the node's location in the tree */
  path: string[];
  /** Reference to the parent node, null for root nodes */
  parent: PathTreeParentNode<T> | null;
}

/**
 * Represents a leaf node in the path tree that contains data.
 * @template T The type of data stored in the leaf node
 */
export interface PathTreeLeafNode<T> extends PathTreeBaseNode<T> {
  /** Discriminator to identify leaf nodes */
  type: "leaf";
  /** The data stored in the leaf node */
  data: T;
}

/**
 * Represents a parent node in the path tree that can contain children.
 */
export interface PathTreeParentNode<T> extends PathTreeBaseNode<T> {
  /** Discriminator to identify parent nodes */
  type: "parent";
  /** Array of child nodes, which can be either leaves or other parent nodes */
  children: (PathTreeLeafNode<T> | PathTreeParentNode<T>)[];
  /** Unique identifier for the node based on its path and occurrence count */
  occurrence: string;
}

/**
 * Union type representing either a leaf or parent node in the path tree.
 * @template T The type of data stored in leaf nodes
 */
export type PathTreeNode<T> = PathTreeLeafNode<T> | PathTreeParentNode<T>;

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
  considerAdjacency?: boolean;
  /**
   * Custom separator to use when generating occurrence keys and path references.
   * Defaults to "/" if not specified.
   */
  pathSeparator?: string;
}

/**
 * Creates a hierarchical tree structure from an array of path-based items.
 * @template T The type of data stored in leaf nodes
 *
 * @param items Array of input items with path and data
 * @param config Configuration object with adjacency setting and optional path separator
 * @returns An array of root nodes
 *
 * @example
 * ```typescript
 * // Using custom separator
 * const items = [
 *   { path: ["folder1", "subA"], data: "X" },
 *   { path: ["folder1", "subB"], data: "Y" }
 * ];
 *
 * // With default separator (/)
 * // Creates: folder1/subA, folder1/subB
 * const defaultTree = createPathTree(items);
 *
 * // With custom separator (.)
 * // Creates: folder1.subA, folder1.subB
 * const customTree = createPathTree(items, {
 *   considerAdjacency: false,
 *   pathSeparator: '.'
 * });
 * ```
 */
export function createPathTree<T>(
  items: PathTreeInputItem<T>[],
  config: PathTreeConfig = {},
): PathTreeNode<T>[] {
  const roots: PathTreeNode<T>[] = [];
  const pathOccurrences = new Map<string, number>();
  const pathToParentMap = new Map<string, PathTreeParentNode<T>>();
  const separator = config.pathSeparator ?? "/";
  const considerAdjacency = config.considerAdjacency ?? false;

  function getOccurrenceKey(path: string[]): string {
    const pathKey = path.join(separator);
    const count = pathOccurrences.get(pathKey) ?? 0;
    pathOccurrences.set(pathKey, count + 1);
    return `${pathKey}#${count}`;
  }

  function isAdjacentPath(
    existingParent: PathTreeParentNode<T>,
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
    currentParent: PathTreeParentNode<T> | null,
  ): PathTreeParentNode<T> {
    // If we're at the last parent level (one before the leaf)
    if (currentLevel === path.length - 1) {
      if (!considerAdjacency) {
        const pathKey = path.slice(0, currentLevel + 1).join(separator);
        const existingParent = pathToParentMap.get(pathKey);
        if (existingParent) {
          return existingParent;
        }
      }

      // For adjacency mode and if we have a current parent
      if (considerAdjacency && currentParent) {
        const lastChild = currentParent.children[currentParent.children.length - 1] as
          | PathTreeParentNode<T>
          | undefined;
        if (
          lastChild?.type === "parent" &&
          isAdjacentPath(currentParent, path[currentLevel], currentLevel)
        ) {
          return lastChild;
        }
      }

      const newParent: PathTreeParentNode<T> = {
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

      if (!considerAdjacency) {
        pathToParentMap.set(path.slice(0, currentLevel + 1).join(separator), newParent);
      }

      return newParent;
    }

    // For root level in adjacency mode
    if (considerAdjacency && !currentParent) {
      const lastRoot = roots[roots.length - 1] as PathTreeParentNode<T> | undefined;
      if (lastRoot?.type === "parent" && lastRoot.path[currentLevel] === path[currentLevel]) {
        return findOrCreateParent(path, currentLevel + 1, lastRoot);
      }
    } else if (considerAdjacency && currentParent) {
      // Check for adjacent paths at current level
      if (isAdjacentPath(currentParent, path[currentLevel], currentLevel)) {
        const lastChild = currentParent.children[
          currentParent.children.length - 1
        ] as PathTreeParentNode<T>;
        return findOrCreateParent(path, currentLevel + 1, lastChild);
      }
    } else if (!considerAdjacency) {
      // In non-adjacency mode, use the path map
      const pathKey = path.slice(0, currentLevel + 1).join(separator);
      const existingParent = pathToParentMap.get(pathKey);
      if (existingParent) {
        return findOrCreateParent(path, currentLevel + 1, existingParent);
      }
    }

    const newParent: PathTreeParentNode<T> = {
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

    if (!considerAdjacency) {
      pathToParentMap.set(path.slice(0, currentLevel + 1).join(separator), newParent);
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
