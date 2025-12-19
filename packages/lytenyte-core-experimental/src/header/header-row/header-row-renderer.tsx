import { HeaderCell } from "../header-cell/header-cell.js";
import { HeaderGroupCell } from "../header-cell/header-group-cell.js";
import type { HeaderLayoutCell } from "../../layout.js";
import { HeaderRow } from "./header-row.js";

export function HeaderRowRenderer<T>(cells: HeaderLayoutCell<T>[]) {
  return (
    <HeaderRow>
      {cells.map((c) => {
        if (c.kind === "group") return <HeaderGroupCell cell={c} key={c.idOccurrence} />;

        return <HeaderCell cell={c} key={c.column.id} />;
      })}
    </HeaderRow>
  );
}
