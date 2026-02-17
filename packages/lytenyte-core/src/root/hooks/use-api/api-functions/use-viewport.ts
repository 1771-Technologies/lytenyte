import { useRef } from "react";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useViewport(vp: HTMLElement | null): Root.API["viewport"] {
  const vpRef = useRef(vp);
  vpRef.current = vp;

  return useEvent(() => vpRef.current);
}
