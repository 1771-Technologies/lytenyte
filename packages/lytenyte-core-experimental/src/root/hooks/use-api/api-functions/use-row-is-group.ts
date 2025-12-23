import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowIsGroup(): Root.API["rowIsGroup"] {
  return useEvent((row) => {
    return row.kind === "branch";
  });
}
