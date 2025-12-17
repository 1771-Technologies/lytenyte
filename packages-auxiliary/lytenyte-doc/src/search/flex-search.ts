import type { Index as FlexIndex } from "flexsearch";
import FlexSearch from "flexsearch";

export interface DocIndex {
  readonly header: string;
  readonly link: string;
  readonly depth: number;
  readonly text: string;
}

export function makeSearcher(data: DocIndex[]) {
  const sectionIndex = new FlexSearch.Document({
    tokenize: "full",
    // enables scoring/advanced search options
    // @ts-expect-error: some FlexSearch builds don't type this option
    suggest: true,
    document: {
      id: "link",
      index: [
        { field: "header", tokenize: "forward" },
        { field: "text", tokenize: "forward" },
      ],
      store: ["header", "link", "text", "depth"],
    },
  }) as unknown as FlexIndex;

  for (const d of data) {
    (sectionIndex as any).add(d);
  }

  const search = async (query: string) => {
    // @ts-expect-error this works fine.
    const result = await sectionIndex.searchAsync(query, {
      enrich: true,
      limit: 5,
    });

    if (result.length === 0) {
      return [];
    }
    const seen = new Set();

    return (
      result
        // @ts-expect-error types for flex-search wtf
        .flatMap((x) => x.result)
        .map((x) => x.doc)
        .filter((x) => {
          if (seen.has(x.link)) return false;

          seen.add(x.link);
          return true;
        })
    );
  };

  return search;
}
