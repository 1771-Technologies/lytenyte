import type { RowGroup, RowLeaf } from "@1771technologies/lytenyte-shared";

export type TreeRoot = {
  readonly kind: "root";
  readonly children: Map<string, LeafOrParent>;
  readonly rowIdToNode: Map<string, LeafOrParent>;
};

export type TreeParent = {
  readonly kind: "parent";
  readonly row: RowGroup;
  readonly children: Map<string, LeafOrParent>;

  readonly path: string[];
  readonly parent: TreeParent | TreeRoot;
};

export type TreeLeaf = {
  readonly kind: "leaf";
  readonly row: RowLeaf;
  readonly parent: TreeParent | TreeRoot;
  readonly path: string[];
};

export type LeafOrParent = TreeLeaf | TreeParent;
