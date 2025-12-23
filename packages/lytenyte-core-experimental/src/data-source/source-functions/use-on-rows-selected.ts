import type { RowLeaf, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../hooks/use-event.js";
import type { RootNode } from "../hooks/use-group-tree";

export function useOnRowsSelected<T>(
  rowById: RowSource<T>["rowById"],
  selected: Set<string>,
  setSelected: (s: Set<string>) => void,
  tree: RootNode<T> | null,
  sorted: number[],
  leafs: RowLeaf<T>[],
  leafsTop: RowLeaf<T>[],
  leafsBot: RowLeaf<T>[],
  rowsIsolatedSelection: boolean,
) {
  const onRowsSelected: RowSource<T>["onRowsSelected"] = useEvent(({ selected: c, deselect, mode }) => {
    if (mode === "none") return;
    if (mode === "single" && c === "all") return;

    if (mode === "single") {
      const first = (c as string[]).find((x) => rowById(x)?.kind === "leaf");
      if (!first) return;

      if (deselect) setSelected(new Set());
      else setSelected(new Set([first]));

      return;
    }

    if (deselect && c === "all") return setSelected(new Set());
    else if (c === "all")
      return setSelected(
        new Set([
          ...sorted.map((x) => leafs[x].id),
          ...leafsTop.map((x) => x.id),
          ...leafsBot.map((x) => x.id),
        ]),
      );

    if (rowsIsolatedSelection) {
      const next = deselect ? selected.difference(new Set(c)) : selected.union(new Set(c));
      setSelected(next);
      return;
    }

    const finalSelected = !tree?.groupLookup
      ? new Set(c)
      : new Set(
          c.flatMap((id) => {
            const group = tree.groupLookup.get(id);
            if (group) return [...group.leafIds];
            return id;
          }),
        );

    const next = deselect ? selected.difference(finalSelected) : selected.union(finalSelected);
    setSelected(next);
  });

  return onRowsSelected;
}
