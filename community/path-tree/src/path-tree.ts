export interface PathTreeBaseNode {
  path: string[];
  parent: PathTreeParentNode | null;
}

export interface PathTreeLeafNode<T> extends PathTreeBaseNode {
  type: "leaf";
  data: T;
}

export interface PathTreeParentNode extends PathTreeBaseNode {
  type: "parent";
  children: (PathTreeLeafNode<any> | PathTreeParentNode)[];
  occurrence: string;
}

export type PathTreeNode<T> = PathTreeLeafNode<T> | PathTreeParentNode;

export interface PathTreeInputItem<T> {
  path: string[];
  data: T;
}

export interface PathTreeConfig {
  considerAdjacency: boolean;
}

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
