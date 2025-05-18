import { padStringRight, getStringTableWidths } from "@1771technologies/js-utils";
import type { ColumnLike } from "../columns-visible/columns-visible.js";
import { columnIsEmpty } from "../column-is-empty.js";
import type { ColumnGroupRowsCore } from "@1771technologies/grid-types/core";

export function formatLevels(
  levels: ColumnGroupRowsCore,
  additional?: ColumnLike[],
  delimiter = "_",
) {
  const levelStrings = levels.map((level, levelIndex) => {
    return level.map((item) => {
      if (item == null) return "~";

      const id = item.id.split(delimiter)[levelIndex];

      return `${id}/${item.occurrenceKey}/(${item.start}, ${item.end})`;
    });
  });
  if (additional) {
    levelStrings.push(additional.map((c) => (columnIsEmpty(c) ? "+" : c.id)));
  }
  const widths = getStringTableWidths(levelStrings);

  const paddedStrings = levelStrings
    .map((level) => {
      return level.map((s, i) => padStringRight(s, widths[i])).join(" | ");
    })
    .join("\n");

  return "\n" + paddedStrings + "\n";
}
