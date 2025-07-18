import { LEAF } from "../../+constants";
import type { Root } from "../../+types";
import { traverse } from "../traverse";

export function printTree(root: Root<any>) {
  const rows: string[] = [];

  traverse(root, (node) => {
    const row: string[] = [];
    const jsonData = JSON.stringify(node.data);
    if (node.kind === LEAF) {
      const depth = node.depth ? "  ".repeat(node.depth) : "";
      row.push(depth);
      row.push("├──");
      row.push(` ${node.id} |LEAF| P:${node.parent?.id ?? "root"} |${node.depth} | `);
      row.push(jsonData.length > 12 ? jsonData.slice(0, 12) + "..." : jsonData);
      rows.push(row.join(""));
      return;
    }

    const depth = node.depth ? "  ".repeat(node.depth) : "";
    row.push(depth);
    row.push("├──");
    row.push(` ${node.id} |BRANCH| P:${node.parent?.id ?? "root"} | ${node.depth} | `);
    row.push(jsonData.length > 12 ? jsonData.slice(0, 12) + "..." : jsonData);
    rows.push(row.join(""));
  });

  return "\n" + rows.join("\n");
}
