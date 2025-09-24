import path from "node:path";
import { getSlugs, parseFilePath } from "fumadocs-core/source";
import { printErrors, readFiles, scanURLs, validateFiles } from "next-validate-link";
import { getTableOfContents } from "fumadocs-core/server";

async function checkLinks() {
  // we read them all at once to avoid repeated file read
  const docsFiles = await readFiles("content/docs/**/*.{md,mdx}");

  const scanned = await scanURLs({
    populate: {
      "docs/[[...slug]]": docsFiles.map((file) => {
        const info = parseFilePath(path.relative("content/docs", file.path));

        return {
          value: getSlugs(info),
          hashes: getTableOfContents(file.content).map(
            (item) => item.url.slice(1).split("span-classnametype")[0],
          ),
        };
      }),
    },
  });

  printErrors(
    await validateFiles([...docsFiles], {
      checkExternal: true,
      scanned,
    }),
    true,
  );
}

void checkLinks();
