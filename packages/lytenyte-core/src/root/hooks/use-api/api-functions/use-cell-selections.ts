import type { DataRect } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../internal.js";

export function useCellSelections(cellSelections: DataRect[]) {
  return useEvent(() => cellSelections);
}
