import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type {
  ColumnFilterModelReact,
  ColumnFilterReact,
} from "@1771technologies/grid-types/enterprise-react";
import { useDebounced, useEvent } from "@1771technologies/react-utils";
import { useEffect, useState, type ChangeEvent } from "react";

interface FloatingFilterInputArgs<D> {
  readonly api: ApiEnterpriseReact<D>;
  readonly filter: ColumnFilterReact<D> | null | undefined;
  readonly column: ColumnEnterpriseReact<D>;
}

export function useFloatingFilterInput<D>({ api, column, filter }: FloatingFilterInputArgs<D>) {
  const isEqualFilter =
    filter &&
    !(filter.kind === "combined" || filter.kind === "function") &&
    filter.operator === "equal";
  const [value, setValue] = useState(() => {
    if (!isEqualFilter) return "";

    return String(filter.value);
  });

  // Keep the filter value in sync with possible external changes
  useEffect(() => {
    setValue(isEqualFilter ? String(filter.value) : "");
  }, [filter, isEqualFilter]);

  const disabled = !!(filter && !isEqualFilter);

  const onFilterChange = useDebounced(
    useEvent((ev: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const textValue = ev.target.value;

      let value;
      if (column.type === "number") value = Number.parseFloat(textValue);
      else if (column.type === "date") value = textValue;
      else value = textValue;

      let nextColumnFilter;
      if (value && !Number.isNaN(value)) {
        if (column.type === "number") {
          nextColumnFilter = {
            columnId: column.id,
            kind: "number",
            operator: "equal",
            value: value as number,
          } satisfies ColumnFilterReact<D>;
        } else if (column.type === "date") {
          nextColumnFilter = {
            columnId: column.id,
            kind: "date",
            operator: "equal",
            datePeriod: null,
            value: value as string,
          } satisfies ColumnFilterReact<D>;
        } else {
          nextColumnFilter = {
            columnId: column.id,
            kind: "text",
            operator: "equal",
            value: value as string,
          } satisfies ColumnFilterReact<D>;
        }
      }

      const sx = api.getState();
      const currentFilters = sx.filterModel.peek();
      const nextFilter: ColumnFilterModelReact<D> = {
        ...currentFilters,
        [column.id]: {
          ...currentFilters[column.id],
          simple: nextColumnFilter,
        },
      };

      console.log(nextFilter);

      sx.filterModel.set(nextFilter);
    }),
    200,
  );

  const onChange = useEvent((ev: ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value);
    onFilterChange(ev);
  });

  const type = column.type === "date" ? "date" : column.type === "number" ? "number" : "text";

  return { value, disabled, onChange, type };
}
