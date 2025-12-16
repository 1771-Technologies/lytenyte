import { writeFile } from "fs/promises";
import type { OneDocConfig } from "../lytenyte-doc";

export async function mdxRoutes(codegen: URL, collections: OneDocConfig["collections"]) {
  const url = new URL(`markdowns.mdx.ts`, codegen);
  await writeFile(
    url,
    `import { getCollection } from "astro:content";
import { readFileSync} from "node:fs"

const collections = []

const x = [${collections.map((x) => (typeof x === "string" ? '"' + x + '"' : '"' + x.name + '"'))}]

for(const c of x) {
  const entries = await getCollection(c);

  const values = entries.map(x => [c + "/" + x.id, readFileSync(x.filePath!, "utf-8")])

  collections.push(...values);
}

const lookup = Object.fromEntries(collections);

export const GET = ({ params, request }) => {
  return new Response(lookup[params.id])
}

export function getStaticPaths() {
  return Object.keys(lookup).map(x => ({ params: { id: x }}))
}`,
  );

  return url;
}
