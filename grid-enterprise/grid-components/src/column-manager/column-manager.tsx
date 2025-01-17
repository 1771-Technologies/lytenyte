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
import { ColumnTree } from "./column-tree/column-tree";
import { RowGroupsBox } from "./box-drop-zone/row-groups-box";
import { ColumnPivotsBox } from "./box-drop-zone/column-pivots-box";
import { MeasuresBox } from "./box-drop-zone/measures-box";
import { ValuesBox } from "./box-drop-zone/values-box";

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
            <Toggle on={pivotMode} onChange={(b) => state.columnPivotModeIsOn.set(b)} />
            <label className="lng1771-text-medium">{config.pivot?.labelPivotModeToggle}</label>
          </div>
        )}
      </div>
      <Separator dir="horizontal" />
      <div
        className={css`
          display: grid;
          height: 100%;
          grid-template-columns: 1fr;
          grid-template-rows: 60% 1px calc(100% - 1px - 60%);
          box-sizing: border-box;

          @container (min-width: 500px) {
            grid-template-columns: 1fr 1px 1fr;
            grid-template-rows: 100%;
          }
        `}
      >
        <div>
          <ColumnTree query={query} />
        </div>
        <Separator
          dir="vertical"
          className={css`
            display: none;

            @container (min-width: 500px) {
              display: block;
            }
          `}
        />
        <Separator
          dir="horizontal"
          className={css`
            display: block;
            @container (min-width: 500px) {
              display: none;
            }
          `}
        />
        <div>
          <div
            className={css`
              padding: ${t.spacing.space_30};
            `}
          >
            <RowGroupsBox />
          </div>
          <Separator dir="horizontal" />
          {pivotMode && (
            <>
              <div
                className={css`
                  padding: ${t.spacing.space_30};
                `}
              >
                <ColumnPivotsBox />
              </div>
              <Separator dir="horizontal" />
            </>
          )}
          {pivotMode && (
            <>
              <div
                className={css`
                  padding: ${t.spacing.space_30};
                `}
              >
                <MeasuresBox />
              </div>

              <Separator dir="horizontal" />
            </>
          )}
          {!pivotMode && (
            <>
              <div
                className={css`
                  padding: ${t.spacing.space_30};
                `}
              >
                <ValuesBox />
              </div>

              <Separator dir="horizontal" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
