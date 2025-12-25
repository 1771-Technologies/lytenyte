import type { ServerRowSelection } from "../types";

export function isSelected(id: string, s: ServerRowSelection) {
  if (s.kind === "all") return !s.exceptions.has(id);
  if (s.kind === "isolated") return s.selected.has(id);
  if (s.kind === "leafs") return s.selected.has(id);

  return false;
}
