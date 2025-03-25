import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { PathTreeParentNode } from "@1771technologies/path-tree";

export function allLeafs(c: PathTreeParentNode<ColumnEnterpriseReact<any>>) {
  const leafs: ColumnEnterpriseReact<any>[] = [];

  const stack = [...c.children];

  while (stack.length) {
    const item = stack.pop()!;
    if (item.type === "leaf") {
      leafs.push(item.data);
    } else {
      stack.push(...item.children);
    }
  }

  return leafs;
}
