import "./floating-filter.css";

import type { FloatingCellRendererParamsReact } from "@1771technologies/grid-types/enterprise-react";
import { FunnelIcon } from "@1771technologies/lytenyte-grid-community/icons";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { useFloatingFilterInput } from "./use-floating-filter-input";

export function FloatingFilter<D>({ api, column }: FloatingCellRendererParamsReact<D>) {
  if (column.type === "complex") return null;

  return <FilterImpl api={api} column={column} />;
}

function FilterImpl<D>({ api, column }: FloatingCellRendererParamsReact<D>) {
  const sx = api.getState();
  const filters = sx.filterModel.use();
  const filter = filters[column.id] ?? {};

  const simple = filter.simple;
  const inputProps = useFloatingFilterInput({ api, column, filter: simple });

  return (
    <div className="lng1771-floating-filter">
      <Input className="lng1771-floating-filter__input" {...inputProps} />
      <button
        className="lng1771-floating-filter__button"
        onClick={(ev) => {
          api.columnFilterMenuOpen(column, ev.currentTarget.parentElement as HTMLElement);
        }}
      >
        <FunnelIcon />
      </button>
    </div>
  );
}
