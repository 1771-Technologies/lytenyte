import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export const useColumnToggleGroup = (
  columnGroupJoinDelimiter: string | undefined,
  columnGroupDefaultExpansion: boolean | undefined,
  columnGroupExpansions: Record<string, boolean>,
  onColumnGroupExpansionChange: (change: Record<string, boolean>) => void,
): Root.API["columnToggleGroup"] => {
  return useEvent((group, state) => {
    const delimiter = columnGroupJoinDelimiter ?? "/";

    const id = typeof group === "string" ? group : group.join(delimiter);

    const currentExpansions = columnGroupExpansions;
    const currentState = currentExpansions[id] ?? columnGroupDefaultExpansion ?? true;
    const next = state ?? !currentState;

    onColumnGroupExpansionChange({ ...currentExpansions, [id]: next });
  });
};
