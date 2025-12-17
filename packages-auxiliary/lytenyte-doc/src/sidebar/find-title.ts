import type { Root } from "./types";

export function findTitle(r: Root, id: string): string {
  const stack = [...r.children];

  while (stack.length) {
    const item = stack.shift()!;
    if (item.kind === "page-link") {
      if (item.id === id) return item.title;
    }
    if (item.kind === "group") {
      stack.unshift(...item.children);
    }
  }

  return "";
}
