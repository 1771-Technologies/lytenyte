export interface GroupItem<Data> {
  readonly fn: (d: Data) => string | null | undefined;
}

export interface AggregationItem<Data> {
  readonly fn: (d: Data[]) => unknown;
  readonly name: string;
}

export interface LeafNode<Data> {
  readonly kind: 1;
  readonly id: string;
  readonly data: Data;
  readonly depth: number;
  readonly parent: BranchNode<Data> | null;
}

export interface BranchNode<Data> {
  readonly kind: 2;
  readonly depth: number;
  readonly id: string;
  readonly key: string;
  readonly children: Map<string | null, TreeNode<Data>>;
  readonly data: Record<string, unknown>;
  readonly parent: BranchNode<Data> | null;

  readonly leafIds: Set<string>;
  readonly leafData: Data[];
}

export type TreeNode<Data> = LeafNode<Data> | BranchNode<Data>;
export type Root<Data> = Map<string | null, TreeNode<Data>>;
