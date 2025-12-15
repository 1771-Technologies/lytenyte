import type { Root } from "./types";

export function flattenTree(r: Root): string[] {
  const stack = [...r.children];
  const flat: string[] = [];

  while (stack.length) {
    const item = stack.shift()!;
    if (item.kind === "page-link") {
      flat.push(item.id);
    }
    if (item.kind === "group") {
      stack.unshift(...item.children);
    }
  }

  return flat;
}
