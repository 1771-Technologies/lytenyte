export interface PathItem {
  side?: "start" | "center" | "end";
  path: string[];
  id: string;
}

export interface TreeLeaf {
  readonly kind: "leaf";
  readonly id: string;
  readonly data: PathItem;
}

export interface TreeBranch {
  readonly kind: "branch";
  readonly id: string;
  readonly key: string;
  readonly depth: number;
  readonly children: (TreeBranch | TreeLeaf)[];
}

export type TreeNode = TreeLeaf | TreeBranch;

export function buildForest(items: PathItem[]): TreeNode[] {
  function buildLevel(items: PathItem[], depth: number): TreeNode[] {
    const result: TreeNode[] = [];
    let i = 0;

    while (i < items.length) {
      const item = items[i];

      if (depth >= item.path.length) {
        // Path fully consumed — this item is a leaf
        result.push({ kind: "leaf", id: item.id, data: item });
        i++;
      } else {
        // Group adjacent items sharing the same key at this depth
        const key = item.path[depth];
        const group: PathItem[] = [];

        while (i < items.length && items[i].path.length > depth && items[i].path[depth] === key) {
          group.push(items[i]);
          i++;
        }

        const children = buildLevel(group, depth + 1);

        result.push({
          kind: "branch",
          id: item.path.slice(0, depth + 1).join("/"),
          key,
          depth,
          children,
        });
      }
    }

    return result;
  }

  return buildLevel(items, 0);
}

const items: PathItem[] = [
  { id: "A", path: ["A", "B"] },
  { id: "X", path: ["A", "B", "X"] },
  { id: "Y", path: ["A"] },
  { id: "X", path: ["A", "B"] },
  { id: "C", path: ["B"] },
  { id: "X", path: ["X"] },
];

console.log(buildForest(items));
