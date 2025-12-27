import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root";

export function useProps(props: Root.Props): Root.API["props"] {
  return useEvent(() => props);
}
