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
    key: string,
  ) => {
    const nodeWithParent = { ...node, parent } as RowSelectNodeWithParent;
    parent.children?.set(key, nodeWithParent);

    if (node.children) {
      nodeWithParent.children = new Map();
      node.children.forEach((x, k) => makeWithParents(nodeWithParent, x, k));
    }
  };

  const root: RowSelectionLinkedWithParent = { ...state, children: new Map() };
  state.children.forEach((x, k) => makeWithParents(root, x, k));

  return root;
}
