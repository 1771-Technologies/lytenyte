import type { CompletionItem } from "../types.js";

export function filterCompletionsByPrefix<T>(
  items: CompletionItem<T>[],
  prefix: string,
): CompletionItem<T>[] {
  if (!prefix) return items;

  const lower = prefix.toLowerCase();
  return items.filter((item) => item.label.toLowerCase().startsWith(lower));
}
