import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import type { Controlled } from "../../use-controlled-grid-state.js";

export function useRowDetailHeight(
  props: Root.Props,
  controlled: Controlled,
  detailHeightCache: Record<string, number>,
): Root.API["rowDetailHeight"] {
  return useEvent((rowOrId) => {
    const id = typeof rowOrId === "string" ? rowOrId : rowOrId.id;

    if (!controlled.detailExpansions.has(id)) return 0;
    if (props.rowDetailHeight === "auto")
      return detailHeightCache[id] ?? props.rowDetailAutoHeightGuess ?? 200;
    return props.rowDetailHeight ?? 200;
  });
}
