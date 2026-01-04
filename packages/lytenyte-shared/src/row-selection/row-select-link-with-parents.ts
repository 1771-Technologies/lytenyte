import type {
  RowSelectionLinkedWithParent,
  RowSelectionState,
  RowSelectNode,
  RowSelectNodeWithParent,
} from "../types";

export function rowSelectLinkWithParents(state: RowSelectionState): RowSelectionLinkedWithParent {
  if (state.kind === "isolated") return { kind: "linked", children: new Map(), selected: false };

  const makeWithParents = (
    parent: RowSelectionLinkedWithParent | RowSelectNodeWithParent,
    node: RowSelectNode,
  ) => {
    const nodeWithParent = { ...node, parent } as RowSelectNodeWithParent;
    parent.children?.set(node.id, nodeWithParent);

    // It has some children to traverse.
    if (node.children) {
      nodeWithParent.children = new Map();
      node.children.forEach((x) => makeWithParents(nodeWithParent, x));
    }
  };

  const root: RowSelectionLinkedWithParent = { ...state, children: new Map() };
  state.children.forEach((x) => makeWithParents(root, x));

  return root;
}
