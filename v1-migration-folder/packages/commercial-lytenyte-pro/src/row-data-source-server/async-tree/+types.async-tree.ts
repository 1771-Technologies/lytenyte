/**
 * The root of the async tree. This is the entry point of the tree.
 */
export type TreeRoot<K, D> = {
  readonly kind: "root";
  readonly byPath: Map<string | null, LeafOrParent<K, D>>;
  readonly byIndex: Map<number, LeafOrParent<K, D>>;
  readonly size: number;
};

export type TreeParent<K, D> = {
  readonly kind: "parent";
  readonly relIndex: number;
  readonly data: K;

  readonly byPath: Map<string | null, LeafOrParent<K, D>>;
  readonly byIndex: Map<number, LeafOrParent<K, D>>;

  readonly size: number;

  readonly path: string | null;
  readonly parent: TreeParent<K, D> | TreeRoot<K, D>;
};

export type TreeLeaf<K, D> = {
  readonly kind: "leaf";
  readonly relIndex: number;
  readonly data: D;

  readonly parent: TreeParent<K, D> | TreeRoot<K, D>;
  readonly path: string;
};

export type LeafOrParent<K, D> = TreeLeaf<K, D> | TreeParent<K, D>;

export type TreeRootAndApi<K, D> = TreeRoot<K, D> & {
  readonly set: (payload: SetDataAction<K, D>) => void;
  readonly delete: (path: DeleteDataAction) => void;
  readonly get: (payload: GetDataAction) => TreeRoot<K, D> | TreeParent<K, D> | null;
};

export interface SetDataAction<K = any, D = any> {
  readonly path: (string | null)[];
  readonly size?: number;
  readonly items?: (
    | { kind: "parent"; path: string | null; data: K; relIndex: number; size: number }
    | { kind: "leaf"; data: D; relIndex: number }
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
