import type { ColumnAbstract } from "../../types.js";

export interface ColumnPartitions {
  readonly start: ColumnAbstract[];
  readonly center: ColumnAbstract[];
  readonly end: ColumnAbstract[];
}

/**
 * Will partition the columns by their pin state. This creates three sections,
 * start, center, and end.
 *
 * Each section becomes its own column hierarchy and cannot span over a section.
 */
export function partitionColumnsByPinState(visibleColumns: ColumnAbstract[]): ColumnPartitions {
  const start: ColumnAbstract[] = [];
  const center: ColumnAbstract[] = [];
  const end: ColumnAbstract[] = [];

  for (const c of visibleColumns) {
    if (c.pin === "start") start.push(c);
    else if (c.pin === "end") end.push(c);
    else center.push(c);
  }

  return { start, center, end };
}
