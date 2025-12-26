import { useEvent } from "../hooks/use-event.js";
import type { SourceRowSelection } from "./row-selection/use-row-selection.js";

export function useRowSelectionState(s: SourceRowSelection) {
  return useEvent(() => s.rowSelectionsRaw);
}
