import "@1771technologies/lytenyte-pro/components.css";
import { type Grid } from "@1771technologies/lytenyte-pro";
import { CaretRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";
import type { GridFilter, GridSpec } from "./demo";
import { Menu, Popover } from "@1771technologies/lytenyte-pro/components";

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
  { id: "separator-1", selectable: false },
  { id: "before", label: "Before" },
  { id: "after", label: "After" },
  { id: "between", label: "After" },
  { id: "separator-2", selectable: false },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "separator-3", selectable: false },
  { id: "next_week", label: "Next Week" },
  { id: "this_week", label: "This Week" },
  { id: "last_week", label: "Last Week" },
  { id: "separator-4", selectable: false },
  { id: "next_month", label: "Next Month" },
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "separator-5", selectable: false },
  { id: "next_quarter", label: "Next Quarter" },
  { id: "this_quarter", label: "This Quarter" },
  { id: "last_quarter", label: "Last Quarter" },
  { id: "separator-6", selectable: false },
  { id: "next_year", label: "Next Year" },
  { id: "this_year", label: "This Year" },
  { id: "last_year", label: "Last Year" },
  { id: "separator-7", selectable: false },
  { id: "year_to_date", label: "Year to Date" },
  { id: "separator-8", selectable: false },
  { id: "all_dates_in_the_period", label: "All Dates in the Period" },
];

const periodOptions: Record<string, string> = {
  q1: "Quarter 1",
  q2: "Quarter 2",
  q3: "Quarter 3",
  q4: "Quarter 4",
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
};

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

  const leftOperator = filter?.left?.operator;
  const rightOperator = filter?.right?.operator;

  const showInput = leftOperator === "equals" || leftOperator === "after" || leftOperator === "before";

  const leftValue =
    selectOptions.find((x) => typeof x !== "string" && x.id === filter?.left?.operator) ?? null;
  const rightValue =
    selectOptions.find((x) => typeof x !== "string" && x.id === filter?.right?.operator) ?? null;

  const combineOperator = filter?.operator ?? "AND";
  const canShowSecond = leftOperator === "before" && rightOperator === "after";

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
      <div className="text-ln-text hidden ps-2 text-sm md:block">{showInput && "Values"}</div>

      <Menu>
        <Menu.Trigger
          data-ln-input
          className={tw(
            "flex min-w-40 cursor-pointer items-center justify-between",
            !showInput && "col-span-2",
          )}
          type="button"
        >
          <div>
            {leftOperator === "all_dates_in_the_period"
              ? `All dates in ${periodOptions[filter?.left?.value ?? ""]}`
              : (leftValue?.label ?? "Select...")}
          </div>
          <div>
            <ChevronDownIcon />
          </div>
        </Menu.Trigger>
        <Menu.Popover>
          <Menu.Container className="min-w-(--ln-anchor-width)">
            <Menu.Item
              onAction={() => {
                if (leftOperator === "equals") return;
                setFilter({ left: { operator: "equals" } });
              }}
            >
              Equals
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onAction={() => {
                if (leftOperator === "before") return;
                setFilter({ left: { operator: "before" } });
              }}
            >
              Before
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                if (leftOperator === "after") return;
                setFilter({ left: { operator: "after" } });
              }}
            >
              After
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                if (leftOperator === "before" && rightOperator === "after") return;
                setFilter({ left: { operator: "before" }, right: { operator: "after" } });
              }}
            >
              Between
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "tomorrow", value: "" } });
              }}
            >
              Tomorrow
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "today", value: "" } });
              }}
            >
              Today
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "yesterday", value: "" } });
              }}
            >
              Yesterday
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "next_week", value: "" } });
              }}
            >
              Next Week
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "this_week", value: "" } });
              }}
            >
              This Week
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "last_week", value: "" } });
              }}
            >
              Last Week
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "next_month", value: "" } });
              }}
            >
              Next Month
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "this_month", value: "" } });
              }}
            >
              This Month
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "last_month", value: "" } });
              }}
            >
              Last Month
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "next_quarter", value: "" } });
              }}
            >
              Next Quarter
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "this_quarter", value: "" } });
              }}
            >
              This Quarter
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "last_quarter", value: "" } });
              }}
            >
              Last Quarter
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "next_year", value: "" } });
              }}
            >
              Next Year
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "this_year", value: "" } });
              }}
            >
              This Year
            </Menu.Item>
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "last_year", value: "" } });
              }}
            >
              Last Year
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onAction={() => {
                setFilter({ left: { operator: "year_to_date", value: "" } });
              }}
            >
              Year to Date
            </Menu.Item>
            <Menu.Divider />
            <Menu.Submenu>
              <Menu.SubmenuTrigger className="flex items-center justify-between gap-2">
                <div>All Dates in the Period</div>
                <CaretRightIcon />
              </Menu.SubmenuTrigger>
              <Menu.SubmenuContainer>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "q1" } })}
                >
                  Quarter 1
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "q2" } })}
                >
                  Quarter 2
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "q3" } })}
                >
                  Quarter 3
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "q4" } })}
                >
                  Quarter 4
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "jan" } })}
                >
                  January
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "feb" } })}
                >
                  February
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "mar" } })}
                >
                  March
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "apr" } })}
                >
                  April
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "may" } })}
                >
                  May
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "jun" } })}
                >
                  June
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "jul" } })}
                >
                  July
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "aug" } })}
                >
                  August
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "sep" } })}
                >
                  September
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "oct" } })}
                >
                  October
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "nov" } })}
                >
                  November
                </Menu.Item>
                <Menu.Item
                  onAction={() => setFilter({ left: { operator: "all_dates_in_the_period", value: "dev" } })}
                >
                  December
                </Menu.Item>
              </Menu.SubmenuContainer>
            </Menu.Submenu>
          </Menu.Container>
        </Menu.Popover>
      </Menu>

      {showInput && (
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

          <button disabled type="button" data-ln-input className="flex min-w-40 items-center justify-between">
            <div>{rightValue?.label ?? "Select..."}</div>
          </button>

          <div>
            <label>
              <span className="sr-only">Value for the second filter</span>
              <input
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
