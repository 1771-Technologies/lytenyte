import type { FunctionType } from "../+types";
import { compileTsDoc } from "./compile-ts-doc";

export function compileFunctionType(t: FunctionType) {
  const output: string[] = [];

  output.push(...compileTsDoc(t.tsDoc, t.seeAlso));

  const params = t.properties
    .map((prop) => {
      const f = prop.kind === "withOverride" ? { ...prop.prop, ...prop.overrides } : prop;
      const doc = compileTsDoc(f.tsDoc, f.seeAlso);

      return [...doc, `${f.name}: ${f.value},`].join("\n");
    })
    .join("\n");
  if (t.export) output.push(`export type ${t.name} = (${params}) => ${t.return};`);
  else output.push(`type ${t.name} = (${params}) => ${t.return};`);

  return output.join("\n");
}
