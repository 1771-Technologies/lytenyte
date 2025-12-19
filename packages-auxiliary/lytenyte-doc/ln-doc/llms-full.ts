import { writeFile } from "fs/promises";
import type { OneDocConfig } from "../lytenyte-doc";

export async function llmFull(codegen: URL, collections: OneDocConfig["collections"]) {
  const url = new URL(`llm-full.txt.ts`, codegen);
  await writeFile(
    url,
    `import { getCollection } from "astro:content";
import { readFileSync} from "node:fs"

const collections = []
const x = [${collections.map((x) => (typeof x === "string" ? '"' + x + '"' : '"' + x.name + '"'))}]

for(const c of x) {
  const entries = await getCollection(c);
  const values = entries.map(x => readFileSync(x.filePath!, "utf-8"))
  collections.push(...values);
}

export const GET = () => {
  const values = collections.join("\\n\\n\\n");

  return new Response(values)
}`,
  );

  return url;
}
