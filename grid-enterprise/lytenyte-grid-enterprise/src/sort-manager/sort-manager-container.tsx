import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import { useSortableColumnItems } from "./use-sortable-column-items";
import { type SortItem } from "./use-sort-state";
import { clsx } from "@1771technologies/js-utils";
import { useSortManagerContext } from "./sort-manager-context";

export interface SortRowItem {
  readonly columnItem: { value: string; label: string } | null;
  readonly index: number;

  readonly columnOptions: { value: string; label: string }[];
  readonly columnSelected: { value: string; label: string } | null;
  readonly columnOnSelect: (c: { value: string; label: string } | null) => void;

  readonly sortOptions: { value: string; label: string }[];
  readonly sortSelected: { value: string; label: string } | null;
  readonly sortOnSelect: (c: { value: string; label: string } | null) => void;

  readonly sortDirectionOptions: { value: string; label: string }[];
  readonly sortDirectionSelected: { value: string; label: string } | null;
  readonly sortDirectionOnSelect: (c: { value: string; label: string } | null) => void;

  readonly canAdd: boolean;
  readonly onAdd: () => void;
  readonly onDelete: () => void;
}

interface SortContainerProps {
  readonly children: (c: { items: SortRowItem[] }) => ReactNode;
}

export const SortManagerContainer = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & SortContainerProps
>(function ColumnSortContainer({ className, children, ...props }, ref) {
  const grid = useGrid();
  const [state, setState] = useSortManagerContext();

  const columnItems = useSortableColumnItems(grid);

  const unselectedSortedColumns = useMemo(() => {
    const selected = new Set(state.map((c) => c.columnId).filter((c) => c != null));

    return columnItems.filter((c) => !selected.has(c.value));
  }, [columnItems, state]);

  const sortItems = useMemo<SortRowItem[]>(() => {
    return state.map((c, i) => {
      const columnItem = columnItems.find((s) => c.columnId === s.value) ?? null;
      const columnOptions = columnItem
        ? [columnItem, ...unselectedSortedColumns]
        : unselectedSortedColumns;
      const columnOnSelect = (column: { value: string; label: string } | null) => {
        setState((prev) => {
          const v = { ...prev[i] };
          v.columnId = column?.value;
          const next = [...prev];
          next.splice(i, 1, v);

          return next;
        });
      };
      const columnSelected = columnItem;

      const sortOptions = sortValuesValues;
      const sortSelected = sortValuesValues.find((v) => v.value === c.sortOn) ?? null;

      const sortOnSelect = (sortOn: { value: string; label: string } | null) => {
        if (!sortOn) return;
        setState((prev) => {
          const v = { ...prev[i] };
          v.sortOn = sortOn!.value as SortItem["sortOn"];
          const next = [...prev];

          next.splice(i, 1, v);
          return next;
        });
      };

      const sortDirectionOptions = sortDirectionValues;
      const sortDirectionSelected =
        c.sortDirection === "ascending"
          ? { label: "Asc", value: "ascending" }
          : { label: "Desc", value: "descending" };

      const sortDirectionOnSelect = (item: { value: string; label: string } | null) => {
        if (!item) return;
        setState((prev) => {
          const v = { ...prev[i] };
          v.sortDirection = item!.value as SortItem["sortDirection"];
          const next = [...prev];
          next.splice(i, 1, v);

          return next;
        });
      };

      const onDelete = () => {
        setState((prev) => {
          const next = [...prev];
          next.splice(i, 1);

          if (!next.length) {
            return [{ sortDirection: "ascending" }];
          }

          return next;
        });
      };
      const onAdd = () => {
        setState((prev) => {
          const next = [...prev];
          next.splice(i + 1, 0, { sortDirection: "ascending" });
          return next;
        });
      };

      const maxSortCount = columnItems.length;

      return {
        index: i,
        columnItem,
        columnOptions,
        columnSelected,
        columnOnSelect,
        sortOptions,
        sortSelected,
        sortOnSelect,
        sortDirectionOptions,
        sortDirectionSelected,
        sortDirectionOnSelect,
        canAdd: maxSortCount > state.length,
        onAdd,
        onDelete,
      };
    });
  }, [columnItems, setState, state, unselectedSortedColumns]);

  return (
    <div {...props} className={clsx("lng1771-sort-manager__container", className)} ref={ref}>
      {children({ items: sortItems })}
    </div>
  );
});

const sortValuesValues = [
  { label: "Values", value: "values" },
  { label: "Absolute", value: "values_absolute" },
  { label: "Accented", value: "values_accented" },
  { label: "Nulls First", value: "values_nulls_first" },
  { label: "Absolute Nulls First", value: "values_absolute_nulls_first" },
  { label: "Accented Nulls First", value: "values_accented_nulls_first" },
];

const sortDirectionValues = [
  { label: "Asc", value: "ascending" },
  { label: "Desc", value: "descending" },
];
