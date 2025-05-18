import type { CellEditLocationCore } from "@1771technologies/grid-types/core";

export function getEditRows(
  locations: Map<string, CellEditLocationCore>,
  predicate: (l: CellEditLocationCore) => boolean,
) {
  const validLocations = Object.groupBy(
    [...locations].filter(([_, l]) => predicate(l)).map(([_, l]) => l),
    (l) => l.rowIndex,
  );

  return Object.entries(validLocations) as [string, CellEditLocationCore[]][];
}
