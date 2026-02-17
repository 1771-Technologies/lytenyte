import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowView(rowCount: number, bottomCount: number, topCount: number): Root.API["rowView"] {
  return useEvent(() => {
    return {
      bottomCount,
      topCount,
      rowCount: rowCount,
      centerCount: rowCount - topCount - bottomCount,
    };
  });
}
