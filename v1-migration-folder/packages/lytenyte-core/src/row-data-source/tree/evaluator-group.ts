import type { GroupItem } from "../+types";

export function groupEvaluator<Data>(g: GroupItem<Data>[], d: Data) {
  const v: (string | null | undefined)[] = [];
  for (let i = 0; i < g.length; i++) {
    v.push(g[i].fn(d));
  }

  return v;
}
