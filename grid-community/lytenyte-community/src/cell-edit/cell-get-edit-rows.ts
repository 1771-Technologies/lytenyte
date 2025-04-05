import type { CellEditLocation } from "@1771technologies/grid-types/core";

export function getEditRows(
  locations: Map<string, CellEditLocation>,
  predicate: (l: CellEditLocation) => boolean,
) {
  const validLocations = Object.groupBy(
    [...locations].filter(([_, l]) => predicate(l)).map(([_, l]) => l),
    (l) => l.rowIndex,
  );

  return Object.entries(validLocations) as [string, CellEditLocation[]][];
}
