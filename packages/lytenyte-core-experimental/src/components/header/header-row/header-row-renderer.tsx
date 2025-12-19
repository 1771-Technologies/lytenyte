import type { LayoutHeader } from "@1771technologies/lytenyte-shared";
import { HeaderCell } from "../header-cell/header-cell.js";
import { HeaderGroupCell } from "../header-cell/header-group-cell.js";
import { HeaderRow } from "./header-row.js";

export function HeaderRowRenderer(cells: LayoutHeader[]) {
  return (
    <HeaderRow>
      {cells.map((c) => {
        if (c.kind === "group") return <HeaderGroupCell cell={c} key={c.idOccurrence} />;

        return <HeaderCell cell={c} key={c.id} />;
      })}
    </HeaderRow>
  );
}
