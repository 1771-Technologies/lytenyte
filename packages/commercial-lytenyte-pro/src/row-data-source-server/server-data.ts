import { equal } from "@1771technologies/lytenyte-shared";
import type {
  DataRequest,
  DataResponse,
  DataResponsePinned,
  RowGroup,
  RowLeaf,
  RowNode,
} from "../+types.js";
import type {
  LeafOrParent,
  SetDataAction,
  TreeParent,
  TreeRoot,
  TreeRootAndApi,
} from "./async-tree/+types.async-tree.js";
import { makeAsyncTree } from "./async-tree/make-async-tree.js";
import { RangeTree, type FlattenedRange } from "./range-tree/range-tree.js";
import { getRequestId } from "./utils/get-request-id.js";
import { getNodePath } from "./utils/get-node-path.js";
import { getNodeDepth } from "./utils/get-node-depth.js";

const noopFetcher = async () => [];

type DataFetcher = (
  req: DataRequest[],
  expansions: Record<string, boolean | undefined>,
  pivotExpansions: Record<string, boolean | undefined>,
) => Promise<(DataResponse | DataResponsePinned)[]>;

export interface FlatView {
  readonly tree: TreeRootAndApi<RowGroup, RowLeaf>;
  readonly top: number;
  readonly center: number;
  readonly bottom: number;
  readonly rangeTree: RangeTree;
  readonly rowIndexToRow: Map<number, RowNode<any>>;
  readonly rowIdToRow: Map<string, RowNode<any>>;
  readonly rowIdToRowIndex: Map<string, number>;
  readonly rowIdToTreeNode: Map<string, LeafOrParent<RowGroup, RowLeaf>>;
  readonly loading: Set<number>;
  readonly loadingGroup: Set<number>;
  readonly errored: Map<number, { error: unknown; request?: DataRequest }>;
  readonly erroredGroup: Map<number, { error: unknown; request: DataRequest }>;
}

export interface ServerDataConstructorParams {
  readonly blocksize: number;

  // Needs sync
  readonly pivotMode: boolean;
  readonly expansions: Record<string, boolean | undefined>;
  readonly pivotExpansions: Record<string, boolean | undefined>;

  readonly onResetLoadBegin: () => void;
  readonly onResetLoadError: (error: unknown) => void;
  readonly onResetLoadEnd: () => void;

  readonly onFlatten: (r: FlatView) => void;

  readonly defaultExpansion: boolean | number;
}

export class ServerData {
  #tree: TreeRootAndApi<RowGroup, RowLeaf>;
  #top: { asOf: number; rows: RowNode<any>[] } = { asOf: 0, rows: [] };
  #bottom: { asOf: number; rows: RowNode<any>[] } = { asOf: 0, rows: [] };

  #blocksize: number;
  #flat!: FlatView;

  #dataFetcher: DataFetcher = noopFetcher;
  #pivotMode: boolean;

  #expansions: Record<string, boolean | undefined>;
  #pivotExpansions: Record<string, boolean | undefined>;

  #onResetLoadBegin: () => void;
  #onResetLoadError: (error: unknown) => void;
  #onResetLoadEnd: () => void;
  #onFlatten: (r: FlatView) => void;

  #rowViewBounds: [start: number, end: number] = [0, 0];
  #prevRequests: DataRequest[] = [];

  #loadingRows: Set<number> = new Set();
  #loadingGroup: Set<number> = new Set();
  #rowsWithError: Map<number, { error: unknown; request?: DataRequest }> = new Map();
  #rowsWithGroupError: Map<number, { error: unknown; request: DataRequest }> = new Map();
  #controllers: Set<AbortController> = new Set();

  #defaultExpansion: boolean | number;

  constructor({
    blocksize,
    pivotMode,
    pivotExpansions,
    expansions,
    onResetLoadBegin,
    onResetLoadEnd,
    onResetLoadError,
    onFlatten,
    defaultExpansion,
  }: ServerDataConstructorParams) {
    this.#tree = makeAsyncTree();
    this.#blocksize = blocksize;

    this.#pivotMode = pivotMode;
    this.#expansions = expansions;
    this.#pivotExpansions = pivotExpansions;
    this.#defaultExpansion = defaultExpansion;

    this.#onResetLoadBegin = onResetLoadBegin;
    this.#onResetLoadEnd = onResetLoadEnd;
    this.#onResetLoadError = onResetLoadError;

    this.#onFlatten = onFlatten;
  }

  // Properties
  set dataFetcher(d: DataFetcher) {
    if (this.#dataFetcher === d) return;
    this.#dataFetcher = d;
    this.reset();
  }
  set pivotMode(b: boolean) {
    if (b === this.#pivotMode) return;
    this.#pivotMode = b;
    this.reset();
  }

  set expansions(d: Record<string, boolean | undefined>) {
    this.#expansions = d;
    if (this.#pivotMode) return;
    this.#flatten();
  }
  set pivotExpansions(d: Record<string, boolean | undefined>) {
    this.#pivotExpansions = d;
    if (!this.#pivotMode) return;
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

    this.#tree = makeAsyncTree();
    this.#flatten();

    this.#rowsWithError.clear();
    this.#rowsWithGroupError.clear();
    this.#loadingRows.clear();
    this.#loadingGroup.clear();

    try {
      this.#onResetLoadBegin();

      this.#prevRequests = [
        {
          rowStartIndex: 0,
          rowEndIndex: this.#blocksize,
          id: getRequestId([], 0, this.#blocksize),
          path: [],
          start: 0,
          end: this.#blocksize,
        },
      ];

      const res = await this.#dataFetcher(
        this.#prevRequests,
        this.#expansions,
        this.#pivotExpansions,
      );

      this.handleResponses(res);
    } catch (e) {
      console.log(e);
      this.#onResetLoadError(e);
    } finally {
      this.#onResetLoadEnd();
    }
  };

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
        if (!skip)
          for (let i = req.rowStartIndex; i < req.rowEndIndex; i++) this.#loadingRows.add(i);
      });
      const responses = await this.#dataFetcher(requests, this.#expansions, this.#pivotExpansions);

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
    const pinned = data.filter(
      (c) => c.kind === "top" || c.kind === "bottom",
    ) as DataResponsePinned[];
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
      this.#tree.set({
        path: r.path,
        items: r.data.map<Required<SetDataAction<RowGroup, RowLeaf>>["items"][number]>((c, i) => {
          if (c.kind === "leaf") {
            return {
              kind: "leaf",
              data: {
                kind: "leaf",
                data: c.data,
                id: c.id,
              },
              relIndex: r.start + i,
            };
          } else {
            return {
              kind: "parent",
              data: {
                kind: "branch",
                data: c.data,
                depth: r.path.length,
                id: c.id,
                key: c.key,
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

  requestsForView(start?: number, end?: number) {
    const bounds = this.#rowViewBounds;

    start = start ?? bounds[0];
    end = end ?? bounds[1];

    const seen = new Set();
    const requests: DataRequest[] = [];

    for (let i = start; i < end; i++) {
      const ranges = this.#flat.rangeTree.findRangesForRowIndex(i);

      ranges.forEach((c) => {
        if (c.parent.kind === "root") {
          const blockIndex = Math.floor(i / this.#blocksize);

          const start = blockIndex * this.#blocksize;
          const end = Math.min(start + this.#blocksize, c.parent.size);

          const path: string[] = [];
          const reqId = getRequestId(path, start, start + this.#blocksize);

          if (seen.has(reqId)) return;
          seen.add(reqId);

          const size =
            start + this.#blocksize > c.parent.size ? c.parent.size - start : this.#blocksize;

          requests.push({ id: reqId, path, start, end, rowStartIndex: i, rowEndIndex: i + size });
        } else {
          const blockIndex = Math.floor((i - c.rowStart) / this.#blocksize);
          const start = blockIndex * this.#blocksize;
          const end = Math.min(start + this.#blocksize, c.parent.size);

          const path = getNodePath(c.parent);
          const reqId = getRequestId(path, start, start + this.#blocksize);

          if (seen.has(reqId)) return;
          seen.add(reqId);

          const size =
            start + this.#blocksize > c.parent.size ? c.parent.size - start : this.#blocksize;

          requests.push({ id: reqId, path, start, end, rowStartIndex: i, rowEndIndex: i + size });
        }
      });
    }

    return requests;
  }

  async handleViewBoundsChange() {
    const requests = this.requestsForView();
    const newRequests = requests.filter(
      (c) => !this.#prevRequests.find((prev) => prev.id === c.id),
    );

    // We don't have any new requests to make in our view, so we can return
    if (!newRequests.length) return;

    this.#prevRequests = requests;
    await this.handleRequests(newRequests);
  }

  retry(rowIds?: string[]) {
    // let requests: DataRequest[] = [];
    // const groupReqs = new Map<string, { index: number; req: DataRequest }>();
    // const seen = new Set();
    // if (!rowIds) {
    //   const keys = this.#rowsWithError.keys();
    //   for (const rowIndex of keys) {
    //     if (this.#rowsWithGroupError.has(rowIndex)) {
    //       const req = this.#rowsWithGroupError.get(rowIndex)!;
    //       if (!seen.has(req.id)) {
    //         seen.add(req.id);
    //         groupReqs.set(req.id, { index: rowIndex, req });
    //         requests.push(req);
    //       }
    //     }
    //     const v = this.#rowsWithError.get(rowIndex)!;
    //     if (v.request && !seen.has(v.request.id)) {
    //       seen.add(v.request.id);
    //       requests.push(v.request);
    //     }
    //   }
    //   const [start, end] = this.#rowViewBounds;
    //   requests = requests.filter((req) => {
    //     return req.rowStartIndex >= start && req.rowStartIndex < end;
    //   });
    //   this.#rowsWithError.clear();
    //   this.#rowsWithGroupError.clear();
    // } else {
    //   for (const id of rowIds) {
    //     const rowIndex = this.#flat.rowIdToRowIndex.get(id);
    //     if (rowIndex == null || !this.#rowsWithError.has(rowIndex)) continue;
    //     const v = this.#rowsWithError.get(rowIndex)!;
    //     const groupReq = this.#rowsWithGroupError.get(rowIndex);
    //     this.#rowsWithError.delete(rowIndex);
    //     this.#rowsWithGroupError.delete(rowIndex);
    //     if (groupReq && !seen.has(groupReq.id)) {
    //       seen.add(groupReq.id);
    //       groupReqs.set(groupReq.id, { index: rowIndex, req: groupReq });
    //       requests.push(groupReq);
    //     }
    //     if (v.request && !seen.has(v.request.id)) {
    //       seen.add(v.request.id);
    //       requests.push(v.request);
    //     }
    //   }
    // }
    // const withLoading = this.#loadingRows;
    // const withError = this.#rowsWithError;
    // const withGroupError = this.#rowsWithGroupError;
    // groupReqs.forEach((v) => {
    //   withLoading.add(v.index);
    // });
    // // See these to loading
    // this.handleRequests(requests, {
    //   onError: (e) => {
    //     groupReqs.forEach((c) => {
    //       withLoading.delete(c.index);
    //       withError.set(c.index, { error: e });
    //       withGroupError.set(c.index, c.req);
    //     });
    //   },
    //   onSuccess: () => {
    //     groupReqs.forEach((c) => {
    //       withLoading.delete(c.index);
    //     });
    //   },
    // });
  }

  updateRow(id: string, data: any) {
    const centerRow = this.#flat.rowIdToTreeNode.get(id);

    if (centerRow) {
      (centerRow as any).data = { ...centerRow.data, data };
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

  #flatten = (beforeOnFlat?: () => void) => {
    // The mode we are in determines the expansions we will use for the server data.
    const mode = this.#pivotMode;
    const expansions = mode ? this.#pivotExpansions : this.#expansions;
    const t = this.#tree;

    // We use these maps to keep track of the current view. These are helpful for
    // quick lookup. They are also used to implement many of the data source APIs.
    const rowIdToRow = new Map<string, RowNode<any>>();
    const rowIndexToRow = new Map<number, RowNode<any>>();
    const rowIdToRowIndex = new Map<string, number>();
    const rowIdToTreeNode = new Map<string, LeafOrParent<RowGroup, RowLeaf>>();

    // When flattening the tree we need to keep track of the ranges. The tree itself
    // will only have some rows loaded, but the ranges will be fully defined.
    const ranges: FlattenedRange[] = [];

    const blocksize = this.#blocksize;
    const previousRequests = this.#prevRequests;

    // Tracks the error and loading state of the rows.
    const withGroupError = this.#rowsWithGroupError;
    const withLoadingGroup = this.#loadingGroup;

    const handleRequests = this.handleRequests;
    const defaultExpansion = this.#defaultExpansion;

    const postFlatRequests: [ri: number, DataRequest][] = [];

    function processParent(
      node: TreeRoot<RowGroup, RowLeaf> | TreeParent<RowGroup, RowLeaf>,
      start: number,
    ): number {
      const rows = [...node.byIndex.values()].sort((l, r) => l.relIndex - r.relIndex);

      let offset = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowIndex = row.relIndex + start + offset;

        rowIndexToRow.set(rowIndex, row.data);
        rowIdToRowIndex.set(row.data.id, rowIndex);
        rowIdToRow.set(row.data.id, row.data);
        rowIdToTreeNode.set(row.data.id, row);

        // If this rows is a parent row, we need to check if it is expanded. There are a couple of
        // situations this to consider.
        // - the row is not expanded, in which case we only add the row itself to the flat view
        // - the row is expanded but it has no data loaded. We should then request data, but not add the rows
        // - the row is expanded and there is add. This is the easy case, we simply add the child rows as we flatten
        if (row.kind === "parent") {
          const expanded =
            expansions[row.data.id] ??
            (typeof defaultExpansion === "number"
              ? getNodeDepth(row) <= defaultExpansion
              : defaultExpansion);

          // Expanded but no data. Fetch the child data.
          if (expanded && !row.byIndex.size) {
            const path = getNodePath(row);

            const start = 0;
            const end = Math.min(start + blocksize, row.size);
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
            if (!previousRequests.find((c) => c.id === req.id)) {
              postFlatRequests.push([rowIndex, req]);
            }
          } else if (expanded) {
            offset += processParent(row, rowIndex + 1);
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
        previousRequests.push(c[1]);
      });

      const reqs = postFlatRequests.map((c) => c[1]);
      handleRequests(reqs, {
        skipState: true,
        onError: (e) => {
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

    this.#flat = {
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
    };

    beforeOnFlat?.();
    this.#onFlatten(this.#flat);
  };
}
