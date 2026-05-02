import type {
  RowSelectionLinked,
  RowSelectionLinkedWithParent,
  RowSelectNode,
  RowSelectNodeWithParent,
} from "../types";

export function rowSelectLinkWithoutParents(state: RowSelectionLinkedWithParent): RowSelectionLinked {
  const removeParents = (
    parent: RowSelectionLinked | RowSelectNode,
    node: RowSelectNodeWithParent,
    key: string,
  ) => {
    const nodeWithoutParent = { ...node } as RowSelectNode;
    delete (nodeWithoutParent as any).parent;

    parent.children?.set(key, nodeWithoutParent);

    if (node.children) {
      nodeWithoutParent.children = new Map();
      node.children.forEach((x, k) => removeParents(nodeWithoutParent, x, k));
    }
  };
  const root: RowSelectionLinked = { ...state, children: new Map() };
  state.children.forEach((x, k) => removeParents(root, x, k));

  return root;
}
