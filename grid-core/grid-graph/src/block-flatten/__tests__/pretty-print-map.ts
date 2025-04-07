import type { RowNodeCore } from "@1771technologies/grid-types/core";

export function prettyPrintMap(map: Map<string, RowNodeCore<any>> | Map<number, RowNodeCore<any>>) {
  const entries = [...map.entries()].map((c) => {
    return `${c[0]} => ${c[1].id}`;
  });

  return "\n" + entries.join("\n") + "\n";
}
