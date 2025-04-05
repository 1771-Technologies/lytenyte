import { BLOCK_SIZE } from "@1771technologies/grid-client-data-source-community";
import { ROW_GROUP_KIND } from "@1771technologies/grid-constants";
import type { BlockPayload } from "@1771technologies/grid-graph";
import type { RowNode, RowNodeLeaf } from "@1771technologies/grid-types/core";
import type { PathTreeNode } from "@1771technologies/path-tree";

export function treeToPayload<D>(tree: PathTreeNode<RowNodeLeaf<D>>[], separator: string) {
  const stack = [...tree.map((c) => ["", c, 0] as [string, PathTreeNode<RowNodeLeaf<D>>, number])];

  const paths: Record<string, RowNode<D>[]> = {};
  while (stack.length) {
    const [path, item, depth] = stack.pop()!;

    if (item.type === "leaf") {
      paths[path] ??= [];
      paths[path].push(item.data);
    }

    if (item.type === "parent") {
      paths[path] ??= [];
      paths[path].push({
        kind: ROW_GROUP_KIND,
        data: {},
        id: item.occurrence,
        rowIndex: null,
        pathKey: item.path.at(-1)!,
      });

      stack.unshift(
        ...item.children.map(
          (c) =>
            [item.path.join(separator), c, depth + 1] as [
              string,
              PathTreeNode<RowNodeLeaf<D>>,
              number,
            ],
        ),
      );
    }
  }

  const pathPayloads: {
    sizes: { path: string; size: number }[];
    payloads: BlockPayload<D>[];
  } = {
    sizes: [],
    payloads: [],
  };
  for (const [path, data] of Object.entries(paths)) {
    pathPayloads.sizes.push({ path, size: data.length });

    const blockCnt = Math.ceil(data.length / BLOCK_SIZE);
    for (let i = 0; i < blockCnt; i++) {
      pathPayloads.payloads.push({
        data: data.slice(i * BLOCK_SIZE, i * BLOCK_SIZE + BLOCK_SIZE),
        path,
        index: i,
      });
    }
  }

  return pathPayloads;
}
