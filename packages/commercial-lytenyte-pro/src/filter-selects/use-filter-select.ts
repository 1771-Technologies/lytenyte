import { useCallback, useMemo } from "react";
import type {
  Column,
  FilterCombination,
  FilterDateOperator,
  FilterNumberOperator,
  FilterStringOperator,
  Grid,
} from "../+types";
import { useTwoFlowState } from "@1771technologies/lytenyte-core/yinternal";
import { isCompleteFilter } from "./is-complete-filter.js";
import { toFilterItem } from "./to-filter-item.js";

export interface UseFilterSelectParams<T> {
  readonly grid: Grid<T>;
  readonly column: Column<T>;
  readonly maxCount?: number;
}

export type FilterSelectFlatFunc = { kind: "function"; func: any };
export type FilterSelectFlatNumber = {
  kind: "number";
  operator?: FilterNumberOperator;
  value?: string | number | null;
  nextExtender?: null | "AND" | "OR";
};
export type FilterSelectFlatString = {
  kind: "string";
  operator?: FilterStringOperator;
  value?: string | number | null;
  nextExtender?: null | "AND" | "OR";
};
export type FilterSelectFlatDate = {
  kind: "date";
  operator?: FilterDateOperator;
  value?: string | number | null;
  nextExtender?: null | "AND" | "OR";
};

export type FilterSelectFlat =
  | FilterSelectFlatFunc
  | FilterSelectFlatNumber
  | FilterSelectFlatString
  | FilterSelectFlatDate;

export const useFilterSelect = <T>({ grid, column, maxCount = 2 }: UseFilterSelectParams<T>) => {
  const model = grid.state.filterModel.useValue();

  const filterOnModel = model[column.id];

  const defaultFilter = useMemo<FilterSelectFlat>(() => {
    if (column.type === "date" || column.type === "datetime")
      return { kind: "date", operator: "equals" };
    if (column.type === "number") return { kind: "number", operator: "equals" };
    return { kind: "string", operator: "equals" };
  }, [column.type]);

  const filterValue = useMemo<FilterSelectFlat[]>(() => {
    if (filterOnModel) {
      if (filterOnModel.kind === "func") return [{ kind: "function", func: filterOnModel.func }];

      if (filterOnModel.kind === "number")
        return [{ kind: "number", value: filterOnModel.value, operator: filterOnModel.operator }];
      if (filterOnModel.kind === "string")
        return [{ kind: "string", value: filterOnModel.value, operator: filterOnModel.operator }];
      if (filterOnModel.kind === "date")
        return [{ kind: "date", value: filterOnModel.value, operator: filterOnModel.operator }];

      if (filterOnModel.kind === "combination") {
        const filters: FilterSelectFlat[] = [];
        const stack = [...filterOnModel.filters.map((c) => [filterOnModel.operator, c] as const)];

        while (stack.length) {
          const [nextExtender, f] = stack.shift()!;

          if (f.kind === "combination") {
            stack.push(...f.filters.map((c) => [f.operator, c] as const));
          } else if (f.kind === "string") {
            filters.push({ kind: "string", operator: f.operator, value: f.value, nextExtender });
          } else if (f.kind === "number") {
            filters.push({ kind: "number", operator: f.operator, value: f.value, nextExtender });
          } else if (f.kind === "date") {
            filters.push({ kind: "date", operator: f.operator, value: f.value, nextExtender });
          }
        }

        return filters;
      }

      return [];
    }

    return [defaultFilter];
  }, [filterOnModel, defaultFilter]);

  const [filters, setFilters] = useTwoFlowState(filterValue);

  const finalFilters = useMemo(() => {
    if (!filters.length) return [defaultFilter];
    const last = filters.at(-1)!;

    if (last.kind === "function" || filters.length >= maxCount) return filters;

    if (last.operator == undefined || last.value == null) return filters;

    return [...filters, defaultFilter];
  }, [defaultFilter, filters, maxCount]);

  const reset = useCallback(() => {
    return setFilters([defaultFilter]);
  }, [defaultFilter, setFilters]);

  const apply = useCallback(() => {
    const fn = finalFilters.find((c) => c.kind === "function");
    if (fn) {
      grid.state.filterModel.set((prev) => {
        const next = { ...prev };
        next[column.id] = { kind: "func", func: fn.func };
        return prev;
      });

      return;
    }

    const filters = finalFilters.filter((c) => isCompleteFilter(c)) as (
      | FilterSelectFlatDate
      | FilterSelectFlatString
      | FilterSelectFlatNumber
    )[];

    if (filters.length === 1) {
      const filter = filters[0];

      if (!isCompleteFilter(filter)) {
        grid.state.filterModel.set((prev) => {
          const filters = { ...prev };
          delete filters[column.id];
          return filters;
        });
        return;
      }

      let next: FilterCombination["filters"][number] | null = null;
      if (filter.kind === "date")
        next = { kind: "date", value: filter.value!, operator: filter.operator! };
      else if (filter.kind === "number")
        next = { kind: "number", value: filter.value! as number, operator: filter.operator! };
      else if (filter.kind === "string")
        next = { kind: "string", value: filter.value! as string, operator: filter.operator! };

      if (next) {
        console.log(next);
        grid.state.filterModel.set((prev) => {
          const filters = { ...prev };
          filters[column.id] = next;
          return filters;
        });
      }

      return;
    }

    const combinedFilters: FilterCombination["filters"][number][] = [];

    let i = 0;
    while (i < filters.length) {
      const filter = filters[i];

      if ((filter.nextExtender ?? "AND") === "AND") {
        const ors = [filter];
        while (i + 1 < filters.length) {
          const next = filters[i + 1];

          ors.push(next);
          i++;

          if ((next.nextExtender ?? "AND") !== "AND" || i + 1 >= filters.length) break;
        }

        if (ors.length > 1) {
          combinedFilters.push({
            kind: "combination",
            filters: ors.map(toFilterItem),
            operator: "AND",
          });
        } else {
          combinedFilters.push(toFilterItem(ors[0]));
        }
      } else {
        combinedFilters.push(toFilterItem(filter));
      }
      i++;
    }

    grid.state.filterModel.set((prev) => {
      if (combinedFilters.length === 0) {
        const filters = { ...prev };
        delete filters[column.id];
        return filters;
      }

      if (combinedFilters.length === 1) {
        const filters = { ...prev };
        filters[column.id] = combinedFilters[0];
        return filters;
      }

      const filters = { ...prev };
      filters[column.id] = { kind: "combination", filters: combinedFilters, operator: "OR" };
      return filters;
    });

    return;
  }, [column.id, finalFilters, grid.state.filterModel]);

  const setF = useCallback(
    (v: FilterSelectFlat[] | ((v: FilterSelectFlat[]) => FilterSelectFlat[])) => {
      const next = typeof v === "function" ? v(finalFilters) : v;

      setFilters(next);
    },
    [finalFilters, setFilters],
  );

  const clear = useCallback(() => {
    setF([]);

    grid.state.filterModel.set((prev) => {
      const filters = { ...prev };
      delete filters[column.id];
      return filters;
    });
  }, [column.id, grid.state.filterModel, setF]);

  return useMemo(
    () => ({
      reset,
      apply,
      clear,
      defaultFilter,
      filters: finalFilters,
      setFilters: setF,
      maxCount,
    }),
    [apply, clear, defaultFilter, finalFilters, maxCount, reset, setF],
  );
};
