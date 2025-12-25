import { ROOT_LEAF_PREFIX } from "../+constants.async-tree.js";
import type { LeafOrParent, TreeRoot } from "../+types.async-tree.js";

export function printTreeByIndex<K, D>(tree: TreeRoot<K, D>) {
  const root = ["#"];
  const stack = [...tree.byIndex.entries()]
    .map((v) => {
      return [0, ...v] as [number, number, LeafOrParent<K, D>];
    })
    .sort((l, r) => l[1] - r[1]);

  while (stack.length) {
    const [depth, index, node] = stack.shift()!;

    const ident = "   ".repeat(depth);
    const row: string[] = [];

    if (node.kind === "parent") {
      row.push(`${index === node.relIndex ? index : "E"}`);
      row.push(`${node.kind === "parent" ? "P" : "E"}`);
      row.push(`${node.path}`);
      row.push(`${node.parent.kind === "parent" ? node.parent.relIndex : "$"}`);
      row.push(`SIZE: ${node.size}`);
      row.push(`DATA: ${node.data}`);

      const children = [...node.byIndex.entries()]
        .map((v) => {
          return [depth + 1, ...v] as [number, number, LeafOrParent<K, D>];
        })
        .sort((l, r) => l[1] - r[1]);
      stack.unshift(...children);
    } else {
      row.push(`${index === node.relIndex ? index : "E"}`);
      row.push(`${node.kind === "leaf" ? "L" : "E"}`);
      row.push(`${node.path.replace(ROOT_LEAF_PREFIX, "$")}`);
      row.push(`${node.parent.kind === "parent" ? node.parent.relIndex : "$"}`);
      row.push(`DATA: ${JSON.stringify(node.data)}`);
    }

    root.push(ident + "├─ " + row.join(" / "));
  }

  return "\n" + root.join("\n");
}
