import type { InterfaceType } from "../+types.js";
import { compileTsDoc } from "./compile-ts-doc.js";

export function compileInterfaceType(t: InterfaceType) {
  const output: string[] = [];

  // Handle the ts doc comment.
  output.push(...compileTsDoc(t.tsDoc, t.seeAlso));

  // Begin the opening of the interface
  if (t.export) output.push(`export interface ${t.name} {`);
  else output.push(`interface ${t.name} {`);

  // Resolve all our properties including the extensions.
  const props = [];
  let current = t.extends;
  while (current) {
    props.unshift(...current.properties);
    current = current.extends;
  }
  props.push(...t.properties);

  for (const p of props) {
    const f = p.kind === "withOverride" ? { ...p.prop, ...p.overrides } : p;
    const doc = compileTsDoc(f.tsDoc, f.seeAlso);
    output.push(...doc);

    output.push(`readonly ${f.name}${f.optional ? "?" : ""}: ${f.value};`);
    output.push("\n");
  }

  output.push("}");

  return output.join("\n");
}
