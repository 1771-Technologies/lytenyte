import type { UnionType } from "../+types.js";
import { compileTsDoc } from "./compile-ts-doc.js";

export function compileUnionType(t: UnionType) {
  const output: string[] = [];

  output.push(...compileTsDoc(t.tsDoc, t.seeAlso));

  if (t.export) output.push(`export type ${t.name} = ${t.types.join(" | ")}`);
  else output.push(`type ${t.name} = ${t.types.join(" | ")}`);

  return output.join("\n");
}
