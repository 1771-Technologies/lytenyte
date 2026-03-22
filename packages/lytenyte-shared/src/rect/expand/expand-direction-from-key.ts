/**
 * Maps an arrow key string to a logical expand direction, accounting for RTL
 * layout. Returns null for any key that does not correspond to an arrow key.
 */
export function expandDirectionFromKey(key: string, rtl: boolean): "up" | "down" | "start" | "end" | null {
  if (key === "ArrowUp") return "up";
  if (key === "ArrowDown") return "down";
  if (key === (rtl ? "ArrowRight" : "ArrowLeft")) return "start";
  if (key === (rtl ? "ArrowLeft" : "ArrowRight")) return "end";

  return null;
}
