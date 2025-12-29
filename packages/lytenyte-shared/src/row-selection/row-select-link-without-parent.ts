import type {
  RowSelectionLinked,
  RowSelectionLinkedWithParent,
  RowSelectNode,
  RowSelectNodeWithParent,
} from "../types";

export function rowSelectLinkWithoutParents(state: RowSelectionLinkedWithParent): RowSelectionLinked {
  const removeParents = (parent: RowSelectionLinked | RowSelectNode, node: RowSelectNodeWithParent) => {
    const nodeWithoutParent = { ...node } as RowSelectNode;
    delete (nodeWithoutParent as any).parent;

    parent.children?.set(node.id, nodeWithoutParent);

    // It has some children to traverse.
    if (node.children) {
      nodeWithoutParent.children = new Map();
      node.children.forEach((x) => removeParents(nodeWithoutParent, x));
    }
  };
  const root: RowSelectionLinked = { ...state, children: new Map() };
  state.children.forEach((x) => removeParents(root, x));

  return root;
}
