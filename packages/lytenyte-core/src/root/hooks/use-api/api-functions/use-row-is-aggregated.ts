import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowIsAggregated(): Root.API["rowIsAggregated"] {
  return useEvent((row) => {
    return row.kind === "aggregated";
  });
}
