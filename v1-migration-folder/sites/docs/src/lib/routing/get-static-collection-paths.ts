import { getSlugPath } from "./get-slug-path";

export interface Doc {
  readonly filePath: string;
}

export function getStaticCollectionPaths(docs: Doc[], prefix?: string) {
  const paths = docs.map((doc) => {
    return getSlugPath(doc.filePath);
  });

  if (prefix) return paths.map((c) => [prefix, ...c]);

  return paths;
}
