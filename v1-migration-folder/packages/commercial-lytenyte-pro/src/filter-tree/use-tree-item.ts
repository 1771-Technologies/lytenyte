import { useCallback, useMemo } from "react";
import type { FilterInFilterItem } from "../+types";
import { useGrid } from "../grid-provider/use-grid";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree";
import { useTreeContext } from "./context";

export function useTreeItem(item: TreeVirtualItem<FilterInFilterItem>) {
  const { filter, pivotMode, columnId, items } = useTreeContext();
  const grid = useGrid();

  const itemValues = useMemo(() => {
    if (item.kind === "leaf") return [item.leaf.data.value];

    const leafItems = [];
    const stack = [...item.children.values()];
    while (stack.length) {
      const c = stack.pop()!;
      if (c.kind === "leaf") leafItems.push(c.leaf.data.value);
      else stack.push(...c.children.values());
    }

    return leafItems;
  }, [item]);

  const isChecked = useMemo(() => {
    if (item.kind === "leaf" && item.leaf.data.id === "__LNG__SELECT_ALL") {
      return !filter || filter.value.size === 0;
    }
    return itemValues.every((c) => !filter?.value.has(c as any));
  }, [filter, itemValues, item]);

  const isIndeterminate = useMemo(() => {
    if (item.kind === "leaf" && item.leaf.data.id === "__LNG__SELECT_ALL") {
      return Boolean(
        !isChecked && filter && filter.value.size > 0 && filter.value.size < items.length,
      );
    }
    return !isChecked && itemValues.some((c) => !filter?.value.has(c as any));
  }, [item, isChecked, itemValues, filter, items.length]);

  const onCheckChange = useCallback(
    (b?: boolean) => {
      const checked = b ?? !isChecked;

      let nextValue: Set<any>;

      if (item.kind === "leaf" && item.leaf.data.id === "__LNG__SELECT_ALL") {
        nextValue = filter?.value.size ? new Set() : new Set(items.map((c) => c.value));
      } else {
        nextValue = filter?.value ? new Set(filter.value) : new Set();

        if (checked) itemValues.forEach((c) => nextValue.delete(c));
        else itemValues.forEach((c) => nextValue.add(c));
      }
      if (!filter) {
        if (pivotMode) {
          grid.state.columnPivotModel.set((prev) => {
            return {
              ...prev,
              filters: [
                ...prev.filters,
                { kind: "in", field: columnId, operator: "not_in", value: nextValue },
              ],
            };
          });
        } else {
          grid.state.filterModel.set((prev) => {
            return [...prev, { kind: "in", field: columnId, operator: "not_in", value: nextValue }];
          });
        }
      } else {
        const model = pivotMode
          ? grid.state.columnPivotModel.get().filters
          : grid.state.filterModel.get();

        const item = model.findIndex((c) => c === filter)!;
        const next = [...model];
        next[item] = { kind: "in", field: columnId, operator: "not_in", value: nextValue };

        if (pivotMode) {
          grid.state.columnPivotModel.set((prev) => {
            return {
              ...prev,
              filters: next,
            };
          });
        } else {
          grid.state.filterModel.set(next);
        }
      }
    },
    [
      items,
      columnId,
      filter,
      grid.state.columnPivotModel,
      grid.state.filterModel,
      isChecked,
      item,
      itemValues,
      pivotMode,
    ],
  );

  return useMemo(
    () => ({ onCheckChange, isChecked, isIndeterminate, item }),
    [isChecked, isIndeterminate, item, onCheckChange],
  );
}
