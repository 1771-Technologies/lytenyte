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
            <Dialog.Root
              defaultOpen
              onOpenChange={(b) => !b && params.grid.api.dialogFrameClose()}
            >
              <Dialog.Portal>
                <Dialog.Content className="z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-ln-gray-50 border fixed px-4 rounded bg-ln-gray-10">
                  <Dialog.Title className="py-2 text-ln-gray-70">
                    Example Grid Dialog Frame
                  </Dialog.Title>
                  <Dialog.Description>
                    You have opened this dialog frame {params.context.count}{" "}
                    time(s).
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
        className="bg-gray-900 text-white border border-gray-600 rounded px-2"
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
