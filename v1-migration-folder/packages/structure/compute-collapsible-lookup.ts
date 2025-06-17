import type { Item } from "./+types";

export function computeCollapsibleLookup(visible: Item[], groupDelimiter: string) {
  const collapsible: Record<string, { close: boolean; open: boolean }> = {};
  for (let i = 0; i < visible.length; i++) {
    const c = visible[i];
    if (!c.groupPath?.length) continue;

    let id = "";
    for (let j = 0; j < c.groupPath.length; j++) {
      id += c.groupPath[j];
      collapsible[id] ??= { open: false, close: false };

      const groupVis = visible[i].groupVisibility ?? "open";
      if (groupVis === "open") collapsible[id].close = true;
      if (groupVis !== "open") collapsible[id].open = true;

      id += groupDelimiter;
    }
  }

  return collapsible;
}
