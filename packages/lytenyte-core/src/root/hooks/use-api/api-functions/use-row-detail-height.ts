import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowDetailHeight(
  rowDetailHeight: "auto" | number | undefined,
  rowDetailAutoHeightGuess: number | undefined,
  detailExpansions: Set<string>,
  detailHeightCache: Record<string, number>,
): Root.API["rowDetailHeight"] {
  return useEvent((rowOrId) => {
    const id = typeof rowOrId === "string" ? rowOrId : rowOrId.id;

    if (!detailExpansions.has(id)) return 0;
    if (rowDetailHeight === "auto") return detailHeightCache[id] ?? rowDetailAutoHeightGuess ?? 200;
    return rowDetailHeight ?? 200;
  });
}
