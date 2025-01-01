import type { BlockGraph } from "../block-graph.js";

export function printGraph<D>(c: BlockGraph<D>) {
  const rowCount = c.rowCount();

  const result: string[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row = c.rowByIndex(i);
    if (!row) continue;
    result.push(`${i}: ${row.id}`);
  }

  return "\n" + result.join("\n") + "\n";
}
