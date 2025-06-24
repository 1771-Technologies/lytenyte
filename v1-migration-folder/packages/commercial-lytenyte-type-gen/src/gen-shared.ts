import { writeFileSync } from "fs";
import { compileType } from "./generator/compile-type.js";
import { format } from "prettier";
import type { GenTypes } from "./+types.js";

import * as RDS from "./definitions/rds.js";
import * as Row from "./definitions/row.js";
import * as ColumnGroup from "./definitions/column-group.js";
import * as GridAtom from "./definitions/grid-atom.js";
import {
  SortDateComparatorOptions,
  SortNumberComparatorOptions,
  SortStringComparatorOptions,
} from "./definitions/sort.js";
import { ColumnPin } from "./definitions/column.js";

const typeModules = [
  ...Object.values(ColumnGroup),
  ColumnPin,
  RDS.RowDataStore,
  ...Object.values(GridAtom),
  Row.RowNode,
  Row.RowLeaf,
  Row.RowGroup,
  SortDateComparatorOptions,
  SortNumberComparatorOptions,
  SortStringComparatorOptions,
] as GenTypes[];

const types = typeModules
  .filter((c) => c.kind === "interface" || c.kind === "prelude" || c.kind === "union")
  .filter((c) => !c.tag || c.tag === "core");

const result: string[] = [];
for (let i = 0; i < types.length; i++) {
  const r = compileType(types[i]);
  if (types[i].kind === "prelude") result.unshift(r);
  else result.push(r);
}

const formatted = await format(result.join("\n\n"), { filepath: "t.ts" });

writeFileSync(`${import.meta.dirname}/../../lytenyte-shared/src/+types.ts`, formatted);
