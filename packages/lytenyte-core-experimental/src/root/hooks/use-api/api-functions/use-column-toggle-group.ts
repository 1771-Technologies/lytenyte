import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import type { Controlled } from "../../use-controlled-grid-state.js";

export const useColumnToggleGroup = (
  props: Root.Props,
  controlled: Controlled,
): Root.API["columnToggleGroup"] => {
  return useEvent((group, state) => {
    const delimiter = props.columnGroupJoinDelimiter ?? "/";

    const id = typeof group === "string" ? group : group.join(delimiter);

    const currentExpansions = controlled.columnGroupExpansions;
    const currentState = currentExpansions[id] ?? props.columnGroupDefaultExpansion ?? true;
    const next = state ?? !currentState;

    controlled.onColumnGroupExpansionChange({ ...currentExpansions, [id]: next });
  });
};
