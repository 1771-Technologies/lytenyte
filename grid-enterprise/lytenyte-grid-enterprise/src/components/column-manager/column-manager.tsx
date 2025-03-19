import "./column-manager.css";
import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useId, useMemo, useState, type ReactNode } from "react";
import { ColumnManagerBase } from "./column-manager-base";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { SearchIcon } from "@1771technologies/lytenyte-grid-community/icons";
import { GridProvider } from "../../use-grid";
import { Separator } from "../../components-internal/separator/separator";
import { Toggle } from "../../components-internal/toggle/toggle";

export interface ColumnManagerProps<D> {
  readonly showPivotToggle?: boolean;
  readonly api: ApiEnterpriseReact<D>;

  readonly searchPlaceholder?: string;
  readonly pivotModeLabel?: string;
}

export function ColumnManager<D>({
  showPivotToggle,
  api,

  searchPlaceholder,
  pivotModeLabel,
}: ColumnManagerProps<D>): ReactNode {
  const grid = useMemo(() => {
    return { api, state: api.getState() };
  }, [api]);

  const Icon = SearchIcon;

  const state = grid.state;

  const pivotMode = state.columnPivotModeIsOn.use();

  const [query, setQuery] = useState("");
  const id = useId();

  return (
    <GridProvider value={grid}>
      <div className="lng1771-column-manager">
        <div className="lng1771-column-manager__controls-root">
          <Input
            small
            className="lng1771-column-manager__search-input"
            icon={Icon}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {showPivotToggle && (
            <div className="lng1771-column-manager__pivot-control">
              <Toggle id={id} on={pivotMode} onChange={(b) => state.columnPivotModeIsOn.set(b)} />
              <label htmlFor={id} className="lng1771-column-manager__pivot-label">
                {pivotModeLabel}
              </label>
            </div>
          )}
        </div>
        <Separator dir="horizontal" />
        <ColumnManagerBase query={query} />
        <Separator dir="horizontal" />
      </div>
    </GridProvider>
  );
}
