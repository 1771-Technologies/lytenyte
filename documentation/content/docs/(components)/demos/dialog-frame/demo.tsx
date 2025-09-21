"use client";

import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { Dialog } from "radix-ui";
import { useId, useState } from "react";

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

export default function DialogFrame() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    dialogFrames: {
      myFrame: {
        component: (params) => {
          return (
            <Dialog.Root defaultOpen onOpenChange={(b) => !b && params.grid.api.dialogFrameClose()}>
              <Dialog.Portal>
                <Dialog.Content className="border-ln-gray-50 bg-ln-gray-10 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] rounded border px-4">
                  <Dialog.Title className="text-ln-gray-70 py-2">
                    Example Grid Dialog Frame
                  </Dialog.Title>
                  <Dialog.Description>
                    You have opened this dialog frame {params.context.count} time(s).
                  </Dialog.Description>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          );
        },
      },
    },
  });

  const view = grid.view.useValue();

  const [openCount, setOpenCount] = useState(1);
  return (
    <div>
      <button
        className="rounded border border-gray-600 bg-gray-900 px-2 text-white"
        onClick={() => {
          grid.api.dialogFrameOpen("myFrame", { count: openCount });
          setOpenCount((prev) => prev + 1);
        }}
      >
        Click Me To Open A Grid Dialog Frame
      </button>

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
