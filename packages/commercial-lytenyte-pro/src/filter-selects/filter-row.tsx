import { forwardRef, useCallback, useMemo, type ForwardedRef, type PropsWithChildren } from "react";
import { useFilterSelectRoot } from "./context.js";
import type { FilterSelectFlat } from "./use-filter-select";
import type { SelectOption } from "./operator-select";
import { context } from "./filter-row-context.js";
import {
  dateOptions,
  filterNeedsValue,
  numberOptions,
  operatorsThatAreNumbers,
  operatorToOption,
  stringOptions,
} from "./options.js";

export interface SelectSlotProps {
  readonly options: SelectOption[];
  readonly value: SelectOption | null;
  readonly onChange: (v: SelectOption) => void;
}

export interface FilterRowProps {
  readonly filter: FilterSelectFlat;
}

function FilterRowImpl(
  { filter, children }: PropsWithChildren<FilterRowProps>,
  forwarded: ForwardedRef<HTMLDivElement>,
) {
  const ctx = useFilterSelectRoot();

  const index = ctx.filters.indexOf(filter);
  const isLast = ctx.filters.at(-1) === filter;

  if (index === -1) throw new Error("Filter should be defined among the root filters.");

  const onOperatorChange = useCallback(
    (opt: SelectOption) => {
      ctx.setFilters((prev) => {
        const next = [...prev];
        const filter = next[index];

        if (filter.kind === "function") return prev;

        next[index] = {
          ...filter,
          operator: opt.value as any,
        };

        return next;
      });
    },
    [ctx, index],
  );

  const options = useMemo(() => {
    if (filter.kind === "function") return [];
    if (filter.kind === "number") return numberOptions;
    if (filter.kind === "date") return dateOptions;
    return stringOptions;
  }, [filter.kind]);

  const operatorValue = useMemo<SelectOption>(() => {
    if (filter.kind === "function") return { value: "-", label: "-" };

    return operatorToOption[filter.operator ?? "equals"];
  }, [filter]);

  const value = useMemo(() => {
    if (filter.kind === "function") return null;

    return filter.value;
  }, [filter]);

  const onValueChange = useCallback(
    (v: string | number | null) => {
      if (filter.kind === "function") return;

      ctx.setFilters((prev) => {
        const next = [...prev];
        const filter = next[index];

        if (filter.kind === "function") return prev;

        if (filter.kind === "number") {
          next[index] = {
            ...filter,
            value:
              filter.operator === "not_equals" || filter.operator === "equals"
                ? typeof v === "number"
                  ? v
                  : !v
                    ? null
                    : Number.parseFloat(v)
                : typeof v === "number"
                  ? v
                  : Number.parseFloat(v ?? ""),
          };

          return next;
        }
        const isNumber = operatorsThatAreNumbers.has(filter.operator!);

        next[index] = {
          ...filter,
          value: isNumber ? (typeof v === "number" ? v : Number.parseFloat(v!)) : v,
        };

        return next;
      });
    },
    [ctx, filter.kind, index],
  );

  const extenderValue = useMemo(() => {
    return filter.kind == "function" ? null : (filter.nextExtender ?? "AND");
  }, [filter]);
  const onExtenderChange = useCallback(
    (v: "AND" | "OR" | null) => {
      ctx.setFilters((prev) => {
        const next = [...prev];
        const filter = next[index];

        if (filter.kind === "function") return prev;

        next[index] = {
          ...filter,
          nextExtender: v,
        };

        return next;
      });
    },
    [ctx, index],
  );

  const showExtender = useMemo(() => {
    if (filter.kind === "function") return false;

    // If the filter isn't the last one then show the extender
    if (!isLast) return true;

    if (filter.operator != null && filter.value != null && index + 1 < ctx.maxCount) return true;

    return false;
  }, [ctx.maxCount, filter, index, isLast]);

  return (
    <context.Provider
      value={{
        filter,

        extender: extenderValue,
        onExtenderChange,
        showExtender: showExtender,

        operatorOnChange: onOperatorChange,
        operatorOptions: options,
        operatorValue: operatorValue,

        value,
        onValueChange,

        isNumberInput:
          filter.kind === "function"
            ? false
            : filter.kind === "number" || operatorsThatAreNumbers.has(filter.operator!),
        filterHasNoValue: filter.kind === "function" || filterNeedsValue.has(filter.operator!),
        valueDisabled: filter.kind === "function" || !filter.operator,
      }}
    >
      <div ref={forwarded}>{children}</div>
    </context.Provider>
  );
}

export const FilterRow = forwardRef(FilterRowImpl);
