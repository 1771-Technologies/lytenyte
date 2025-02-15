import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { useId, useMemo, useState, type ReactNode } from "react";
import { cc } from "../component-configuration";
import { SearchIcon } from "../icons/search-icon";
import { Toggle } from "../toggle/toggle";
import { t } from "@1771technologies/grid-design";
import { Separator } from "../separator/separator";
import { ColumnManagerBase } from "./column-manager-base";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { GridProvider } from "../provider/grid-provider";

export interface ColumnManagerProps<D> {
  readonly showPivotToggle?: boolean;
  readonly api: ApiEnterpriseReact<D>;
}

export function ColumnManager<D>({ showPivotToggle, api }: ColumnManagerProps<D>): ReactNode {
  const grid = useMemo(() => {
    return { api, state: api.getState() };
  }, [api]);

  const config = cc.columnManager.use();
  const Icon = config.searchInput?.icon ?? SearchIcon;

  const state = grid.state;

  const pivotMode = state.columnPivotModeIsOn.use();

  const [query, setQuery] = useState("");
  const id = useId();

  return (
    <GridProvider grid={grid}>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          container-type: inline-size;
        `}
      >
        <div
          className={css`
            display: flex;
            align-items: center;
            gap: ${t.spacing.space_30};
            padding-block: ${t.spacing.space_30};
            padding-inline: ${t.spacing.space_40};
          `}
        >
          <Input
            small
            className={css`
              flex: 1;
            `}
            icon={Icon}
            placeholder={config.searchInput?.placeholderSearch}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {showPivotToggle && (
            <div
              className={css`
                display: flex;
                align-items: center;
                gap: ${t.spacing.space_10};
              `}
            >
              <Toggle id={id} on={pivotMode} onChange={(b) => state.columnPivotModeIsOn.set(b)} />
              <label htmlFor={id} className="lng1771-text-medium">
                {config.pivot?.labelPivotModeToggle}
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
