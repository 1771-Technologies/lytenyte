import { writeFileSync } from "fs";
import { compileType } from "./generator/compile-type.js";
import { format } from "prettier";
import type { GenTypes } from "./+types.js";

import * as Column from "./definitions/column.js";
import * as GridState from "./definitions/grid-state.js";
import * as Grid from "./definitions/grid.js";
import * as UseLng from "./definitions/use-lytenyte.js";
import * as GridView from "./definitions/grid-view.js";
import * as ColumnGroup from "./definitions/column-group.js";
import * as ClientDataSource from "./definitions/rds-client.js";
import * as RDS from "./definitions/rds.js";
import * as GridAtom from "./definitions/grid-atom.js";
import * as Row from "./definitions/row.js";
import * as Spans from "./definitions/col-and-row-span.js";

const typeModules = [
  ...Object.values(UseLng),
  ...Object.values(GridState),
  ...Object.values(Grid),
  ...Object.values(GridView),
  ...Object.values(Column),
  ...Object.values(ColumnGroup),
  ...Object.values(ClientDataSource),
  ...Object.values(RDS),
  ...Object.values(GridAtom),
  ...Object.values(Row),
  ...Object.values(Spans),
] as GenTypes[];

const types = typeModules
  .filter(
    (c) =>
      c.kind === "interface" || c.kind === "prelude" || c.kind === "union" || c.kind === "function",
  )
  .filter((c) => !c.tag || c.tag === "core");

const result: string[] = [];
for (let i = 0; i < types.length; i++) {
  const r = compileType(types[i]);
  if (types[i].kind === "prelude") result.unshift(r);
  else result.push(r);
}

const formatted = await format(result.join("\n\n"), { filepath: "t.ts" });

writeFileSync(`${import.meta.dirname}/../../lytenyte-core/src/+types.ts`, formatted);
