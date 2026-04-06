import type { CompletionItem } from "../types.js";

export function filterCompletionsByPrefix(items: CompletionItem[], prefix: string): CompletionItem[] {
  if (!prefix) return items;

  const lower = prefix.toLowerCase();
  return items.filter((item) => item.label.toLowerCase().startsWith(lower));
}
