import type { RowGroup } from "@1771technologies/lytenyte-shared";

export type TreeRoot = {
  readonly kind: "root";
  readonly children: Map<string, TreeParent>;
  readonly rowIdToNode: Map<string, TreeParent>;
  readonly data: object;
};

export type TreeParent = {
  readonly kind: "parent";
  readonly row: RowGroup;
  readonly children: Map<string, TreeParent>;

  readonly path: string[];
  readonly parent: TreeParent | TreeRoot;
  readonly data: object;
  readonly key: string;
};
