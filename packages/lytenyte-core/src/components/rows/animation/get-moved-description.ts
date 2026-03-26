import type { LayoutRow } from "@1771technologies/lytenyte-shared";

export function getMovedDescriptions(
  gridId: string,
  moved: LayoutRow[],
  idPositions: Map<string, number>,
  prevIdPositions: Map<string, number>,
) {
  const movedElements = moved.map((x) => {
    const from = prevIdPositions.get(x.id)!;
    const to = idPositions.get(x.id)!;
    const delta = to - from;

    const element = document.querySelector(
      `[data-ln-row="true"][data-ln-rowid="${x.id}"][data-ln-gridid="${gridId}"]`,
    ) as HTMLElement | null;

    return {
      delta,
      element,
    };
  });

  return movedElements;
}
