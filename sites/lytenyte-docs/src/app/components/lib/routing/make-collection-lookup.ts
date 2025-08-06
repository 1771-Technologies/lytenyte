import type { Doc } from "./get-static-collection-paths";
import { getStaticCollectionPaths } from "./get-static-collection-paths";
import { joinSlugPath } from "./join-slug-path";

export function makeCollectionLookup<T extends Doc>(collections: { docs: T[]; prefix?: string }[]) {
  const sets = collections.flatMap((c) => {
    const paths = getStaticCollectionPaths(c.docs, c.prefix);

    return paths.map((path, i) => {
      return [joinSlugPath(path as string[]), c.docs[i]] as const;
    });
  });

  const lookup = new Map(sets);

  return lookup;
}
