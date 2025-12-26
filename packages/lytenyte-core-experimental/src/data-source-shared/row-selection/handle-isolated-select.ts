import type { RowSelectionStateWithParent } from "@1771technologies/lytenyte-shared";

export function handleIsolatedSelect(
  prev: RowSelectionStateWithParent,
  selected: string[],
  deselect: boolean,
): RowSelectionStateWithParent {
  if (prev.kind === "controlled") {
    return {
      kind: "isolated",
      exceptions: deselect ? new Set() : new Set(selected),
      selected: false,
    };
  }

  // Adding to the exceptions will deselect it, and removing will select.
  if (prev.selected) {
    const next = new Set(prev.exceptions);
    if (deselect) selected.forEach((x) => next.add(x));
    else selected.forEach((x) => next.delete(x));
    return { ...prev, exceptions: next };
  } else {
    const next = new Set(prev.exceptions);
    if (deselect) selected.forEach((x) => next.delete(x));
    else selected.forEach((x) => next.add(x));

    return { ...prev, exceptions: next };
  }
}
