import type { GenTypes } from "../+types.js";
import { compileInterfaceType } from "./compile-interface-type.js";
import { compileUnionType } from "./compile-union-type.js";

export function compileType(type: GenTypes) {
  if (type.kind === "interface") return compileInterfaceType(type);
  if (type.kind === "union") return compileUnionType(type);
  if (type.kind === "prelude") return type.line;

  return "";
}
