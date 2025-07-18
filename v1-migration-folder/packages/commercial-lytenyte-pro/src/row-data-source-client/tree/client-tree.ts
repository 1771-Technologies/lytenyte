import { BRANCH, LEAF } from "../+constants.js";
import type {
  AggregationItem,
  BranchNode,
  GroupItem,
  LeafNode,
  Root,
  TreeNode,
} from "../+types.js";
import { traverse } from "./traverse.js";
import { aggregationEvaluator } from "./evaluator-aggregation.js";
import { groupEvaluator } from "./evaluator-group.js";

export interface ClientData<Data> {
  readonly root: Root<Data>;
  readonly rowData: Data[];
  readonly idsLeaf: Set<string>;
  readonly idsBranch: Set<string>;
  readonly idsAll: Set<string>;
  readonly idToNode: Map<string, TreeNode<Data>>;
}

export interface MakeClientDataArgs<Data> {
  readonly rowData: Data[];
  readonly rowBranchModel: GroupItem<Data>[];
  readonly rowAggModel: AggregationItem<Data>[];
  readonly rowIdLeaf?: (d: Data, i: number) => string;
  readonly rowIdGroup?: (path: string[]) => string;
}

export function makeClientTree<Data>({
  rowData,
  rowBranchModel,
  rowAggModel,
  rowIdLeaf,
  rowIdGroup,
}: MakeClientDataArgs<Data>): ClientData<Data> {
  const root: Root<Data> = new Map();

  const idsLeaf = new Set<string>();
  const idsBranch = new Set<string>();
  const idsAll = new Set<string>();
  const idToNode = new Map<string, TreeNode<Data>>();

  for (let i = 0; i < rowData.length; i++) {
    const d = rowData[i];
    const id = rowIdLeaf?.(d, i) ?? `${i}`;
    const path = groupEvaluator(rowBranchModel, d);

    idsLeaf.add(id);
    idsAll.add(id);

    let current: typeof root | BranchNode<Data> = root;
    const runningPath = [];
    for (let i = 0; i < path.length; i++) {
      const pathKey = path[i] ?? `<__null__>`;
      runningPath.push(pathKey);

      const lookup = i === 0 ? root : (current as BranchNode<Data>).children;

      // We need to create a branch node.
      if (!lookup.has(pathKey)) {
        const id = rowIdGroup?.(runningPath) ?? "+.+" + runningPath.join("/");
        idsBranch.add(id);
        idsAll.add(id);

        const branch: BranchNode<Data> = {
          id,
          kind: BRANCH,
          depth: i,
          children: new Map(),
          data: {},
          parent: current === root ? null : (current as unknown as BranchNode<Data>),
          key: pathKey,
          leafIds: new Set(),
          leafData: [],
        };
        lookup.set(pathKey, branch);
        idToNode.set(id, branch);
      }

      const branch = lookup.get(pathKey)! as BranchNode<Data>;
      branch.leafData.push(d);
      branch.leafIds.add(id);

      current = branch;
    }

    const leaf: LeafNode<Data> = {
      kind: LEAF,
      id,
      depth: path.length,
      data: d,
      parent: current === root ? null : (current as unknown as BranchNode<Data>),
    };
    idToNode.set(id, leaf);

    if (rowBranchModel.length === 0) (current as Root<Data>).set(id, leaf);
    else (current as BranchNode<Data>).children.set(id, leaf);
  }

  traverse(root, (node) => {
    if (node.kind === LEAF) return;
    (node as { data: any }).data = aggregationEvaluator(rowAggModel, node.leafData);
  });

  return {
    root,
    rowData,
    idsLeaf: idsLeaf,
    idsBranch: idsBranch,
    idsAll: idsAll,
    idToNode,
  };
}
