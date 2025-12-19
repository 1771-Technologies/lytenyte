import { useCallback, useMemo, useRef } from "react";
import type {
  AggregationFn,
  FilterFn,
  GroupFn,
  GroupIdFn,
  LeafIdFn,
  RowAtom,
  RowNode,
  RowSource,
  SortFn,
} from "@1771technologies/lytenyte-shared";
import { usePiece } from "../hooks/use-piece.js";
import { useFlattenedPiece } from "./hooks/use-flattened-piece.js";
import { useLeafNodes } from "./hooks/use-leaf-nodes.js";
import { useFiltered } from "./hooks/use-filtered.js";
import { useSorted } from "./hooks/use-sorted.js";
import { useGroupTree } from "./hooks/use-group-tree.js";
import { useControlled } from "../hooks/use-controlled.js";
import { useFlattenedGroups } from "./hooks/use-flattened-groups.js";

export interface UseClientDataSourceParams<T> {
  readonly data: T[];
  readonly topData?: T[];
  readonly botData?: T[];

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;

  readonly sort?: SortFn<T>;
  readonly filter?: FilterFn<T>;
  readonly group?: GroupFn<T>;
  readonly aggregate?: AggregationFn<T>;

  readonly leafIdFn?: LeafIdFn<T>;
  readonly groupIdFn?: GroupIdFn;
}

export function useClientDataSource<T>({
  data,
  topData,
  botData,
  filter,
  sort,
  group,
  aggregate,

  rowGroupDefaultExpansion = false,
  rowGroupExpansions,

  leafIdFn,
  groupIdFn,
}: UseClientDataSourceParams<T>) {
  const [leafsTop, leafs, leafsBot] = useLeafNodes(topData, data, botData, leafIdFn);

  const filtered = useFiltered(leafs, filter);
  const sorted = useSorted(leafs, sort, filtered);

  const [expansions] = useControlled({
    controlled: rowGroupExpansions,
    default: {},
  });
  const expandedFn = useCallback(
    (id: string, depth: number) => {
      const s = expansions[id];
      if (s != null) return s;

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return rowGroupDefaultExpansion <= depth;
    },
    [expansions, rowGroupDefaultExpansion],
  );

  const tree = useGroupTree(leafs, sorted, group);

  const [groupFlat, maxDepth] = useFlattenedGroups(
    tree,
    groupIdFn,
    aggregate,
    leafs,
    sorted,
    sort,
    expandedFn,
  );

  const { flatten: piece, rowByIndexRef } = useFlattenedPiece({
    leafsTop,
    leafsCenter: leafs,
    leafsBot,
    groupFlat,
    centerIndices: sorted,
  });

  const botPiece = usePiece(leafsBot.length);
  const topPiece = usePiece(leafsTop.length);
  const maxDepthPiece = usePiece(maxDepth);

  const atomCache = useRef<Record<number, RowAtom<RowNode<T> | null>>>({});
  const source = useMemo<RowSource>(() => {
    const rowCount$ = (x: RowNode<T>[]) => x.length;
    return {
      rowByIndex: (row) => {
        if (!atomCache.current[row]) {
          const $ = (x: RowNode<T>[]) => x[row] ?? null;
          atomCache.current[row] = {
            get: () => piece.get()[row],
            useValue: () => piece.useValue($),
          };
        }
        return atomCache.current[row];
      },
      rowIndexToRowId: (index) => rowByIndexRef.current.get(index)?.id ?? null,
      useBottomCount: botPiece.useValue,
      useTopCount: topPiece.useValue,
      useRowCount: () => piece.useValue(rowCount$),

      useMaxRowGroupDepth: maxDepthPiece.useValue,
      useSnapshotVersion: () => 0,
    };
  }, [botPiece.useValue, maxDepthPiece, piece, rowByIndexRef, topPiece.useValue]);

  return source;
}
