"use client";

import { useClientRowDataSource, Grid, FilterTree as Tree } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];
type TreeItem = ReturnType<typeof Tree.useFilterTree>["tree"][number];

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

export default function FilterTree() {
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

  const inFilterAge = Tree.useFilterTree({ grid, column: columns[0] });
  const inFilterJob = Tree.useFilterTree({ grid, column: columns[1] });

  return (
    <div>
      <div className="flex gap-8 px-4 py-2">
        <div>
          <div className="px-2">Age Filter</div>
          <Tree.Root {...inFilterAge.rootProps}>
            <Tree.Panel
              className="bg-ln-gray-05 border-ln-gray-30 z-50 rounded border"
              style={{
                height: 250,
                width: 200,
                overflowY: "auto",
                overflowX: "hidden",
                position: "relative",
              }}
            >
              {inFilterAge.tree.map((c) => {
                return (
                  <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />
                );
              })}
            </Tree.Panel>

            <div className="flex gap-2 px-2">
              <div>
                <button
                  onClick={() => {
                    inFilterAge.reset();
                  }}
                  className="text-ln-gray-90 px-2 text-sm hover:bg-red-500/30"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    inFilterAge.apply();
                  }}
                  className="bg-brandButton hover:bg-brandButton/80 border border-solid border-[var(--lng1771-gray-30)] px-2 text-sm text-black"
                >
                  Apply
                </button>
              </div>
            </div>
          </Tree.Root>
        </div>

        <div>
          <div className="px-2">Job Filter</div>
          <Tree.Root {...inFilterJob.rootProps}>
            <Tree.Panel
              className="bg-ln-gray-05 border-ln-gray-30 z-50 rounded border"
              style={{
                height: 250,
                width: 200,
                overflowY: "auto",
                overflowX: "hidden",
                position: "relative",
              }}
            >
              {inFilterJob.tree.map((c) => {
                return (
                  <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />
                );
              })}
            </Tree.Panel>

            <div className="flex gap-2 px-2">
              <div>
                <button
                  onClick={() => {
                    inFilterJob.reset();
                  }}
                  className="text-ln-gray-90 px-2 text-sm hover:bg-red-500/30"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    inFilterJob.apply();
                  }}
                  className="bg-brandButton hover:bg-brandButton/80 border border-solid border-[var(--lng1771-gray-30)] px-2 text-sm text-black"
                >
                  Apply
                </button>
              </div>
            </div>
          </Tree.Root>
        </div>
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
    </div>
  );
}

function RenderNode({ item }: { item: TreeItem }) {
  if (item.kind === "leaf") {
    return (
      <Tree.Leaf
        item={item}
        style={{ paddingLeft: (item.leaf.data.groupPath?.length ?? 0) * 20 }}
        className="hover:bg-ln-gray-20 text-ln-gray-80 flex cursor-pointer items-center gap-2 px-2 text-xs transition-colors"
      >
        <Tree.Checkbox />
        <Tree.Label />
      </Tree.Leaf>
    );
  }

  const values = [...item.children.values()];

  return (
    <Tree.Branch
      item={item}
      expander={(p) => {
        return (
          <button>
            {p.expanded && <ChevronDownIcon />}
            {!p.expanded && <ChevronRightIcon />}
          </button>
        );
      }}
      className="px-0"
      labelWrap={<div className="items-enter flex gap-1" />}
      label={
        <div className="flex items-center">
          <Tree.Checkbox />
          <Tree.Label />
        </div>
      }
    >
      {values.map((c) => {
        return <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />;
      })}
    </Tree.Branch>
  );
}
