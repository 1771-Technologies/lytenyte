import type { GroupItem } from "../+types";

export function groupEvaluator<Data>(
  g: GroupItem<Data>[] | ((d: Data) => (string | null | undefined)[]),
  d: Data,
) {
  if (typeof g === "function") return g(d);

  const v: (string | null | undefined)[] = [];
  for (let i = 0; i < g.length; i++) {
    v.push(g[i].fn(d));
  }

  return v;
}
