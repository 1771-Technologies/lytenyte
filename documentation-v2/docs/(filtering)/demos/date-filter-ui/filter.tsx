import "@1771technologies/lytenyte-pro-experimental/components.css";
import { Popover, SmartSelect, type Grid } from "@1771technologies/lytenyte-pro-experimental";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";
import type { FilterDateOperator, GridFilter, GridSpec } from "./demo";

function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export function Header({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  const label = column.name ?? column.id;

  const model = api.filterModel.useValue();
  const hasFilter = !!model[column.id];
  return (
    <div className="flex h-full w-full items-center justify-between">
      <div>{label}</div>

      <Popover>
        <Popover.Trigger data-ln-button="secondary" data-ln-icon data-ln-size="sm" className="relative">
          <div className="sr-only">Filter the {label}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentcolor"
            viewBox="0 0 256 256"
          >
            <path d="M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z"></path>
          </svg>
          {hasFilter && <div className="bg-ln-primary-50 absolute right-px top-px size-2 rounded-full" />}
        </Popover.Trigger>
        <Popover.Container>
          <Popover.Arrow />
          <Popover.Title className="sr-only">Filter {label}</Popover.Title>
          <Popover.Description className="sr-only">Filter the numbers in the{label}</Popover.Description>
          <TextFilterControl column={column} filter={model[column.id] ?? null} api={api}></TextFilterControl>
        </Popover.Container>
      </Popover>
    </div>
  );
}

const selectOptions = [
  { id: "equals", label: "Equals" },
  { id: "before", label: "Before" },
  { id: "after", label: "After" },
  { id: "quarter", label: "Quarter" },
  { id: "month", label: "Month" },
];

const monthOptions = [
  { id: "january", label: "January", value: 0 },
  { id: "february", label: "February", value: 1 },
  { id: "march", label: "March", value: 2 },
  { id: "april", label: "April", value: 3 },
  { id: "may", label: "May", value: 4 },
  { id: "june", label: "June", value: 5 },
  { id: "july", label: "July", value: 6 },
  { id: "august", label: "August", value: 7 },
  { id: "september", label: "September", value: 8 },
  { id: "october", label: "October", value: 9 },
  { id: "november", label: "November", value: 10 },
  { id: "december", label: "December", value: 11 },
];

const quarterOptions = [
  { id: "q1", label: "Quarter 1", value: 1 },
  { id: "q2", label: "Quarter 2", value: 2 },
  { id: "q3", label: "Quarter 3", value: 3 },
  { id: "q4", label: "Quarter 4", value: 4 },
];

type DeepPartial<T> = T extends object
  ? {
      -readonly [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

function TextFilterControl({
  api,
  filter: initialFilter,
  column,
}: {
  api: Grid.API<GridSpec>;
  filter: GridFilter | null;
  column: Grid.Column<GridSpec>;
}) {
  const [filter, setFilter] = useState<DeepPartial<GridFilter> | null>(initialFilter);

  const canShowSecond = filter?.right || (filter?.left?.operator && filter.left.value != null);

  const leftValue = selectOptions.find((x) => x.id === filter?.left?.operator) ?? null;
  const rightValue = selectOptions.find((x) => x.id === filter?.right?.operator) ?? null;

  const combineOperator = filter?.operator ?? "AND";

  const canSubmit =
    (filter?.left?.value != null && filter.left?.operator) ||
    (filter?.right?.value != null && filter.right.operator);

  const popoverControls = Popover.useControls();
  return (
    <form
      className="grid grid-cols-1 gap-2 md:grid-cols-2"
      onSubmit={(e) => {
        if (!canSubmit) return;
        e.preventDefault();

        const finalFilter: DeepPartial<GridFilter> = {};
        if (filter?.left?.value != null && filter?.left.operator) finalFilter.left = filter.left;
        if (filter?.right?.value != null && filter?.right.operator) {
          // If the left filter is incomplete then we use the right filter value as the left filter.
          if (!finalFilter.left) {
            finalFilter.left = filter.right;
            finalFilter.right = null;
          } else {
            finalFilter.right = filter.right;
          }
        }

        finalFilter.operator = combineOperator;

        api.filterModel.set((prev) => ({ ...prev, [column.id]: finalFilter as GridFilter }));
        popoverControls.openChange(false);
      }}
    >
      <div className="text-ln-text hidden ps-2 text-sm md:block">Operator</div>
      <div className="text-ln-text hidden ps-2 text-sm md:block">Values</div>

      <SmartSelect
        options={selectOptions}
        value={filter ? (selectOptions.find((x) => x.id === filter?.left?.operator) ?? null) : null}
        onOptionChange={(option) => {
          if (!option) return;

          setFilter((prev) => {
            if (!prev) return { left: { operator: option.id as FilterDateOperator, value: undefined } };

            const value =
              (["month", "quarter"].includes(prev.left?.operator ?? "") &&
                ["equals", "before", "after"].includes(option.id)) ||
              (["month", "quarter"].includes(option.id) &&
                ["equals", "before", "after"].includes(prev.left?.operator ?? ""))
                ? undefined
                : prev.left?.value;

            return {
              ...prev,
              left: { ...prev.left, operator: option.id as FilterDateOperator, value },
            };
          });
        }}
        kind="basic"
        trigger={
          <SmartSelect.BasicTrigger
            type="button"
            data-ln-input
            className="flex min-w-40 cursor-pointer items-center justify-between"
          >
            <div>{leftValue?.label ?? "Select..."}</div>
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

      {filter?.left?.operator === "month" && (
        <SmartSelect
          options={monthOptions}
          value={filter ? (monthOptions.find((x) => x.value === filter?.left?.value) ?? null) : null}
          onOptionChange={(option) => {
            if (!option) return;

            setFilter((prev) => {
              if (!prev) return { left: { value: option.value } };
              return { ...prev, left: { ...prev.left, value: option.value } };
            });
          }}
          kind="basic"
          trigger={
            <SmartSelect.BasicTrigger
              type="button"
              data-ln-input
              className="flex min-w-40 cursor-pointer items-center justify-between"
            >
              <div>{monthOptions.find((x) => x.value === filter.left?.value)?.label ?? "Select..."}</div>
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
      )}
      {filter?.left?.operator === "quarter" && (
        <SmartSelect
          options={quarterOptions}
          value={filter ? (quarterOptions.find((x) => x.value === filter?.left?.value) ?? null) : null}
          onOptionChange={(option) => {
            if (!option) return;

            setFilter((prev) => {
              if (!prev) return { left: { value: option.value } };
              return { ...prev, left: { ...prev.left, value: option.value } };
            });
          }}
          kind="basic"
          trigger={
            <SmartSelect.BasicTrigger
              type="button"
              data-ln-input
              className="flex min-w-40 cursor-pointer items-center justify-between"
            >
              <div>{quarterOptions.find((x) => x.value === filter.left?.value)?.label ?? "Select..."}</div>
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
      )}

      {filter?.left?.operator !== "month" && filter?.left?.operator !== "quarter" && (
        <div>
          <label>
            <span className="sr-only">Value for the first filter</span>
            <input
              disabled={!filter?.left}
              data-ln-input
              value={filter?.left?.value ?? ""}
              className="w-full text-xs"
              type="date"
              onChange={(e) => {
                setFilter((prev) => {
                  if (!prev) return { left: { value: e.target.value } };

                  return { ...prev, left: { ...prev.left, value: e.target.value } };
                });
              }}
            />
          </label>
        </div>
      )}

      {canShowSecond && (
        <>
          <div className="grid grid-cols-2 py-1 md:col-span-2 md:grid-cols-subgrid">
            <label className="flex justify-end gap-2 pe-2">
              <input
                type="radio"
                value="AND"
                name="operator"
                className={tw(
                  "border-ln-gray-40 checked:border-ln-primary-50 h-4 w-4 cursor-pointer select-none appearance-none rounded-full border checked:border-[5px]",
                  "focus-visible:outline-ln-primary-50 focus-visible:outline focus-visible:outline-offset-1",
                )}
                checked={combineOperator === "AND"}
                onChange={() => {
                  setFilter((prev) => {
                    if (!prev) return { operator: "AND" };
                    return { ...prev, operator: "AND" };
                  });
                }}
              />
              <span>And</span>
            </label>
            <label className="flex gap-2 ps-2">
              <input
                type="radio"
                value="OR"
                name="operator"
                className={tw(
                  "border-ln-gray-40 checked:border-ln-primary-50 h-4 w-4 cursor-pointer select-none appearance-none rounded-full border checked:border-[5px]",
                  "focus-visible:outline-ln-primary-50 focus-visible:outline focus-visible:outline-offset-1",
                )}
                checked={combineOperator === "OR"}
                onChange={() => {
                  setFilter((prev) => {
                    if (!prev) return { operator: "OR" };
                    return { ...prev, operator: "OR" };
                  });
                }}
              />
              <span>Or</span>
            </label>
          </div>

          <SmartSelect
            options={selectOptions}
            value={filter ? (selectOptions.find((x) => x.id === filter?.right?.operator) ?? null) : null}
            onOptionChange={(option) => {
              if (!option) return;

              setFilter((prev) => {
                if (!prev) return { right: { operator: option.id as FilterDateOperator } };

                const value =
                  (["month", "quarter"].includes(prev.right?.operator ?? "") &&
                    ["equals", "before", "after"].includes(option.id)) ||
                  (["month", "quarter"].includes(option.id) &&
                    ["equals", "before", "after"].includes(prev.right?.operator ?? ""))
                    ? undefined
                    : prev.right?.value;

                return {
                  ...prev,
                  right: { ...prev.right, operator: option.id as FilterDateOperator, value },
                };
              });
            }}
            kind="basic"
            trigger={
              <SmartSelect.BasicTrigger
                type="button"
                data-ln-input
                className="flex min-w-40 items-center justify-between"
              >
                <div>{rightValue?.label ?? "Select..."}</div>
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
                <SmartSelect.Option key={p.option.id} {...p}>
                  {p.option.label}
                </SmartSelect.Option>
              );
            }}
          </SmartSelect>

          {filter?.right?.operator === "month" && (
            <SmartSelect
              options={monthOptions}
              value={filter ? (monthOptions.find((x) => x.value === filter?.right?.value) ?? null) : null}
              onOptionChange={(option) => {
                if (!option) return;

                setFilter((prev) => {
                  if (!prev) return { right: { value: option.value } };

                  return { ...prev, right: { ...prev.right, value: option.value } };
                });
              }}
              kind="basic"
              trigger={
                <SmartSelect.BasicTrigger
                  type="button"
                  data-ln-input
                  className="flex min-w-40 cursor-pointer items-center justify-between"
                >
                  <div>{monthOptions.find((x) => x.value === filter.right?.value)?.label ?? "Select..."}</div>
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
          )}
          {filter?.right?.operator === "quarter" && (
            <SmartSelect
              options={quarterOptions}
              value={filter ? (quarterOptions.find((x) => x.value === filter?.right?.value) ?? null) : null}
              onOptionChange={(option) => {
                if (!option) return;

                setFilter((prev) => {
                  if (!prev) return { right: { value: option.value } };
                  return { ...prev, right: { ...prev.right, value: option.value } };
                });
              }}
              kind="basic"
              trigger={
                <SmartSelect.BasicTrigger
                  type="button"
                  data-ln-input
                  className="flex min-w-40 cursor-pointer items-center justify-between"
                >
                  <div>
                    {quarterOptions.find((x) => x.value === filter.right?.value)?.label ?? "Select..."}
                  </div>
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
          )}

          {filter?.right?.operator !== "month" && filter?.right?.operator !== "quarter" && (
            <div>
              <label>
                <span className="sr-only">Value for the second filter</span>
                <input
                  disabled={!filter?.right}
                  data-ln-input
                  value={filter?.right?.value ?? ""}
                  className="w-full text-xs"
                  type="date"
                  onChange={(e) => {
                    setFilter((prev) => {
                      if (!prev) return { right: { value: e.target.value } };

                      return { ...prev, right: { ...prev.right, value: e.target.value } };
                    });
                  }}
                />
              </label>
            </div>
          )}
        </>
      )}

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
