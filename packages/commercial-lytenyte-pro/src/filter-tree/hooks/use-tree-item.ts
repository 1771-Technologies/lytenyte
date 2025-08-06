import { useCallback, useMemo } from "react";
import type { FilterInFilterItem } from "../../+types";
import { useGrid } from "../../grid-provider/use-grid";
import type {
  TreeVirtualItem,
  TreeVirtualLeaf,
} from "../../tree-view/virtualized/make-virtual-tree";
import { useTreeContext } from "../context";

function isSelectAll(
  item: TreeVirtualItem<FilterInFilterItem>,
): item is TreeVirtualLeaf<FilterInFilterItem> {
  return item.kind === "leaf" && item.leaf.data.id === "__LNG__SELECT_ALL";
}

export function useTreeItem(item: TreeVirtualItem<FilterInFilterItem>) {
  const { filter, filterChange, pivotMode, columnId, items, applyChangesImmediately } =
    useTreeContext();
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
    if (filter.operator === "in") {
      if (isSelectAll(item)) {
        return items.every((c) => filter.value.has(c.value as any));
      }

      return itemValues.every((c) => filter.value.has(c as any));
    } else {
      if (isSelectAll(item)) {
        return filter.value.size === 0;
      }

      return itemValues.every((c) => !filter.value.has(c as any));
    }
  }, [filter.operator, filter.value, item, itemValues, items]);

  const isIndeterminate = useMemo(() => {
    if (filter.operator === "in") {
      if (isSelectAll(item)) {
        return !isChecked && items.some((c) => filter.value.has(c as any));
      }

      return !isChecked && itemValues.some((c) => filter.value.has(c as any));
    } else {
      if (isSelectAll(item)) {
        return (
          !isChecked && filter.value.size > 0 && items.some((c) => !filter.value.has(c as any))
        );
      }

      return !isChecked && itemValues.some((c) => !filter.value.has(c as any));
    }
  }, [item, isChecked, itemValues, filter, items]);

  const onCheckChange = useCallback(
    (b?: boolean) => {
      const checked = b ?? !isChecked;
      let nextValue: Set<any>;

      const operator = filter.operator;
      if (isSelectAll(item)) {
        if (operator === "in") {
          nextValue = checked ? new Set(items.map((c) => c.value)) : new Set();
        } else {
          nextValue = checked ? new Set() : new Set(items.map((c) => c.value));
        }
      } else {
        nextValue = new Set(filter.value);

        if (operator === "in") {
          if (checked) itemValues.forEach((c) => nextValue.add(c));
          else itemValues.forEach((c) => nextValue.delete(c));
        } else {
          if (checked) itemValues.forEach((c) => nextValue.delete(c));
          else itemValues.forEach((c) => nextValue.add(c));
        }
      }

      if (!applyChangesImmediately) {
        filterChange({ kind: "in", operator, value: nextValue });
      } else {
        if (pivotMode) {
          grid.state.columnPivotModel.set((prev) => {
            return {
              ...prev,
              filtersIn: {
                ...prev.filtersIn,
                [columnId]: { kind: "in", operator, value: nextValue },
              },
            };
          });
        } else {
          grid.state.filterInModel.set((prev) => ({
            ...prev,
            [columnId]: { kind: "in", operator, value: nextValue },
          }));
        }
      }
    },
    [
      isChecked,
      item,
      itemValues,
      filter.operator,
      filter.value,
      applyChangesImmediately,
      items,
      filterChange,
      pivotMode,
      grid.state.columnPivotModel,
      grid.state.filterInModel,
      columnId,
    ],
  );

  return useMemo(
    () => ({ onCheckChange, isChecked, isIndeterminate, item }),
    [isChecked, isIndeterminate, item, onCheckChange],
  );
}
