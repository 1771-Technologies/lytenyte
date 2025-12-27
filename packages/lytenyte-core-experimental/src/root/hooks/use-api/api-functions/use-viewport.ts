import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root";

export function useViewport(vp: HTMLElement | null): Root.API["viewport"] {
  return useEvent(() => vp);
}
