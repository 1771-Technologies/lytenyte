import "./floating-filter.css";

import type { FloatingCellRendererParamsReact } from "@1771technologies/grid-types/enterprise-react";
import { FunnelIcon } from "@1771technologies/lytenyte-grid-community/icons";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";

export function FloatingFilter<D>({ api, column }: FloatingCellRendererParamsReact<D>) {
  if (column.type === "complex") return null;

  return <FilterImpl api={api} column={column} />;
}

function FilterImpl<D>({ api, column }: FloatingCellRendererParamsReact<D>) {
  const sx = api.getState();
  const filters = sx.filterModel.use();
  const filter = filters[column.id] ?? {};

  return (
    <div className="lng1771-floating-filter">
      <Input className="lng1771-floating-filter__input" />
      <button className="lng1771-floating-filter__button">
        <FunnelIcon />
      </button>
    </div>
  );
}
