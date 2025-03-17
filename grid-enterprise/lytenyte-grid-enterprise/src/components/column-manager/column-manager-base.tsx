import "./column-manager-base.css";
import { ColumnPivotsBox } from "./box-drop-zone/column-pivots-box";
import { MeasuresBox } from "./box-drop-zone/measures-box";
import { RowGroupsBox } from "./box-drop-zone/row-groups-box";
import { ValuesBox } from "./box-drop-zone/values-box";
import { ColumnTree } from "./column-tree/column-tree";
import { useGrid } from "../../use-grid";
import { Separator } from "../../components-internal/separator";

export function ColumnManagerBase({ query }: { query: string }) {
  const { state } = useGrid();

  const pivotMode = state.columnPivotModeIsOn.use();
  return (
    <div className="lng1771-column-manager__container">
      <div>
        <ColumnTree query={query} />
      </div>

      <Separator dir="vertical" className="lng1771-column-manager__separator--vertical" />
      <Separator dir="horizontal" className="lng1771-column-manager__separator--horizontal" />

      <div>
        <div className="lng1771-column-manager__drag-box">
          <RowGroupsBox />
        </div>
        <Separator dir="horizontal" />
        {pivotMode && (
          <>
            <div className="lng1771-column-manager__drag-box">
              <ColumnPivotsBox />
            </div>
            <Separator dir="horizontal" />
          </>
        )}
        {pivotMode && (
          <>
            <div className="lng1771-column-manager__drag-box">
              <MeasuresBox />
            </div>
            <Separator dir="horizontal" />
          </>
        )}
        {!pivotMode && (
          <>
            <div className="lng1771-column-manager__drag-box">
              <ValuesBox />
            </div>
            <Separator dir="horizontal" />
          </>
        )}
      </div>
    </div>
  );
}
