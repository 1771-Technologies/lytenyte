import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowIsLeaf(): Root.API["rowIsLeaf"] {
  return useEvent((row) => {
    return row.kind === "leaf";
  });
}
