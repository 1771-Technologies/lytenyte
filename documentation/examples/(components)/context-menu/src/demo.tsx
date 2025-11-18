"use client";

import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column, PositionUnion } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { ContextMenu } from "radix-ui";
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
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function ContextMenuDemo() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();
  const [position, setPosition] = useState<PositionUnion | null>(null);

  return (
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

            <ContextMenu.Root
              modal
              onOpenChange={(b) => {
                if (!b) setPosition(null);
              }}
            >
              <ContextMenu.Trigger
                asChild
                onContextMenu={(c) => {
                  const element = c.target as HTMLElement;
                  setPosition(grid.api.positionFromElement(element));
                }}
              >
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
              </ContextMenu.Trigger>
              <GridContextMenu position={position} />
            </ContextMenu.Root>
          </Grid.Viewport>
        </Grid.Root>
      </div>
    </div>
  );
}

export function GridContextMenu({ position }: { position: PositionUnion | null }) {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content
        className="bg-ln-gray-05 border-ln-gray-30 relative z-50 rounded border p-2"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="text-ln-gray-70 pb-1 text-sm">
          Context Menu For Position: {position?.kind}
        </div>
        <ContextMenu.Item className="py-1 text-sm">Item 1</ContextMenu.Item>
        <ContextMenu.Item className="py-1 text-sm">Item 2</ContextMenu.Item>
        <ContextMenu.Item className="py-1 text-sm">Item 3</ContextMenu.Item>
        <ContextMenu.Separator />
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
}
