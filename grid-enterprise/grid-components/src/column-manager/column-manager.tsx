import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { ListViewAxe } from "@1771technologies/react-list-view";
import { useState, type JSX, type ReactNode } from "react";
import { Input } from "../input/Input";
import { cc } from "../component-configuration";
import { SearchIcon } from "../icons/search-icon";
import { Toggle } from "../toggle/toggle";
import { useGrid } from "../provider/grid-provider";
import { t } from "@1771technologies/grid-design";
import { Separator } from "../separator/separator";

export interface ColumnManagerConfiguration {
  readonly dragPlaceholder?: (p: { label: string }) => ReactNode;
  readonly columnTree?: {
    readonly axe: ListViewAxe<ColumnEnterpriseReact<any>>;
    readonly labelDrag: string;
  };
  readonly columnBoxes?: {
    readonly labelValues: string;
    readonly labelRowGroups: string;
    readonly labelColumnPivots: string;
    readonly labelMeasures: string;

    readonly labelEmptyValues: string;
    readonly labelEmptyRowGroups: string;
    readonly labelEmptyColumnPivot: string;
    readonly labelEmptyMeasures: string;

    readonly iconRowGroups?: () => ReactNode;
    readonly iconValues?: () => ReactNode;
    readonly iconColumnPivots?: () => ReactNode;
    readonly iconMeasures?: () => ReactNode;
    readonly iconEmpty?: () => ReactNode;
  };

  readonly searchInput?: {
    readonly placeholderSearch: string;
    readonly icon: (p: JSX.IntrinsicElements["svg"]) => ReactNode;
  };
  readonly pivot?: {
    readonly labelPivotModeToggle: string;
  };
}

export interface ColumnManagerFrameProps {
  readonly showPivotToggle?: boolean;
}

export function ColumnManagerFrame({ showPivotToggle }: ColumnManagerFrameProps) {
  const config = cc.columnManager.use();
  const Icon = config.searchInput?.icon ?? SearchIcon;

  const { state } = useGrid();

  const pivotMode = state.columnPivotModeIsOn.use();

  const [query, setQuery] = useState("");

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
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
            <Toggle on={pivotMode} onChange={(b) => state.columnPivotModeIsOn.set(b)} />
            <label className="lng1771-text-medium">{config.pivot?.labelPivotModeToggle}</label>
          </div>
        )}
      </div>
      <Separator dir="horizontal" />
    </div>
  );
}
