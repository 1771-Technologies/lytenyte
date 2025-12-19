import { writeFile } from "fs/promises";
import type { OneDocConfig } from "../lytenyte-doc";

export async function llmsText(
  codegen: URL,
  collections: OneDocConfig["collections"],
  name: string,
  description: string,
  host: string,
) {
  const url = new URL(`llm-full.txt.ts`, codegen);
  await writeFile(
    url,
    `import { getCollection } from "astro:content";
import { readFileSync} from "node:fs"

const sections = {}
const x = [${collections.map((x) => (typeof x === "string" ? '"' + x + '"' : '"' + x.name + '"'))}]

for(const c of x) {
  const entries = await getCollection(c);
  const values = entries.map(x => {
    const parts = x.filePath!.split("/");

    const section = parts[0];
    const cleaned = section.replace("(@", "").replace("(", "").replace(")", "").split(" ").map(x => {
      return x[0].toUpperCase() + x.slice(1)
    }).join(" ");
      
    sections[cleaned] ??= [];
    sections[cleaned].push({ title: x.data.title, link: "${host}" + "/" + c + "/" + x.id, description: x.data.description?.replaceAll("\\n", " ") ?? "" })
  })
}


const final = "# " + "${name}" + "\\n\\n" + "${description}\\n\\n" +  Object.entries(sections).flatMap(([section, listItems]) => {
    return [
      "\\n##" + " " + section + "\\n",
      ...listItems.map(x => {

      return "- [" + x.title + "]" + "(" + x.link + "):" + " " + x.description
      })
    ]
}).join("\\n");

export const GET = () => {

  return new Response(final)
}`,
  );

  return url;
}
