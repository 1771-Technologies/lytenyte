import { writeFile } from "fs/promises";
import type { OneDocConfig } from "../lytenyte-doc";

export async function searchIndexFile(codegen: URL, collections: OneDocConfig["collections"]) {
  const url = new URL(`llm-full.txt.ts`, codegen);
  await writeFile(
    url,
    `import { getCollection } from "astro:content";
import { indexMdxH2H3 } from "@1771technologies/lytenyte-doc";

const indices = []
const x = [${collections.map((x) => (typeof x === "string" ? '"' + x + '"' : '"' + x.name + '"'))}]

for(const c of x) {
  const entries = await getCollection(c);

  const result = entries.flatMap(e => {
    return indexMdxH2H3(e.body!).map(x => ({ header: x.header, text: x.text, link: c + "/" + e.id + "#" + x.id, depth: x.depth }));
  })

  const headerResults = entries.map(e => ({ header: e.data.title!, text: e.data?.description ?? "", link: c + "/" + e.id, depth: 1 }))

  indices.push(...headerResults, ...result);
}


export const GET = () => {
  return new Response(JSON.stringify(indices), { 
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
  })
}`,
  );

  return url;
}
