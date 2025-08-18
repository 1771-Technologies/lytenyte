import type { PathBranch, PathLeaf, PathProvidedItem } from "@1771technologies/lytenyte-shared";
import type { CSSProperties } from "react";

export interface TreeVirtualBranch<T extends PathProvidedItem> {
  readonly kind: "branch";
  readonly path: string;
  readonly branch: PathBranch<T>;
  readonly children: TreeVirtualItem<T>[];
  readonly rowIndex: number;
  readonly attrs: {
    readonly style: CSSProperties;
    "data-ln-row-index": number;
    readonly "aria-posinset": number;
    readonly "aria-setsize": number;
  };
}
export interface TreeVirtualLeaf<T extends PathProvidedItem> {
  readonly kind: "leaf";
  readonly leaf: PathLeaf<T>;
  readonly rowIndex: number;

  readonly attrs: {
    readonly style: CSSProperties;
    "data-ln-row-index": number;
    readonly "aria-posinset": number;
    readonly "aria-setsize": number;
  };
}
export type TreeVirtualItem<T extends PathProvidedItem> = TreeVirtualBranch<T> | TreeVirtualLeaf<T>;

type Path = string[];
type PathEntry<T extends PathProvidedItem> = [Path | "", PathBranch<T> | PathLeaf<T>];

export function makeVirtualTree<T extends PathProvidedItem>(
  paths: PathEntry<T>[],
  nodeToIndex: Map<PathBranch<T> | PathLeaf<T>, number>,
  itemHeight: number,
  nonAdjacentPathTrees: boolean,
): TreeVirtualItem<T>[] {
  const root: TreeVirtualItem<T>[] = [];
  const lookup = new Map<string, TreeVirtualBranch<T>>();

  for (const [rawPath, node] of paths) {
    const path = typeof rawPath === "string" ? [] : rawPath;
    if (nonAdjacentPathTrees) path.pop();
    const joinPath = path.join("#");

    if (node.kind === "branch") {
      const rowIndex = nodeToIndex.get(node)!;
      const parentIndex = node.parent.kind === "root" ? 0 : nodeToIndex.get(node.parent)!;

      const posinset = rowIndex - parentIndex + 1;
      const setSize = node.parent.children.size;

      const branchNode: TreeVirtualBranch<T> = {
        kind: "branch",
        path: joinPath,
        branch: node,
        children: [],
        rowIndex,
        attrs: {
          style: {
            position: "absolute",
            height: itemHeight,
            width: "100%",
            boxSizing: "border-box",
            top: 0,
            left: 0,
            transform: `translate3d(0px, ${(posinset - 1) * itemHeight}px, 0px)`,
          },
          "data-ln-row-index": rowIndex,
          "aria-posinset": posinset,
          "aria-setsize": setSize,
        },
      };

      lookup.set(joinPath, branchNode);

      if (path.length === 0) {
        root.push(branchNode);
      } else {
        const parentPath = path.slice(0, -1).join("#");
        const parent = lookup.get(parentPath);
        if (parent) {
          parent.children.push(branchNode);
        } else {
          root.push(branchNode); // fallback
        }
      }
    } else {
      const rowIndex = nodeToIndex.get(node)!;
      const parentIndex = node.parent.kind === "root" ? 0 : nodeToIndex.get(node.parent)!;

      const posinset = rowIndex - parentIndex + 1;
      const setSize = node.parent.children.size;

      const leafNode: TreeVirtualLeaf<T> = {
        kind: "leaf",
        leaf: node,
        rowIndex,
        attrs: {
          style: {
            position: "absolute",
            height: itemHeight,
            boxSizing: "border-box",
            width: "100%",
            top: 0,
            left: 0,
            transform: `translate3d(0px, ${(posinset - 1) * itemHeight}px, 0px)`,
          },
          "data-ln-row-index": rowIndex,
          "aria-posinset": posinset,
          "aria-setsize": setSize,
        },
      };

      if (path.length === 0) {
        root.push(leafNode); // top-level leaf
      } else {
        const parentPath = path.join("#");
        const parent = lookup.get(parentPath);
        if (parent) {
          parent.children.push(leafNode);
        } else {
          root.push(leafNode); // fallback
        }
      }
    }
  }

  return root;
}
