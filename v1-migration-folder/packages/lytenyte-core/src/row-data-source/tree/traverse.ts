import { LEAF } from "../+constants";
import type { Root, TreeNode } from "../+types";

export function traverse<Data>(
  root: Root<Data>,
  fn: (node: TreeNode<Data>, lookupKey: string | null) => boolean | void,
  comparator?: (l: TreeNode<Data>, r: TreeNode<Data>) => number,
) {
  const stack = [...root.entries()];
  if (comparator) stack.sort((l, r) => comparator(l[1], r[1]));

  while (stack.length) {
    const [key, node] = stack.shift()!;
    if (node.kind === LEAF) {
      fn(node, key);
    } else {
      const continueWith = fn(node, key) ?? true;

      if (continueWith) {
        const children = [...node.children];
        if (comparator) children.sort((l, r) => comparator(l[1], r[1]));
        stack.unshift(...children);
      }
    }
  }
}
