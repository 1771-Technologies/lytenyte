import type { ReactPlaceholderFn } from "../../../dnd/types.js";
import { useRoot } from "../../../root/root-context.js";
import type { ColumnAbstract, LayoutHeader } from "@1771technologies/lytenyte-shared";

export const HeaderMovePlaceholder: ReactPlaceholderFn = ({ x, y, data }) => {
  const moving = data.moving.data as { columns: ColumnAbstract[]; cell: LayoutHeader };
  const cell = moving.cell;

  const { api, viewport, columnGroupMoveDragPlaceholder, columnMoveDragPlaceholder } = useRoot();

  const Placeholder = cell.kind === "group" ? columnGroupMoveDragPlaceholder : columnMoveDragPlaceholder;
  if (typeof Placeholder !== "function") return null;

  const props =
    cell.kind === "group"
      ? { columns: moving.columns, groupPath: cell.groupPath, api, x, y }
      : { column: moving.columns[0], api, x, y };

  const bb = viewport!.getBoundingClientRect();

  const isOutside = bb.top >= y || bb.bottom <= y || bb.left >= x || bb.right <= x;

  return <Placeholder {...(props as any)} outside={isOutside} />;
};
