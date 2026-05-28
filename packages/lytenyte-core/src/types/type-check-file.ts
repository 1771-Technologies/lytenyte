// If there are type errors this file will hopefully catch them.
// This file should never be run.

import type { Grid } from "../index.js";

// Check that the API has the correct properties. We don't check every property,
// just some, but it's enough.
{
  const x: Grid.API = null as any;
  void x.cellRoot;
  void x.columnMove;
}

// Check we can correctly extend the API
{
  const x = null as unknown as Grid.API<{ api: { count: () => number } }>;

  const t: number = x.count?.();
  void t;
}

// Check that we can extend the column and that API methods see the extended column.
{
  const x = null as unknown as Grid.API<{ column: { sort: string } }>;
  void x.columnUpdate?.({ x: { sort: "a" } });
}
// Can correctly extend columns
{
  const x = null as unknown as Grid.Column<{ column: { sort: string } }>;
  void x?.sort;
}

{
  const x = null as unknown as Grid.Props<{ api: { count: () => number }; column: { sort?: string } }>;
  void x.columns?.[0]?.sort;
}
