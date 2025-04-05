import type { RowNode } from "@1771technologies/grid-types/core";

export function makeRowNodes(s: [number, string][]) {
  return s.map((c) => {
    return { kind: c[0], pathKey: c[1] } as RowNode;
  });
}
