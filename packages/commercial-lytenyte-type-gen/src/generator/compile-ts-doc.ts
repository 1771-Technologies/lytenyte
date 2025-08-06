import type { SeeAlso } from "../+types.js";
import { dedentString } from "./dedent-string.js";

export function compileTsDoc(doc: string, seeAlso?: SeeAlso[]) {
  const output: string[] = [];
  output.push("/**");

  dedentString(doc)
    .trim()
    .split("\n")
    .forEach((line) => output.push(` * ${line}`));

  if (seeAlso?.length) {
    output.push("* ", " * See:");
    seeAlso.forEach((c) => {
      if (c.kind === "type") output.push(` * - {@link ${c.name}}: ${c.description}`);
      if (c.kind === "link") output.push(` * - [${c.name}](${c.link}): ${c.description}`);
    });
  }

  output.push("*/");

  return output;
}
