import {
  type RowSelectionLinkedWithParent,
  type RowSelectNodeWithParent,
} from "@1771technologies/lytenyte-shared";

export function cleanTree(
  s: RowSelectionLinkedWithParent | RowSelectNodeWithParent,
  idUniverse: Set<string> | null,
  rootIds: Set<string>,
  rootCount: number,
) {
  s.children?.forEach((x) => cleanTree(x, idUniverse, rootIds, rootCount));

  // The root needs special care
  if ("kind" in s) {
    // Check if the root size is greater than
    // or equal to the root count
    if (s.children.size >= rootCount) {
      let current = null;
      for (const x of s.children.values()) {
        // This node means that there is some other selection happening
        if (x.selected == null || x.children?.size) return;

        if (current == null) {
          current = x.selected;
          continue;
        }

        // There is some differences
        if (current !== x.selected) return;
      }

      (s as any).selected = current;
      s.children.clear();
    }

    return;
  }

  if (s.children?.size === 0) s.children = undefined;

  // We've reached a leaf level - if it shares the same selected state as its parent,
  // we should remove it from its parent.
  if (s.children === undefined && s.selected === s.parent.selected) {
    s.parent.children?.delete(s.id);
  }

  // This node doesn't do anything so we can safely remove it.
  if (s.children === undefined && s.selected === undefined) {
    s.parent.children?.delete(s.id);
  }

  if (idUniverse && !idUniverse.has(s.id)) {
    s.parent.children?.delete(s.id);
  }
}
