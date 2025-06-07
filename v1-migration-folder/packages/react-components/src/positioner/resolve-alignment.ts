import type { Alignment } from "@1771technologies/lytenyte-floating";

export function resolveAlignment(align: Alignment | "center") {
  if (align === "center") return "";

  return `-${align}`;
}
