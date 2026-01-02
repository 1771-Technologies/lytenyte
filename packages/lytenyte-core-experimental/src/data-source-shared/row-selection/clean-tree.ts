import {
  type RowSelectionLinkedWithParent,
  type RowSelectNodeWithParent,
} from "@1771technologies/lytenyte-shared";

export function cleanTree(
  s: RowSelectionLinkedWithParent | RowSelectNodeWithParent,
  idUniverse: Set<string> | null,
) {
  s.children?.forEach((x) => cleanTree(x, idUniverse));

  // handle root here
  if ("kind" in s) return;

  if (s.children?.size === 0) s.children = undefined;

  // We've reached a leaf level - if it shares the same selected state as its parent,
  // we should remove it from its parent.
  if (s.children === undefined && s.selected === s.parent.selected) {
    s.parent.children?.delete(s.id);
  }

  if (idUniverse && !idUniverse.has(s.id)) {
    s.parent.children?.delete(s.id);
    s.parent.exceptions?.delete(s.id);
  }
}
