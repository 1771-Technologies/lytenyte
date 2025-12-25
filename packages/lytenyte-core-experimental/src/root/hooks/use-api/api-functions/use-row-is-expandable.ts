import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowIsExpandable(): Root.API["rowIsExpandable"] {
  return useEvent((row) => {
    return row.kind === "branch" && row.expandable;
  });
}
