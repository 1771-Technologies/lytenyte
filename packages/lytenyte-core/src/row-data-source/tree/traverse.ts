import { LEAF } from "../+constants";
import type { BranchNode, Root, TreeNode } from "../+types";

export function traverse<Data>(
  root: Root<Data> | BranchNode<Data>,
  fn: (node: TreeNode<Data>, lookupKey: string | null) => boolean | void,
  comparator?: (l: TreeNode<Data>, r: TreeNode<Data>) => number,
) {
  const entries = root instanceof Map ? root.entries() : root.children.entries();
  const stack = [...entries];
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
