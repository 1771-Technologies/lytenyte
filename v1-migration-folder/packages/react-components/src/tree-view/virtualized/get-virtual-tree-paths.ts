import type { PathBranch, PathLeaf, PathProvidedItem } from "@1771technologies/lytenyte-shared";

export function buildVirtualTreePartial<T extends PathProvidedItem>(
  items: (PathBranch<T> | PathLeaf<T>)[],
) {
  const paths = items.map((c) => {
    if (c.kind === "leaf") {
      const parent = c.parent;
      if (parent.kind === "root") return ["", c];
      const path = parent.id.split("#");
      return [path, c];
    }

    const path = c.id.split("#");
    return [path, c];
  }) as [string[], PathBranch<T> | PathLeaf<T>][];

  return paths;
}
