import {
  equal,
  type RowGroup,
  type RowLeaf,
  type RowNode,
  type Writable,
} from "@1771technologies/lytenyte-shared";
import type {
  LeafOrParent,
  SetDataAction,
  TreeLeaf,
  TreeParent,
  TreeRoot,
  TreeRootAndApi,
} from "./async-tree/+types.async-tree.js";
import { makeAsyncTree } from "./async-tree/make-async-tree.js";
import { RangeTree, type FlattenedRange } from "./range-tree/range-tree.js";
import { getRequestId } from "./utils/get-request-id.js";
import { getNodePath } from "./utils/get-node-path.js";
import { getNodeDepth } from "./utils/get-node-depth.js";
import type { DataRequest, DataResponse, DataResponsePinned } from "./types.js";

const noopFetcher = async () => [];

export type DataFetcher = (
  req: DataRequest[],
  expansions: Record<string, boolean | undefined>,
) => Promise<(DataResponse | DataResponsePinned)[]>;

export interface FlatView {
  readonly tree: TreeRootAndApi;
  readonly top: number;
  readonly center: number;
  readonly bottom: number;
  readonly rangeTree: RangeTree;
  readonly rowIndexToRow: Map<number, RowNode<any>>;
  readonly rowIdToRow: Map<string, RowNode<any>>;
  readonly rowIdToRowIndex: Map<string, number>;
  readonly rowIdToTreeNode: Map<string, LeafOrParent>;
  readonly loading: Set<number>;
  readonly loadingGroup: Set<number>;
  readonly errored: Map<number, { error: unknown; request?: DataRequest }>;
  readonly erroredGroup: Map<number, { error: unknown; request: DataRequest }>;
  readonly maxDepth: number;
  readonly seenRequests: Set<string>;
}

export interface ServerDataConstructorParams {
  readonly blocksize: number;

  // Needs sync
  readonly expansions: Record<string, boolean | undefined>;

  readonly onResetLoadBegin: () => void;
  readonly onResetLoadError: (error: unknown) => void;
  readonly onResetLoadEnd: () => void;

  readonly onFlatten: (r: FlatView) => void;
  readonly onInvalidate: () => void;

  readonly defaultExpansion: boolean | number;
}

export class ServerData {
  #top: { asOf: number; rows: RowNode<any>[] } = { asOf: 0, rows: [] };
  #bottom: { asOf: number; rows: RowNode<any>[] } = { asOf: 0, rows: [] };

  #blocksize: number;

  tree: TreeRootAndApi;
  flat!: FlatView;

  #dataFetcher: DataFetcher = noopFetcher;
  #expansions: Record<string, boolean | undefined>;

  #onResetLoadBegin: () => void;
  #onResetLoadError: (error: unknown) => void;
  #onResetLoadEnd: () => void;
  #onFlatten: (r: FlatView) => void;
  #onInvalidate: () => void;

  #rowViewBounds: [start: number, end: number] = [0, 0];
  #seenRequests: Set<string> = new Set();

  #loadingRows: Set<number> = new Set();
  #loadingGroup: Set<number> = new Set();
  #rowsWithError: Map<number, { error: unknown; request?: DataRequest }> = new Map();
  #rowsWithGroupError: Map<number, { error: unknown; request: DataRequest }> = new Map();
  #controllers: Set<AbortController> = new Set();

  #defaultExpansion: boolean | number;

  constructor({
    blocksize,
    expansions,
    onResetLoadBegin,
    onResetLoadEnd,
    onResetLoadError,
    onFlatten,
    onInvalidate,
    defaultExpansion,
  }: ServerDataConstructorParams) {
    this.tree = makeAsyncTree();
    this.#blocksize = blocksize;

    this.#expansions = expansions;
    this.#defaultExpansion = defaultExpansion;

    this.#onResetLoadBegin = onResetLoadBegin;
    this.#onResetLoadEnd = onResetLoadEnd;
    this.#onResetLoadError = onResetLoadError;

    this.#onFlatten = onFlatten;
    this.#onInvalidate = onInvalidate;
  }

  // Properties
  set dataFetcher(d: DataFetcher) {
    if (this.#dataFetcher === d) return;
    this.#dataFetcher = d;
    this.reset();
  }
  set expansions(d: Record<string, boolean | undefined>) {
    this.#expansions = d;
    this.#flatten();
  }
  set defaultExpansion(d: boolean | number) {
    this.#defaultExpansion = d;
  }

  set rowViewBounds(viewBounds: [start: number, end: number]) {
    if (equal(viewBounds, this.#rowViewBounds)) return;

    this.#rowViewBounds = viewBounds;

    this.handleViewBoundsChange();
  }

  // Methods
  reset = async () => {
    // Abort all the existing requests in flight.
    this.#controllers.forEach((c) => c.abort());

    this.tree = makeAsyncTree();
    this.#flatten();

    this.#rowsWithError.clear();
    this.#rowsWithGroupError.clear();
    this.#loadingRows.clear();
    this.#loadingGroup.clear();

    try {
      this.#onResetLoadBegin();

      this.#seenRequests.clear();

      const req = {
        rowStartIndex: 0,
        rowEndIndex: this.#blocksize,
        id: getRequestId([], 0, this.#blocksize),
        path: [],
        start: 0,
        end: this.#blocksize,
      };

      this.#seenRequests.add(req.id);
      const res = await this.#dataFetcher([req], this.#expansions);

      this.handleResponses(res);
    } catch (e) {
      this.#onResetLoadError(e);
    } finally {
      this.#onResetLoadEnd();
    }
  };

  requestForGroup(i: number) {
    const ranges = this.flat.rangeTree.findRangesForRowIndex(i);

    const path = ranges.slice(1).map((c) => (c.parent.kind === "parent" ? c.parent.path : null));

    const row = this.flat.rowIndexToRow.get(i);
    if (row?.kind !== "branch") return null;

    path.push(row.key);

    const r = (ranges.at(-1)?.parent as TreeParent).byPath.get(row.key) as TreeParent;
    const blocksize = this.#blocksize;

    const start = 0;
    const end = Math.min(start + blocksize, r.size);
    const reqSize = end - start;
    const req: DataRequest = {
      path,
      start: start,
      end: end,
      id: getRequestId(path, 0, blocksize),
      rowStartIndex: i + 1,
      rowEndIndex: i + 1 + reqSize,
    };

    return req;
  }

  handleRequests = async (
    requests: DataRequest[],
    opts: { onError?: (e: unknown) => void; onSuccess?: () => void; skipState?: boolean } = {},
  ) => {
    const controller = new AbortController();
    this.#controllers.add(controller);

    const skip = opts.skipState ?? false;

    // We need to request our new data now. There are a few scenarios to be aware. Once we are requesting rows,
    // we should mark the rows loading. This means we mark the row indices as loading (maybe by range)?
    // The load may fail, in which case we should mark the request as an error.
    try {
      // Mark these rows as loading
      requests.forEach((req) => {
        if (!skip) for (let i = req.rowStartIndex; i < req.rowEndIndex; i++) this.#loadingRows.add(i);
      });
      const responses = await this.#dataFetcher(requests, this.#expansions);

      // The request was aborted, so we can ignore it from this point
      if (controller.signal.aborted) return;

      this.handleResponses(responses, () => {
        if (!skip)
          requests.forEach((req) => {
            for (let i = req.rowStartIndex; i < req.rowEndIndex; i++) this.#rowsWithError.delete(i);
            for (let i = req.rowStartIndex; i < req.rowEndIndex; i++) this.#loadingRows.delete(i);
          });
      });
      opts?.onSuccess?.();
    } catch (e: unknown) {
      if (controller.signal.aborted) return;

      opts?.onError?.(e);
      this.#onInvalidate();

      if (!skip)
        requests.forEach((req) => {
          for (let i = req.rowStartIndex; i < req.rowEndIndex; i++)
            this.#rowsWithError.set(i, { error: e, request: req });
          for (let i = req.rowStartIndex; i < req.rowEndIndex; i++) this.#loadingRows.delete(i);
        });
    } finally {
      this.#controllers.delete(controller);
    }
  };

  handleResponses = (data: (DataResponse | DataResponsePinned)[], beforeOnFlat?: () => void) => {
    const pinned = data.filter((c) => c.kind === "top" || c.kind === "bottom") as DataResponsePinned[];
    const center = data.filter((c) => c.kind !== "top" && c.kind !== "bottom") as DataResponse[];

    // handle pinned
    for (let i = 0; i < pinned.length; i++) {
      const r = pinned[i];
      if (r.kind === "top" && r.asOfTime > this.#top.asOf) {
        this.#top = {
          asOf: r.asOfTime,
          rows: r.data.map<RowLeaf<any>>((c) => ({ id: c.id, data: c.data, kind: "leaf" })),
        };
      } else if (r.kind === "bottom" && r.asOfTime > this.#bottom.asOf) {
        this.#bottom = {
          asOf: r.asOfTime,
          rows: r.data.map<RowLeaf<any>>((c) => ({ id: c.id, data: c.data, kind: "leaf" })),
        };
      }
    }

    center.sort((l, r) => l.path.length - r.path.length);

    for (let i = 0; i < center.length; i++) {
      const r = center[i];
      this.tree.set({
        path: r.path,
        items: r.data.map<Required<SetDataAction>["items"][number]>((c, i) => {
          if (c.kind === "leaf") {
            return {
              kind: "leaf",
              row: {
                kind: "leaf",
                data: c.data,
                id: c.id,
              },
              relIndex: r.start + i,
            };
          } else {
            return {
              kind: "parent",
              row: {
                kind: "branch",
                data: c.data,
                depth: r.path.length,
                id: c.id,
                key: c.key,
                expandable: true, // Group nodes are always expandable for the server data source3
                expanded: false,
                last: false,
                __path: r.path,
              },
              path: c.key,
              relIndex: r.start + i,
              size: c.childCount,
            };
          }
        }),
        size: r.size,
        asOf: r.asOfTime,
      });
    }

    // Re-flatten our tree once everything has been re-updated.
    this.#flatten(beforeOnFlat);
  };

  requestForNextSlice(req: DataRequest) {
    let current: TreeRoot | TreeParent | TreeLeaf = this.tree;

    for (const c of req.path) {
      if (current.kind === "leaf") return null;
      const next = current.byPath.get(c);
      if (!next) return null;
      current = next;
    }
    if (current.kind === "leaf") return null;

    const maxSize = current.size;
    if (req.end >= maxSize) return null;

    const prevSize = req.end - req.start;

    const start = req.end;
    const end = Math.min(req.end + this.#blocksize, maxSize);

    const size = end - start;
    return {
      id: getRequestId(req.path, start, start + this.#blocksize),
      path: req.path,
      start,
      end,
      rowStartIndex: req.rowStartIndex + prevSize,
      rowEndIndex: req.rowStartIndex + prevSize + size,
    } satisfies DataRequest;
  }

  requestsForView(start?: number, end?: number) {
    const bounds = this.#rowViewBounds;

    start = start ?? bounds[0];
    end = end ?? bounds[1];

    const seen = new Set();
    const requests: DataRequest[] = [];

    for (let i = start; i < end; i++) {
      const ranges = this.flat.rangeTree.findRangesForRowIndex(i);

      ranges.forEach((c) => {
        if (c.parent.kind === "root") {
          const blockIndex = Math.floor(i / this.#blocksize);

          const start = blockIndex * this.#blocksize;
          const end = Math.min(start + this.#blocksize, c.parent.size);

          const path: string[] = [];
          const reqId = getRequestId(path, start, start + this.#blocksize);

          if (seen.has(reqId)) return;
          seen.add(reqId);

          const size = start + this.#blocksize > c.parent.size ? c.parent.size - start : this.#blocksize;

          requests.push({ id: reqId, path, start, end, rowStartIndex: i, rowEndIndex: i + size });
        } else {
          const blockIndex = Math.floor((i - c.rowStart) / this.#blocksize);
          const start = blockIndex * this.#blocksize;
          const end = Math.min(start + this.#blocksize, c.parent.size);

          const path = getNodePath(c.parent);
          const reqId = getRequestId(path, start, start + this.#blocksize);

          if (seen.has(reqId)) return;
          seen.add(reqId);

          const size = start + this.#blocksize > c.parent.size ? c.parent.size - start : this.#blocksize;

          requests.push({ id: reqId, path, start, end, rowStartIndex: i, rowEndIndex: i + size });
        }
      });
    }

    return requests;
  }

  async handleViewBoundsChange() {
    const requests = this.requestsForView();

    const newRequests = requests.filter((c) => !this.#seenRequests.has(c.id));

    // We don't have any new requests to make in our view, so we can return
    if (!newRequests.length) return;

    for (const n of newRequests) this.#seenRequests.add(n.id);
    await this.handleRequests(newRequests);
  }

  retry() {
    const inViewSet = new Set(this.requestsForView().map((c) => c.id));

    const erroredRequests = [...this.#rowsWithError.values()]
      .map((c) => c.request)
      .filter(Boolean) as DataRequest[];

    const erroredGroups = [...this.#rowsWithGroupError.entries()];

    const errors = erroredRequests.filter((x) => inViewSet.has(x!.id)) as DataRequest[];
    const [start, end] = this.#rowViewBounds;
    const groupErrors = erroredGroups
      .filter(([index]) => {
        return index >= start && index < end;
      })
      .map(([index, c]) => [index, c.request] as const);

    const seenRequests = this.#seenRequests;

    erroredRequests.map((x) => seenRequests.delete(x.id));
    erroredGroups.map((x) => seenRequests.delete(x[1].request.id));

    this.#rowsWithError.clear();
    this.#rowsWithGroupError.clear();

    const requests: DataRequest[] = [];
    const seen = new Set();

    groupErrors.forEach((x) => {
      if (seen.has(x[1].id)) return;
      requests.push(x[1]);
      seen.add(x[1].id);
    });
    errors.forEach((x) => {
      if (seen.has(x.id)) return;
      seen.add(x.id);
      requests.push(x);
    });

    for (const x of groupErrors) {
      this.#loadingGroup.add(x[0]);
    }

    requests.forEach((x) => seenRequests.add(x.id));

    const invalidate = this.#onInvalidate;
    const withGroupError = this.#rowsWithGroupError;
    const loadingGroup = this.#loadingGroup;
    this.handleRequests(requests, {
      onError: (e) => {
        invalidate();
        groupErrors.forEach((c) => {
          withGroupError.set(c[0], { error: e, request: c[1] });
          loadingGroup.delete(c[0]);
        });
      },
      onSuccess: () => {
        groupErrors.forEach((c) => {
          loadingGroup.delete(c[0]);
        });
      },
    });
  }

  updateRow(id: string, data: any) {
    const centerRow = this.flat.rowIdToTreeNode.get(id);

    if (centerRow) {
      (centerRow as any).data = { ...centerRow.row, data };
      return;
    }

    // Maybe its a pinned row?
    const topIndex = this.#top.rows.findIndex((c) => c.id === id);
    if (topIndex != -1) {
      this.#top.rows[topIndex] = { ...this.#top.rows[topIndex], data };
    }
    const botIndex = this.#bottom.rows.findIndex((c) => c.id === id);
    if (botIndex != -1) {
      this.#top.rows[botIndex] = { ...this.#top.rows[botIndex], data };
    }
  }

  flatten = () => {
    this.#flatten();
  };

  #flatten = (beforeOnFlat?: () => void) => {
    // The mode we are in determines the expansions we will use for the server data.
    const expansions = this.#expansions;
    const t = this.tree;

    // We use these maps to keep track of the current view. These are helpful for
    // quick lookup. They are also used to implement many of the data source APIs.
    const rowIdToRow = new Map<string, RowNode<any>>();
    const rowIndexToRow = new Map<number, RowNode<any>>();
    const rowIdToRowIndex = new Map<string, number>();
    const rowIdToTreeNode = new Map<string, LeafOrParent>();

    // When flattening the tree we need to keep track of the ranges. The tree itself
    // will only have some rows loaded, but the ranges will be fully defined.
    const ranges: FlattenedRange[] = [];

    const blocksize = this.#blocksize;
    const seen = this.#seenRequests;

    // Tracks the error and loading state of the rows.
    const withGroupError = this.#rowsWithGroupError;
    const withLoadingGroup = this.#loadingGroup;

    const handleRequests = this.handleRequests;
    const defaultExpansion = this.#defaultExpansion;

    const postFlatRequests: [ri: number, DataRequest][] = [];

    let hasGroups = false;
    function processParent(node: TreeRoot | TreeParent, start: number): number {
      const rows = [...node.byIndex.values()].sort((l, r) => l.relIndex - r.relIndex);

      let offset = 0;

      for (let i = 0; i < rows.length; i++) {
        const node = rows[i];
        const rowIndex = node.relIndex + start + offset;

        rowIndexToRow.set(rowIndex, node.row);
        rowIdToRowIndex.set(node.row.id, rowIndex);
        rowIdToRow.set(node.row.id, node.row);
        rowIdToTreeNode.set(node.row.id, node);

        // If this rows is a parent row, we need to check if it is expanded. There are a couple of
        // situations this to consider.
        // - the row is not expanded, in which case we only add the row itself to the flat view
        // - the row is expanded but it has no data loaded. We should then request data, but not add the rows
        // - the row is expanded and there is add. This is the easy case, we simply add the child rows as we flatten
        if (node.kind === "parent") {
          hasGroups = true;

          const expanded =
            expansions[node.row.id] ??
            (typeof defaultExpansion === "number"
              ? getNodeDepth(node) <= defaultExpansion
              : defaultExpansion);

          if (expanded) {
            (node.row as Writable<RowGroup>).expanded = true;
          } else {
            (node.row as Writable<RowGroup>).expanded = false;
          }

          // Expanded but no data. Fetch the child data.
          if (expanded && !node.byIndex.size) {
            const path = getNodePath(node);

            const start = 0;
            const end = Math.min(start + blocksize, node.size);
            const reqSize = end - start;
            const req: DataRequest = {
              path,
              start: start,
              end: end,
              id: getRequestId(path, 0, blocksize),
              rowStartIndex: rowIndex + 1,
              rowEndIndex: rowIndex + 1 + reqSize,
            };

            // If we haven't already requested the children data for this node, let's request it.
            if (!seen.has(req.id)) {
              postFlatRequests.push([rowIndex, req]);
            }
          } else if (expanded) {
            offset += processParent(node, rowIndex + 1);
          }
        }
      }
      ranges.push({
        rowStart: start,
        rowEnd: offset + node.size + start,
        parent: node,
      });
      return offset + node.size;
    }

    const topCount = this.#top.rows.length;
    const bottomCount = this.#bottom.rows.length;

    for (let i = 0; i < topCount; i++) {
      const row = this.#top.rows[i];
      rowIndexToRow.set(i, row);
      rowIdToRow.set(row.id, row);
      rowIdToRowIndex.set(row.id, i);
    }

    const size = processParent(t, topCount);
    for (let i = 0; i < bottomCount; i++) {
      const row = this.#bottom.rows[i];
      const rowIndex = i + size;

      rowIndexToRow.set(rowIndex, row);
      rowIdToRow.set(row.id, row);
      rowIdToRowIndex.set(row.id, rowIndex);
    }

    const rangeTree = new RangeTree(ranges);

    if (postFlatRequests.length > 0) {
      postFlatRequests.forEach((c) => {
        withLoadingGroup.add(c[0]);
        seen.add(c[1].id);
      });

      const invalidate = this.#onInvalidate;

      const reqs = postFlatRequests.map((c) => c[1]);
      handleRequests(reqs, {
        skipState: true,
        onError: (e) => {
          invalidate();
          postFlatRequests.forEach((c) => {
            const rowIndex = c[0];
            const req = c[1];

            withLoadingGroup.delete(rowIndex);
            withGroupError.set(rowIndex, { error: e, request: req });
          });
        },
        onSuccess: () => {
          postFlatRequests.forEach((c) => {
            withLoadingGroup.delete(c[0]);
          });
        },
      });
    }

    this.flat = {
      tree: t,
      top: topCount,
      center: size - topCount,
      bottom: bottomCount,
      rangeTree,
      rowIndexToRow,
      rowIdToRow,
      rowIdToRowIndex,
      rowIdToTreeNode,
      errored: this.#rowsWithError,
      erroredGroup: this.#rowsWithGroupError,
      loading: this.#loadingRows,
      loadingGroup: this.#loadingGroup,
      maxDepth: hasGroups ? 1 : 0,
      seenRequests: seen,
    };

    beforeOnFlat?.();
    this.#onFlatten(this.flat);
  };
}
