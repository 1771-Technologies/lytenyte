import type { Item } from "./+types";

export function splitByPinState(columns: Item[]) {
  const start: Item[] = [];
  const center: Item[] = [];
  const end: Item[] = [];

  for (let i = 0; i < columns.length; i++) {
    const c = columns[i];
    if (c.pin === "start") start.push(c);
    else if (c.pin === "end") end.push(c);
    else center.push(c);
  }

  return { start, center, end };
}
