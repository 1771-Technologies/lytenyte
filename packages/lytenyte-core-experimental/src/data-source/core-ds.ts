/*
Data View

- Sorting (done)
- Filtering (done)
- Grouping (done)
- Aggregations (done)
- Unbalanced Groups (done)

## Advanced

- Full Group Collapsing (Done)
- Last Level Group Collapsing (Done)
- Suppress Leaf Expansion (Done)
- Multi Group (Done)
  - Row Span (Done)

## Auxiliary

- Top Data (Done)
- Bottom Data (Done)
- Range Tree (Done)

## Crud
- Update
- Add
- Delete
- Retrieve (Done)
*/

import type { RowGroup, RowLeaf, RowNode } from "@1771technologies/lytenyte-shared";

interface RootNode<T, K> {
  readonly kind: "root";
  readonly children: RootMap<T, K>;
}

interface LeafNode<T, K> {
  readonly parent: GroupNode<T, K> | RootNode<T, K>;
  readonly kind: "leaf";
  readonly key: string | null | number;
  readonly row: RowLeaf<T>;
}

interface GroupNode<T, K> {
  readonly kind: "branch";
  readonly row: -1;
  readonly last: boolean;
  readonly key: string | null | number;
  readonly children: Map<string | null | number, GroupNode<T, K> | LeafNode<T, K>>;
  readonly path: (string | null)[];
  readonly leafs: number[];
  readonly parent: GroupNode<T, K> | RootNode<T, K>;
}

type RootMap<T, K> = Map<string | null | number, GroupNode<T, K> | LeafNode<T, K>>;

type SortFn<T> = (left: RowNode<T>, right: RowNode<T>) => number;
type FilterFn<T> = (node: RowLeaf<T>) => boolean;
type GroupFn<T> = (node: RowLeaf<T>) => (string | null)[] | null;
type ExpandedFn = (id: string) => boolean;
type AggregationFn<T, K> = (data: RowLeaf<T>[]) => K;
type CollapseBehavior = "no-collapse" | "last-only" | "full-tree";
type LeafIdFn<T> = (d: T, index: number, section: "top" | "center" | "bottom") => string;
type BranchIdFn = (path: (string | null)[]) => string;

type DSOptions<T, K> = {
  readonly data?: T[];
  readonly topData?: T[];
  readonly botData?: T[];
  readonly sortFn?: SortFn<T> | null;
  readonly filterFn?: FilterFn<T> | null;
  readonly groupFn?: GroupFn<T>;
  readonly expandedFn?: ExpandedFn;
  readonly aggregationFn?: AggregationFn<T, K>;
  readonly collapseBehavior?: CollapseBehavior;
  readonly suppressLeafExpansion?: boolean;
};

export class ClientDataSource<T, K> {
  // Raw dataset
  #topData!: T[];
  #botData!: T[];
  #data!: T[];

  // Row id calculators
  #leafId: LeafIdFn<T> = (_, i, s) => (s !== "center" ? `leaf-${i}-${s}` : `leaf-${i}`);
  #branchId: BranchIdFn = (p) => p.map((x) => (x == null ? "_null_" : x)).join("->");

  // View modifiers
  #sortFn: SortFn<T> | null;
  #filterFn: FilterFn<T> | null;
  #groupFn: GroupFn<T> | null;
  #expandedFn: ExpandedFn;
  #aggregationFn: AggregationFn<T, K> | null = null;

  // Row leaf nodes and mappings
  #nodesTop: RowLeaf<T>[] = [];
  #nodesBot: RowLeaf<T>[] = [];
  #nodesLeaf: RowLeaf<T>[] = [];
  #nodesFiltered: null | number[] = null;
  #nodesSorted: number[] = [];
  #nodeLookup: Map<T, RowLeaf<T>> = new Map();

  #tree: RootNode<T, K> | null = null;

  #center: RowNode<T>[] = [];
  flat: RowNode<T>[] = [];

  constructor({
    sortFn,
    filterFn,
    groupFn,
    expandedFn,
    aggregationFn,

    data,
    topData,
    botData,
  }: DSOptions<T, K> = {}) {
    this.#sortFn = sortFn ?? null;
    this.#filterFn = filterFn ?? null;
    this.#groupFn = groupFn ?? null;
    this.#expandedFn = expandedFn ?? (() => false);
    this.#aggregationFn = aggregationFn ?? null;

    this.topData = topData ?? [];
    this.botData = botData ?? [];
    this.data = data ?? [];
  }

  // Setters
  set sortFn(fn: SortFn<T> | null) {
    this.#sortFn = fn;
    this.#updateWorkingSet();
  }
  set filterFn(fn: FilterFn<T> | null) {
    this.#filterFn = fn;
    this.#updateWorkingSet();
  }
  set groupFn(fn: GroupFn<T> | null) {
    this.#groupFn = fn;
    this.#updateGroupSet();
  }
  set expandedFn(fn: ExpandedFn) {
    this.#expandedFn = fn;
    if (this.#groupFn) this.#updateView();
  }

  set topData(d: T[]) {
    this.#topData = d;
    this.#nodesTop = this.#topData.map((d, i) => this.#makeLeaf(d, i, "top"));
  }
  set botData(d: T[]) {
    this.#botData = d;
    this.#nodesBot = this.#botData.map((d, i) => this.#makeLeaf(d, i, "bottom"));
  }

  get data() {
    return this.#data;
  }
  set data(d: T[]) {
    this.#data = d;

    const nextMap = new Map<T, RowLeaf<T>>();
    const nextNodes: RowLeaf<T>[] = [];

    for (let i = 0; i < d.length; i++) {
      const data = d[i];
      const node = this.#nodeLookup.get(data) ?? this.#makeLeaf(data, i, "center");

      nextMap.set(data, node);
      nextNodes.push(node);
    }

    this.#nodesLeaf = nextNodes;
    this.#nodeLookup = nextMap;

    this.#updateWorkingSet();
  }

  // CRUD Methods
  byIndex = () => {};
  byId = () => {};

  // Helpers
  childIds = () => {};
  leafs = () => {};

  #makeLeaf = (d: T, i: number, section: "top" | "center" | "bottom"): RowLeaf<T> => ({
    kind: "leaf",
    data: d,
    id: this.#leafId(d, i, section),
  });

  #updateWorkingSet = () => {
    const filterFn = this.#filterFn;
    const sortFn = this.#sortFn;
    const leafs = this.#nodesLeaf;

    if (filterFn) {
      const filtered = [];
      for (let i = 0; i < leafs.length; i++) {
        const node = leafs[i];
        if (filterFn(node)) filtered.push(i);
      }
      this.#nodesFiltered = filtered;
    } else {
      this.#nodesFiltered = null;
    }

    if (sortFn) {
      if (this.#nodesFiltered) {
        this.#nodesSorted = this.#nodesFiltered.toSorted((li, ri) => {
          const leftNode = leafs[li];
          const rightNode = leafs[ri];
          return sortFn(leftNode, rightNode);
        });
      } else {
        this.#nodesSorted = Array.from({ length: leafs.length }, (_, i) => i).sort((li, ri) => {
          const leftNode = leafs[li];
          const rightNode = leafs[ri];
          return sortFn(leftNode, rightNode);
        });
      }
    } else {
      if (this.#nodesFiltered) this.#nodesSorted = this.#nodesFiltered;
      else this.#nodesSorted = Array.from({ length: leafs.length }, (_, i) => i);
    }

    this.#updateGroupSet();
  };

  #updateGroupSet = () => {
    if (this.#groupFn) this.#create_group_sets();
    else this.#tree = null;

    this.#updateView();
  };

  #updateView = () => {
    if (this.#groupFn) this.#flattenGroup();
    else this.#flatten();
  };

  #flatten = () => {
    const sorted = this.#nodesSorted;
    const leafs = this.#nodesLeaf;
    const rows: RowLeaf<T>[] = [];

    for (let i = 0; i < sorted.length; i++) {
      rows.push(leafs[sorted[i]]);
    }

    this.#center = rows;
    this.#finalizeFlatten();
  };

  #flattenGroup = () => {
    const expandedFn = this.#expandedFn;

    const flatList: RowNode<T>[] = [];
    const ranges: { parent: RowGroup | null; start: number; end: number }[] = [];

    type EnhancedRow =
      | (RowGroup & {
          __children: RootMap<T, K>;
          __isLast: boolean;
        })
      | RowLeaf<T>;

    const nodeToChildren = this.#nodeChildrenToRows;

    function processRowsBetter(node: RootMap<T, K>, parent: RowGroup | null, start: number, depth = 0) {
      const rows = nodeToChildren(node, false, depth);

      let offset = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as EnhancedRow;
        const rowIndex = i + start + offset;

        if (row.kind === "leaf") {
          flatList.push(row);
          continue;
        }

        flatList.push(row as RowGroup);

        if (!expandedFn(row.id)) continue;

        offset += processRowsBetter(row.__children, row, rowIndex + 1, depth + 1);
      }

      ranges.push({ parent, start, end: offset + start + node.size });
      return offset + node.size;
    }

    const count = processRowsBetter(this.#tree!.children, null, 0);

    void ranges;
    void count;

    this.#center = flatList;
    this.#finalizeFlatten();
  };

  #finalizeFlatten = () => {
    this.flat = [...this.#nodesTop, ...this.#center, ...this.#nodesBot];
  };

  // Utilities
  #create_group_sets = () => {
    const groupFn = this.#groupFn!;

    const workingSet = this.#nodesSorted;
    const leafs = this.#nodesLeaf;

    const root: RootNode<T, K> = { kind: "root", children: new Map() };

    for (let i = 0; i < workingSet.length; i++) {
      const n = leafs[workingSet[i]];
      const paths = groupFn(n);

      let current = root.children;
      let currentGroup: GroupNode<T, K> | RootNode<T, K> = root;

      // This has been marked a non-terminal node
      if (!paths?.length) {
        current.set(current.size, { kind: "leaf", row: n, parent: root, key: current.size });
        continue;
      }

      for (let j = 0; j < paths.length; j++) {
        const p = paths[j];
        if (!current.has(p))
          current.set(p, {
            kind: "branch",
            children: new Map(),
            leafs: [],
            path: paths.slice(0, j + 1),
            row: -1,
            last: j === paths.length - 1,
            parent: currentGroup,
            key: p,
          });

        const node = current.get(p)!;
        if (node.kind !== "branch") {
          console.error(
            `Invalid grouping path. Expected a group node for path: ${paths}, but found a leaf along the way.`,
            node,
          );
          continue;
        }
        node.leafs.push(i);
        currentGroup = node;
        current = node.children;
      }

      current.set(current.size, { kind: "leaf", row: n, parent: currentGroup, key: current.size });
    }

    this.#tree = root;
  };

  #nodeChildrenToRows = (root: RootMap<T, K>, isLast: boolean, depth: number) => {
    const values = root.values();
    const branchId = this.#branchId;
    const aggFn = this.#aggregationFn;
    const leafs = this.#nodesLeaf;
    const sorted = this.#nodesSorted;

    const rows: RowNode<T>[] = [];
    for (const v of values) {
      if (v.kind === "leaf") {
        rows.push(v.row);
        continue;
      } else {
        const id = branchId(v.path);
        const data = aggFn ? aggFn(v.leafs.map((i) => leafs[sorted[i]])) : (null as K);

        const row: RowGroup = {
          kind: "branch",
          id,
          data,
          depth,
          key: v.path.at(-1)!,

          __children: v.children,
          __isLast: v.last,
        } as RowGroup;

        rows.push(row);
      }
    }

    const sortFn = this.#sortFn;
    if (!isLast && sortFn) return rows.sort(sortFn);
    return rows;
  };
}
