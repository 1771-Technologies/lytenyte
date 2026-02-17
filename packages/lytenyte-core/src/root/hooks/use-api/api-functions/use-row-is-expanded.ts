import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowIsExpanded(): Root.API["rowIsExpanded"] {
  return useEvent((row) => {
    return row.kind === "branch" && row.expanded;
  });
}
