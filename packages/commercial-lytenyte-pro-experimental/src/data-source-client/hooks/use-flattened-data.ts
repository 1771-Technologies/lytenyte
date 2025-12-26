import type { GroupIdFn } from "@1771technologies/lytenyte-shared";
import type { GridSpec } from "../../types/grid.js";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";
import { useGroupTree } from "./use-group-tree/use-group-tree.js";
import { useSorted } from "./use-sorted.js";
import { useFlattenedGroups } from "./use-flattened-groups.js";
import type { SourceState } from "./use-controlled-ds-state.js";
import { useFlattenedPiece } from "./use-flattened-piece.js";
import {
  useAggregationFn,
  useFiltered,
  useFilterFn,
  useGroupFn,
  useSortFn,
  type LeafNodeTuple,
} from "@1771technologies/lytenyte-core-experimental/internal";

const groupIdFallback: GroupIdFn = (p) => p.map((x) => (x == null ? "_null_" : x)).join("->");
export function useFlattenedData<Spec extends GridSpec>(
  props: UseClientDataSourceParams<Spec>,
  [leafsTop, leafs, leafsBot, leafIdsRef]: LeafNodeTuple<Spec["data"]>,
  { expandedFn }: SourceState,
) {
  const filterFn = useFilterFn(props.filter);
  const sortFn = useSortFn(props.sort);
  const groupFn = useGroupFn(props.group);
  const aggFn = useAggregationFn(props.aggregate, props.aggregateFns);

  const filtered = useFiltered(leafs, filterFn);
  const sorted = useSorted(leafs, sortFn, filtered);

  const havingFilter = Array.isArray(props.having)
    ? props.having.length
      ? props.having
      : null
    : props.having;
  const tree = useGroupTree(
    leafs,
    sorted,
    groupFn,
    props.groupIdFn ?? groupIdFallback,
    props.rowGroupCollapseBehavior ?? "no-collapse",
    props.labelFilter,
    havingFilter,
    aggFn,
  );

  const [groupFlat, maxDepth] = useFlattenedGroups(
    tree,
    aggFn,
    leafs,
    sorted,
    sortFn,
    expandedFn,
    props.rowGroupSuppressLeafExpansion ?? false,
  );

  const { flatten, rowByIdRef, rowByIndexRef, rowIdToRowIndexRef } = useFlattenedPiece({
    leafsTop,
    leafsCenter: leafs,
    leafsBot,
    groupFlat,
    centerIndices: sorted,
  });

  return {
    tree,
    maxDepth,
    flatten,
    rowByIdRef,
    rowByIndexRef,
    rowIdToRowIndexRef,
    leafIdsRef,
    leafsTop,
    leafs,
    leafsBot,
    sorted,
    groupFn,
  };
}
