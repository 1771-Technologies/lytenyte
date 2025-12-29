import { useMemo, type Dispatch, type SetStateAction } from "react";
import type { Option, SortItem } from "../+types.js";
import type { Grid } from "../../+types";
import { useSortableColumnItems } from "./use-sortable-column-items.js";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-shared";

export interface SortRowItem {
  readonly isCustom: boolean;

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

export function useSortRowItems(
  sortItems: SortItem[],
  setSortItems: Dispatch<SetStateAction<SortItem[]>>,
  grid: Grid<any>,
  pivotMode: boolean,
) {
  const columnItems = useSortableColumnItems(grid, pivotMode);

  const pivotColumns = grid.state.columnPivotColumns.useValue();
  const columns = grid.state.columns.useValue();

  const lookup = useMemo(() => {
    return itemsWithIdToMap(pivotMode ? pivotColumns : columns);
  }, [columns, pivotColumns, pivotMode]);

  const unselectedSortedColumns = useMemo(() => {
    const selected = new Set(sortItems.map((c) => c.columnId).filter((c) => c != null));

    return columnItems.filter((c) => !selected.has(c.value));
  }, [columnItems, sortItems]);

  const sortRows = useMemo<SortRowItem[]>(() => {
    return sortItems.map((item, i) => {
      const columnItem = columnItems.find((s) => item.columnId === s.value) ?? null;
      const columnOptions = columnItem ? [columnItem, ...unselectedSortedColumns] : unselectedSortedColumns;

      // Handle select
      const columnOnSelect = (column: { value: string; label: string } | null) => {
        setSortItems((prev) => {
          const v = { ...prev[i] };
          v.columnId = column?.value;
          const next = [...prev];
          next.splice(i, 1, v);

          return next;
        });
      };

      const columnSelected = columnItem;
      const column = lookup.get(item.columnId!);

      let sortOptions: Option[];
      if (!column) sortOptions = [];
      else if (column?.type === "number") sortOptions = sortValuesForNumber;
      else if (column?.type === "date") sortOptions = sortValuesForDateAndDateTime;
      else sortOptions = sortValuesString;

      const sortSelected = sortOptions.find((v) => v.value === item.sortOn) ?? null;

      const sortOnSelect = (sortOn: { value: string; label: string } | null) => {
        if (!sortOn) return;
        setSortItems((prev) => {
          const v = { ...prev[i] };
          v.sortOn = sortOn!.value as SortItem["sortOn"];
          const next = [...prev];

          next.splice(i, 1, v);
          return next;
        });
      };

      const sortDirectionOptions = sortDirectionValues;
      const sortDirectionSelected =
        item.sortDirection === "ascending"
          ? { label: "Asc", value: "ascending" }
          : { label: "Desc", value: "descending" };

      const sortDirectionOnSelect = (item: { value: string; label: string } | null) => {
        if (!item) return;
        setSortItems((prev) => {
          const v = { ...prev[i] };
          v.sortDirection = item!.value as SortItem["sortDirection"];
          const next = [...prev];
          next.splice(i, 1, v);

          return next;
        });
      };

      const onDelete = () => {
        setSortItems((prev) => {
          const next = [...prev];
          next.splice(i, 1);

          if (!next.length) {
            return [{ sortDirection: "ascending", isCustom: false }];
          }

          return next;
        });
      };
      const onAdd = () => {
        setSortItems((prev) => {
          const next = [...prev];
          next.splice(i + 1, 0, { sortDirection: "ascending", isCustom: false });
          return next;
        });
      };

      const maxSortCount = columnItems.length;

      return {
        index: i,
        isCustom: item.isCustom,
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
        canAdd: maxSortCount > sortItems.length,
        onAdd,
        onDelete,
      };
    });
  }, [columnItems, lookup, setSortItems, sortItems, unselectedSortedColumns]);

  return sortRows;
}

const sortValuesForNumber = [
  { label: "Values", value: "values" },
  { label: "Absolute", value: "values_absolute" },
  { label: "Nulls First", value: "values_nulls_first" },
  { label: "Nulls First, Absolute", value: "values_nulls_first_absolute" },
];

const sortValuesForDateAndDateTime = [
  { label: "Values", value: "values" },
  { label: "Nulls First", value: "values_nulls_first" },
];

const sortValuesString = [
  { label: "Values", value: "values" },

  { label: "Insensitive", value: "values_insensitive" },
  { label: "Insensitive, Ignore Punctuation", value: "values_insensitive_ignore" },
  { label: "Insensitive, Trim", value: "values_insensitive_trim" },
  { label: "Insensitive, Ignore Punctuation, Trim", value: "values_insensitive_ignore_trim" },

  { label: "Ignore Punctuation", value: "values_ignore" },
  { label: "Ignore Punctuation, Trim", value: "values_ignore_trim" },

  { label: "Trim Whitespace", value: "values_trim" },
  { label: "Nulls First", value: "values_nulls_first" },
  { label: "Nulls First, Insensitive", value: "values_nulls_first_insensitive" },
  { label: "Nulls First, Trim", value: "values_nulls_first_trim" },
  { label: "Nulls First, Ignore Punctuation", value: "values_nulls_first_ignore" },
  { label: "Nulls First, Insensitive, Trim", value: "values_nulls_first_insensitive_trim" },
  {
    label: "Nulls First, Insensitive, Ignore Punctuation",
    value: "values_nulls_first_insensitive_ignore",
  },
  {
    label: "Nulls First, Insensitive, Ignore Punctuation, Trim",
    value: "values_nulls_first_insensitive_ignore_trim",
  },
  { label: "Nulls First, Ignore Punctuation, Trim", value: "values_nulls_first_ignore_trim" },
];

const sortDirectionValues = [
  { label: "Asc", value: "ascending" },
  { label: "Desc", value: "descending" },
];
