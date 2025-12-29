import type { ColumnGroupMeta, ColumnGroupVisibility } from "../+types.js";

export interface PartialColumns {
  readonly id: string;
  readonly groupPath?: string[];
  readonly groupVisibility?: ColumnGroupVisibility;
}

export function makeColumnGroupMetadata<T extends PartialColumns>(
  columns: T[],
  pathDelimiter: string,
): ColumnGroupMeta {
  const colIdToGroupIds = new Map<string, string[]>();
  const lookup: Record<string, { open: boolean; close: boolean }> = {};
  const validGroupIds = new Set<string>();

  for (let i = 0; i < columns.length; i++) {
    const c = columns[i];

    if (!c.groupPath?.length) continue;

    const columnGroupIds: string[] = [];

    let id = "";
    for (let j = 0; j < c.groupPath.length; j++) {
      id += c.groupPath[j];

      validGroupIds.add(id);
      columnGroupIds.push(id);
      lookup[id] ??= { open: false, close: false };

      const groupVis = c.groupVisibility ?? "open";
      if (groupVis === "open") lookup[id].close = true;
      else lookup[id].open = true;

      id += pathDelimiter;
    }

    colIdToGroupIds.set(c.id, columnGroupIds);
  }

  const groupIsCollapsible = new Map(Object.entries(lookup).map((c) => [c[0], c[1].open && c[1].close]));

  return {
    colIdToGroupIds,
    groupIsCollapsible,
    validGroupIds,
  };
}
