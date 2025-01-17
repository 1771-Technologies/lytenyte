import { t } from "@1771technologies/grid-design";
import { useGrid } from "../provider/grid-provider";
import { Separator } from "../separator/separator";
import { ColumnPivotsBox } from "./box-drop-zone/column-pivots-box";
import { MeasuresBox } from "./box-drop-zone/measures-box";
import { RowGroupsBox } from "./box-drop-zone/row-groups-box";
import { ValuesBox } from "./box-drop-zone/values-box";
import { ColumnTree } from "./column-tree/column-tree";

export function ColumnManagerBase({ query }: { query: string }) {
  const { state } = useGrid();

  const pivotMode = state.columnPivotModeIsOn.use();
  return (
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
  );
}
