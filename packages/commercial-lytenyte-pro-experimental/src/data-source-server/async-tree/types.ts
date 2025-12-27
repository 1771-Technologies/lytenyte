import type { RowGroup, RowLeaf } from "@1771technologies/lytenyte-shared";

/**
 * The root of the async tree. This is the entry point of the tree.
 */
export type TreeRoot = {
  readonly kind: "root";
  readonly byPath: Map<string | null, LeafOrParent>;
  readonly byIndex: Map<number, LeafOrParent>;
  readonly size: number;
  readonly asOf: number;
  readonly rowIdToNode: Map<string, LeafOrParent>;

  before: TreeLeaf[];
  after: TreeLeaf[];
};

export type TreeParent = {
  readonly kind: "parent";
  readonly relIndex: number;
  readonly row: RowGroup;
  readonly asOf: number;

  readonly byPath: Map<string | null, LeafOrParent>;
  readonly byIndex: Map<number, LeafOrParent>;

  readonly size: number;

  readonly path: string | null;
  readonly parent: TreeParent | TreeRoot;

  readonly deleted?: boolean;
};

export type TreeLeaf = {
  readonly kind: "leaf";
  readonly relIndex: number;
  readonly row: RowLeaf;
  readonly asOf: number;

  readonly parent: TreeParent | TreeRoot;
  readonly path: string;

  readonly deleted?: boolean;
  readonly optimistic?: "start" | "end";
};

export type LeafOrParent = TreeLeaf | TreeParent;

export type TreeRootAndApi = TreeRoot & {
  readonly set: (payload: SetDataAction) => void;
  readonly delete: (path: DeleteDataAction) => void;
  readonly get: (payload: GetDataAction) => TreeRoot | TreeParent | null;
  readonly addBefore: (leafs: TreeLeaf[]) => void;
  readonly addAfter: (leafs: TreeLeaf[]) => void;
  readonly deleteBefore: (ids: string[]) => void;
  readonly deleteAfter: (ids: string[]) => void;
};

export interface SetDataAction {
  readonly path: (string | null)[];
  readonly asOf?: number;
  readonly size?: number;
  readonly items?: (
    | { kind: "parent"; path: string | null; row: RowGroup; relIndex: number; size: number }
    | { kind: "leaf"; row: RowLeaf; relIndex: number }
  )[];
}

export interface DeleteDataAction {
  readonly path: (string | null)[];
  readonly paths?: string[];
  readonly relIndices?: number[];
}

export interface GetDataAction {
  readonly path: (string | null)[];
}
