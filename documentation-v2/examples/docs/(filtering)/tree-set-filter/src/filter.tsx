import "@1771technologies/lytenyte-pro/components.css";
import { Popover, TreeView, type Grid } from "@1771technologies/lytenyte-pro";
import { compareDesc, getDate, getMonth, getYear } from "date-fns";
import { data } from "./data.js";
import type { GridSpec } from "./demo.jsx";
import { useState } from "react";

const monthToName = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

export const saleDateItems = [...new Set(data.map((x) => x.saleDate))].sort(compareDesc).map((x) => ({
  id: x,
  name: String(getDate(x)),
  path: [String(getYear(x)), monthToName[getMonth(x) as keyof typeof monthToName]],
}));

export function Header({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  const label = column.name ?? column.id;

  const model = api.filterModel.useValue();
  const hasFilter = model[column.id];
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
          <TreeSetFilter api={api} column={column} />
        </Popover.Container>
      </Popover>
    </div>
  );
}

function TreeSetFilter({ api, column }: { api: Grid.API<GridSpec>; column: Grid.Column<GridSpec> }) {
  const model = api.filterModel.useValue();
  const expansions = api.treeSetExpansions.useValue();
  const [rowSelection, setRowSelection] = useState<Grid.T.RowSelectionLinked>(
    model[column.id] ?? { kind: "linked", selected: true, children: new Map() },
  );

  const popoverControls = Popover.useControls();
  return (
    <div>
      <div className="bg-ln-bg-ui-panel border-ln-border-strong rounded-lg border p-2">
        <div className="h-75 w-75">
          <TreeView
            items={saleDateItems}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            rowGroupExpansions={expansions[column.id] ?? {}}
            onRowGroupExpansionChange={(change) => {
              api.treeSetExpansions.set((prev) => {
                return { ...prev, [column.id]: change };
              });
            }}
          />
        </div>
      </div>

      <div className="border-ln-border-strong -mx-4 mt-2 flex items-center justify-between gap-4 border-t px-4 pt-4">
        <div>
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
        <div className="flex justify-end gap-2">
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
          <button
            data-ln-button="primary"
            data-ln-size="sm"
            onClick={() => {
              api.filterModel.set((prev) => {
                if (rowSelection.children.size === 0 && rowSelection.selected === true) {
                  const next = { ...prev };
                  delete next[column.id];

                  return next;
                }

                return { ...prev, [column.id]: rowSelection };
              });
              popoverControls.openChange(false);
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
