import "@1771technologies/lytenyte-pro/components.css";
import { type Grid } from "@1771technologies/lytenyte-pro";
import type { GridSpec } from "./demo";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { GridFilter } from "./types";
import clsx from "clsx";
import { Popover, SmartSelect } from "@1771technologies/lytenyte-pro/components";

const textOptions = [
  { id: "equals", label: "Equals" },
  { id: "not_equals", label: "Does Not Equal" },
  { id: "less_than", label: "Less Than" },
  { id: "greater_than", label: "Greater Than" },
  { id: "contains", label: "Contains" },
];

const dateOptions = [
  { id: "before", label: "Before" },
  { id: "after", label: "After" },
];

type DeepPartial<T> = T extends object
  ? {
      -readonly [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export function TextFilterControl({
  api,
  filter: initialFilter,
  column,
}: {
  api: Grid.API<GridSpec>;
  filter: GridFilter | null;
  column: Grid.Column<GridSpec>;
}) {
  const inputType = column.type === "date" ? "date" : "text";
  const options = column.type === "date" ? dateOptions : textOptions;

  const [filter, setFilter] = useState<DeepPartial<GridFilter> | null>(initialFilter);

  const canSubmit = filter?.value && filter.operator;

  const filterValue = options.find((x) => x.id === filter?.operator);

  const popoverControls = Popover.useControls();
  return (
    <form
      className="grid grid-cols-1 gap-2 md:grid-cols-2"
      onSubmit={(e) => {
        if (!canSubmit) return;
        e.preventDefault();

        api.filterModel.set((prev) => ({ ...prev, [column.id]: filter as GridFilter }));
        popoverControls.openChange(false);
      }}
    >
      <div className="text-ln-text hidden ps-2 text-sm md:block">Operator</div>
      <div className="text-ln-text hidden ps-2 text-sm md:block">Values</div>

      <SmartSelect
        options={options}
        value={filter ? (textOptions.find((x) => x.id === filter.operator) ?? null) : null}
        onOptionChange={(option) => {
          if (!option) return;

          setFilter((prev) => {
            return { ...prev, kind: inputType, operator: option.id } as GridFilter;
          });
        }}
        kind="basic"
        trigger={
          <SmartSelect.BasicTrigger
            type="button"
            data-ln-input
            className="flex min-w-40 cursor-pointer items-center justify-between"
          >
            <div>{filterValue?.label ?? "Select..."}</div>
            <div>
              <ChevronDownIcon />
            </div>
          </SmartSelect.BasicTrigger>
        }
      >
        {(p) => {
          if (p.option.id.startsWith("separator")) {
            return <div role="separator" className="bg-ln-gray-40 my-1 h-px w-full" />;
          }

          return (
            <SmartSelect.Option key={p.option.id} {...p} className="flex items-center justify-between">
              {p.option.label}
              {p.selected && <CheckIcon className="text-ln-primary-50" />}
            </SmartSelect.Option>
          );
        }}
      </SmartSelect>

      <div>
        <label>
          <span className="sr-only">Value for the first filter</span>
          <input
            data-ln-input
            value={filter?.value ?? ""}
            className={clsx("w-full", inputType === "date" && "text-xs")}
            type={inputType}
            onChange={(e) => {
              setFilter((prev) => {
                return { ...prev, kind: inputType, value: e.target.value } as GridFilter;
              });
            }}
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 md:col-span-2 md:grid md:grid-cols-subgrid">
        <div className="pt-2">
          <button
            data-ln-button="tertiary"
            data-ln-size="sm"
            type="button"
            className="hover:bg-ln-gray-30"
            onClick={() => popoverControls.openChange(false)}
          >
            Cancel
          </button>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            data-ln-button="secondary"
            data-ln-size="sm"
            type="button"
            className="hover:bg-ln-bg-button-light"
            onClick={() => {
              api.filterModel.set((prev) => {
                const next = { ...prev };
                delete next[column.id];

                return next;
              });
              popoverControls.openChange(false);
            }}
          >
            Clear
          </button>
          <button data-ln-button="primary" data-ln-size="sm" disabled={!canSubmit}>
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
}
