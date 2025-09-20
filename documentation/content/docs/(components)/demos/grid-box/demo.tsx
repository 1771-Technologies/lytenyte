"use client";

import {
  useClientRowDataSource,
  Grid,
  GridBox,
} from "@1771technologies/lytenyte-pro";
import { Popover as P } from "radix-ui";
import "@1771technologies/lytenyte-pro/grid.css";
import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  DragDotsSmallIcon,
  GroupByColIcon,
} from "@1771technologies/lytenyte-pro/icons";
import type {
  Column,
  Grid as GridType,
} from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

export default function GridBoxApp() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    rowGroupModel: ["job", "education"],

    rowGroupColumn: {
      cellRenderer: ({ grid, row, column }) => {
        if (!grid.api.rowIsGroup(row)) return null;

        const field = grid.api.columnField(column, row);
        const isExpanded = grid.api.rowGroupIsExpanded(row);

        return (
          <div
            className="flex items-center gap-2 w-full h-full"
            style={{ paddingLeft: row.depth * 16 }}
          >
            <button
              className="flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                grid.api.rowGroupToggle(row);
              }}
            >
              {!isExpanded && <ChevronRightIcon />}
              {isExpanded && <ChevronDownIcon />}
            </button>

            <div>{`${field}`}</div>
          </div>
        );
      },
    },

    columnBase: {
      uiHints: {
        rowGroupable: true,
      },
    },
  });

  const view = grid.view.useValue();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="px-4 py-1"></div>
      <GroupPills grid={grid} />
      <div className="lng-grid" style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return null;

                      return (
                        <Grid.HeaderCell
                          key={c.id}
                          cell={c}
                          className="flex w-full h-full capitalize px-2 items-center"
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            className="text-sm flex items-center px-2 h-full w-full"
                          />
                        );
                      })}
                    </Grid.Row>
                  );
                })}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </div>
    </div>
  );
}

export function GroupPills({ grid }: { grid: GridType<any> }) {
  const { rootProps, items } = GridBox.useRowGroupBoxItems({
    grid,
    orientation: "horizontal",
    hideColumnOnGroup: true,
  });

  return (
    <div className="h-12 w-full bg-ln-gray-20 border-y border-y-ln-gray-30 grid grid-cols-[32px_calc(100%-32px-30px)_30px] md:grid-cols-[112px_calc(100%-112px-30px)_30px]">
      <div className="grid grid-cols-[32px] md:grid-cols-[32px_80px] items-center h-full border-r border-r-ln-gray-30">
        <div className="flex w-full h-full items-center justify-center text-ln-gray-70">
          <GroupByColIcon />
        </div>
        <div className="hidden md:block text-ln-gray-80">Groups</div>
      </div>

      <div>
        <GridBox.Root {...rootProps}>
          <GridBox.Panel className="pills flex items-center h-full overflow-x-auto flex-1 no-scrollbar bg-ln-gray-05 text-ln-gray-80">
            {items.map((c) => {
              return (
                <GridBox.Item
                  key={c.id}
                  item={c}
                  className="h-full"
                  itemClassName={
                    "px-2 py-1 h-full cursor-grab flex items-center"
                  }
                >
                  <div className="flex text-sm items-center gap-2 text-nowrap bg-ln-pill-group-fill border border-ln-pill-group-stroke rounded p-1 pr-2">
                    <DragDotsSmallIcon />
                    <div>{c.label}</div>

                    <button
                      className="flex items-center justify-center"
                      onClick={(e) => c.onDelete(e.currentTarget)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </GridBox.Item>
              );
            })}
          </GridBox.Panel>
        </GridBox.Root>
      </div>

      <div className="flex items-center justify-between border-l border-ln-gray-30">
        <ColumnPicker grid={grid} />
      </div>
    </div>
  );
}

function ColumnPicker({ grid }: { grid: GridType<any> }) {
  const { rootProps, items } = GridBox.useColumnBoxItems({
    grid,
    onAction: ({ column: c }) => {
      const isGrouped = !!model.find((x) => x === c.id);

      if (!isGrouped) {
        grid.state.rowGroupModel.set((prev) => {
          return [...prev, c.id];
        });
      } else {
        grid.state.rowGroupModel.set((prev) => {
          return prev.filter((x) => x !== c.id);
        });
      }
    },
    itemFilter: (c) => {
      return !!(
        c.uiHints?.rowGroupable ??
        grid.state.columnBase.get().uiHints?.rowGroupable
      );
    },
    orientation: "vertical",
  });

  const model = grid.state.rowGroupModel.useValue();

  return (
    <P.Root>
      <P.Trigger className="w-full h-full flex items-center justify-center hover:bg-[var(--lng1771-gray-20)] border-[var(--lng1771-gray-30)] border-x transition-all disabled:text-[var(--lng1771-gray-40)] disabled:bg-[var(--lng1771-gray-10)] text-ln-gray-70">
        <AddIcon />
      </P.Trigger>
      <P.Portal>
        <P.Content className="bg-ln-gray-05 border-ln-gray-30 border z-50 rounded h-[200px] w-[200px] overflow-auto">
          <GridBox.Root {...rootProps}>
            <GridBox.Panel>
              {items.map((c) => {
                return (
                  <GridBox.Item key={c.id} item={c}>
                    <div className="flex items-center px-2 text-sm text-ln-gray-70 gap-2 py-1 hover:bg-ln-gray-30">
                      <input
                        type="checkbox"
                        onChange={() => {}}
                        checked={!!model.find((x) => x === c.id)}
                        className="rounded-sm"
                      />
                      <div>{c.label}</div>
                    </div>
                  </GridBox.Item>
                );
              })}
            </GridBox.Panel>
          </GridBox.Root>
          <P.Arrow fill="var(--lng1771-gray-30)" />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
