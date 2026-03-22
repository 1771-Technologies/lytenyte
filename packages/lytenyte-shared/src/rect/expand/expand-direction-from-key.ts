export function expandDirectionFromKey(key: string, rtl: boolean): "up" | "down" | "start" | "end" | null {
  if (key === "ArrowUp") return "up";
  if (key === "ArrowDown") return "down";
  if (key === (rtl ? "ArrowRight" : "ArrowLeft")) return "start";
  if (key === (rtl ? "ArrowLeft" : "ArrowRight")) return "end";

  return null;
}
