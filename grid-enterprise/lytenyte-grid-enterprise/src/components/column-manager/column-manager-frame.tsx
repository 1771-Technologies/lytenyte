import "./column-manager.css";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { ListViewAxe } from "@1771technologies/react-list-view";
import { useId, useState, type JSX, type ReactNode } from "react";
import { ColumnManagerBase } from "./column-manager-base";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { Separator } from "../../components-internal/separator";
import { useGrid } from "../../use-grid";
import { Toggle } from "../../components-internal/toggle/toggle";
import { SearchIcon } from "@1771technologies/lytenyte-grid-community/icons";

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

    readonly labelAggregationButton: (columnName: string) => string;

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

  readonly searchPlaceholder?: string;
  readonly pivotModeLabel?: string;
}

export function ColumnManagerFrame({
  showPivotToggle,
  searchPlaceholder,
  pivotModeLabel,
}: ColumnManagerFrameProps): ReactNode {
  const { state } = useGrid();

  const pivotMode = state.columnPivotModeIsOn.use();

  const [query, setQuery] = useState("");
  const id = useId();

  return (
    <div className="lng1771-column-manager">
      <div className="lng1771-column-manager__controls-root">
        <Input
          small
          className="lng1771-column-manager__search-input"
          icon={SearchIcon}
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
  );
}
