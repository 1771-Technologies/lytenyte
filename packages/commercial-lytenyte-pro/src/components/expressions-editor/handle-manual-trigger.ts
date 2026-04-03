import type { KeyboardEvent } from "react";

export function isManualTrigger(e: KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (e.ctrlKey || e.metaKey) && e.key === " ";
}
