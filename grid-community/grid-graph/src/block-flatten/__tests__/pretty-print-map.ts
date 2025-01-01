import type { RowNode } from "@1771technologies/grid-types/community";

export function prettyPrintMap(map: Map<string, RowNode> | Map<number, RowNode>) {
  const entries = [...map.entries()].map((c) => {
    return `${c[0]} => ${c[1].id}`;
  });

  return "\n" + entries.join("\n") + "\n";
}
