import type { ColumnProReact } from "@1771technologies/grid-types/pro-react";
import type { PathTreeParentNode } from "@1771technologies/path-tree";

export function allLeafs(c: PathTreeParentNode<ColumnProReact<any>>) {
  const leafs: ColumnProReact<any>[] = [];

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
