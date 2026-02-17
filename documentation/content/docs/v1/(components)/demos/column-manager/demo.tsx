"use client";

import { useClientRowDataSource, Grid, ColumnManager as CM } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { ChevronDownIcon, DragDotsSmallIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Column, Grid as GridType } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];
type TreeItem = ReturnType<typeof CM.useColumnManager<BankData>>["items"][number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital", groupPath: ["Personal"] },
  { id: "default", groupPath: ["Personal"] },
  { id: "housing", groupPath: ["Personal"] },
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

export default function ColumnManager() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
    transformInFilterItem: (params) => {
      if (params.column.id === "age") {
        return params.values.map((c) => {
          const v = c as number;
          let group;

          if (v < 20) group = "0 < 20";
          else if (v < 40) group = "20 < 40";
          else if (v < 60) group = "40 < 60";
          else group = "60+";

          return {
            id: `${v}`,
            label: `${v} years`,
            value: v,
            groupPath: [group],
          };
        });
      }

      return params.values.map((c) => ({
        id: `${c}`,
        label: `${c}`,
        value: c,
      }));
    },
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();

  const { items, lookup } = CM.useColumnManager({
    grid,
  });

  return (
    <div>
      <div className="bg-ln-gray-05 column-manager h-[300px]">
        <CM.Root grid={grid} lookup={lookup}>
          <CM.Panel className="h-full w-full" style={{ position: "relative", overflow: "auto" }}>
            {items.map((c) => {
              return (
                <RenderNode item={c} grid={grid} key={c.kind === "branch" ? c.id : c.data.id} />
              );
            })}
          </CM.Panel>
        </CM.Root>
      </div>

      <div>
        <div className="lng-grid" style={{ height: 500 }}>
          <Grid.Root grid={grid}>
            <Grid.Viewport>
              <Grid.Header>
                {view.header.layout.map((row, i) => {
                  return (
                    <Grid.HeaderRow key={i} headerRowIndex={i}>
                      {row.map((c) => {
                        if (c.kind === "group") {
                          return (
                            <Grid.HeaderGroupCell
                              key={c.idOccurrence}
                              cell={c}
                              className="flex items-center gap-2 px-2"
                            >
                              <div>{c.groupPath.at(-1)}</div>
                            </Grid.HeaderGroupCell>
                          );
                        }

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
    </div>
  );
}

function RenderNode({ item, grid }: { item: TreeItem; grid: GridType<BankData> }) {
  if (item.kind === "leaf") {
    return (
      <CM.Leaf
        item={item}
        className="hover:bg-ln-gray-30 focus:bg-ln-primary-30 my-0 flex items-center gap-1 pl-6 transition-all"
      >
        <CM.MoveHandle className="hover:bg-ln-gray-30 flex items-center justify-center focus:ring-1">
          <DragDotsSmallIcon />
        </CM.MoveHandle>
        <CM.VisibilityCheckbox />
        <CM.Label className="text-ln-gray-70 flex flex-1 items-center pl-1 text-sm" />
      </CM.Leaf>
    );
  }

  const values = [...item.children.values()];

  return (
    <CM.Branch
      item={item}
      className="my-0 flex flex-col"
      labelWrapClassName="flex items-center gap-1 text-sm"
      expander={(p) => {
        return (
          <button>
            {p.expanded && <ChevronDownIcon />}
            {!p.expanded && <ChevronRightIcon />}
          </button>
        );
      }}
      label={
        <div style={{ display: "flex", gap: 6 }}>
          <CM.MoveHandle className="hover:bg-ln-gray-30 flex items-center justify-center focus:ring-1">
            <DragDotsSmallIcon />
          </CM.MoveHandle>
          <CM.VisibilityCheckbox />
          <CM.Label />
        </div>
      }
    >
      {values.map((c) => {
        return <RenderNode item={c} grid={grid} key={c.kind === "branch" ? c.id : c.data.id} />;
      })}
    </CM.Branch>
  );
}
