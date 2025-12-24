import type { GroupIdFn } from "@1771technologies/lytenyte-shared";
import type { GridSpec } from "../../types/grid.js";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";
import { useFiltered } from "./use-filtered.js";
import { useGroupTree } from "./use-group-tree/use-group-tree.js";
import type { LeafRowTuple } from "./use-leaf-nodes.js";
import { useSorted } from "./use-sorted.js";
import { useFlattenedGroups } from "./use-flattened-groups.js";
import type { Controlled } from "./use-controlled-ds-state.js";
import { useFlattenedPiece } from "./use-flattened-piece.js";

const groupIdFallback: GroupIdFn = (p) => p.map((x) => (x == null ? "_null_" : x)).join("->");
export function useFlattenedData<Spec extends GridSpec>(
  props: UseClientDataSourceParams<Spec>,
  [leafsTop, leafs, leafsBot, leafIdsRef]: LeafRowTuple<Spec["data"]>,
  { expandedFn }: Controlled,
) {
  const leafSort = Array.isArray(props.sort) ? props.sort.at(-1) : props.sort;
  const filtered = useFiltered(leafs, props.filter);
  const sorted = useSorted(leafs, leafSort, filtered);

  const havingFilter = Array.isArray(props.having)
    ? props.having.length
      ? props.having
      : null
    : props.having;
  const tree = useGroupTree(
    leafs,
    sorted,
    props.group,
    props.groupIdFn ?? groupIdFallback,
    props.rowGroupCollapseBehavior ?? "no-collapse",
    havingFilter,
    props.havingGroupAlways ?? false,
    props.aggregate,
  );

  const groupSort = Array.isArray(props.sort) ? (props.sort.length ? props.sort : null) : props.sort;
  const [groupFlat, maxDepth] = useFlattenedGroups(
    tree,
    props.aggregate,
    leafs,
    sorted,
    groupSort,
    props.sortGroupAlways ?? true,
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
  };
}
