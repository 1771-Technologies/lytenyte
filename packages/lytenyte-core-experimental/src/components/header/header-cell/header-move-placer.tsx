import { useEffect, useState } from "react";
import type { ReactPlaceholderFn } from "../../../dnd/types.js";
import { useRoot } from "../../../root/root-context.js";
import type { ColumnAbstract, LayoutHeader } from "@1771technologies/lytenyte-shared";

export const HeaderMovePlaceholder: ReactPlaceholderFn = ({ x, y, data }) => {
  const moving = data.moving.data as { columns: ColumnAbstract[]; cell: LayoutHeader };
  const cell = moving.cell;

  const { api, viewport, columnGroupMoveDragPlaceholder, columnMoveDragPlaceholder } = useRoot();

  const Placeholder = cell.kind === "group" ? columnGroupMoveDragPlaceholder : columnMoveDragPlaceholder;

  const [ready, setReady] = useState(false);

  // We need to delay the rendering briefly. This is to work around a chrome bug where
  // editing the DOM immediately ends the row drag for some reason.
  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 80);
  }, []);

  if (typeof Placeholder !== "function") return null;

  const props =
    cell.kind === "group"
      ? { columns: moving.columns, groupPath: cell.groupPath, api, x, y }
      : { column: moving.columns[0], api, x, y };

  if (!ready) return null;

  const bb = viewport!.getBoundingClientRect();

  const isOutside = bb.top >= y || bb.bottom <= y || bb.left >= x || bb.right <= x;

  return <Placeholder {...(props as any)} outside={isOutside} />;
};
