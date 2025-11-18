"use client";

import { useClientRowDataSource, Grid, GridBox } from "@1771technologies/lytenyte-pro";
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
import type { Column, Grid as GridType } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
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
  { id: "poutcome", name: "P Outcome" },
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
            className="flex h-full w-full items-center gap-2"
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
                          className="flex h-full w-full items-center px-2 capitalize"
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
                            className="flex h-full w-full items-center px-2 text-sm"
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
    <div className="bg-ln-gray-20 border-y-ln-gray-30 grid h-12 w-full grid-cols-[32px_calc(100%-32px-30px)_30px] border-y md:grid-cols-[112px_calc(100%-112px-30px)_30px]">
      <div className="border-r-ln-gray-30 grid h-full grid-cols-[32px] items-center border-r md:grid-cols-[32px_80px]">
        <div className="text-ln-gray-70 flex h-full w-full items-center justify-center">
          <GroupByColIcon />
        </div>
        <div className="text-ln-gray-80 hidden md:block">Groups</div>
      </div>

      <div>
        <GridBox.Root {...rootProps}>
          <GridBox.Panel className="pills no-scrollbar bg-ln-gray-05 text-ln-gray-80 flex h-full flex-1 items-center overflow-x-auto">
            {items.map((c) => {
              return (
                <GridBox.Item
                  key={c.id}
                  item={c}
                  className="h-full"
                  itemClassName={"px-2 py-1 h-full cursor-grab flex items-center"}
                >
                  <div className="bg-ln-pill-group-fill border-ln-pill-group-stroke flex items-center gap-2 text-nowrap rounded border p-1 pr-2 text-sm">
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

      <div className="border-ln-gray-30 flex items-center justify-between border-l">
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
      return !!(c.uiHints?.rowGroupable ?? grid.state.columnBase.get().uiHints?.rowGroupable);
    },
    orientation: "vertical",
  });

  const model = grid.state.rowGroupModel.useValue();

  return (
    <P.Root>
      <P.Trigger className="text-ln-gray-70 flex h-full w-full items-center justify-center border-x border-[var(--lng1771-gray-30)] transition-all hover:bg-[var(--lng1771-gray-20)] disabled:bg-[var(--lng1771-gray-10)] disabled:text-[var(--lng1771-gray-40)]">
        <AddIcon />
      </P.Trigger>
      <P.Portal>
        <P.Content className="bg-ln-gray-05 border-ln-gray-30 z-50 h-[200px] w-[200px] overflow-auto rounded border">
          <GridBox.Root {...rootProps}>
            <GridBox.Panel>
              {items.map((c) => {
                return (
                  <GridBox.Item key={c.id} item={c}>
                    <div className="text-ln-gray-70 hover:bg-ln-gray-30 flex items-center gap-2 px-2 py-1 text-sm">
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
