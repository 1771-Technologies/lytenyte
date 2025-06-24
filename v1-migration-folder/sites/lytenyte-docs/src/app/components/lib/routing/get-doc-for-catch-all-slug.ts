import { joinSlugPath } from "./join-slug-path";

export function getDocForCatchAllSlug<T>(slug: string[], lookup: Map<string, T>) {
  return lookup.get(joinSlugPath(slug)) ?? null;
}
