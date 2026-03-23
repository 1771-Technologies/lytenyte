import "./areas.css";
import { useState } from "react";
import type { DataRect } from "@1771technologies/lytenyte-shared";
import { Grid, useClientDataSource } from "../../index.js";
import { employeeData, type EmployeeSpec } from "./areas-data.js";
import { AreasPanel } from "./areas-panel.js";

const columns: Grid.Column<EmployeeSpec>[] = [
  { id: "id", name: "ID", width: 60, pin: "start" },
  { id: "name", name: "Name", width: 150, pin: "start" },
  { id: "certification", name: "Certification", width: 120, pin: "end" },
  { id: "region", name: "Region", width: 90, pin: "end" },
];

export default function CellSelectionAreas() {
  const [selections, setSelections] = useState<DataRect[]>([
    { rowStart: 1, rowEnd: 5, columnStart: 1, columnEnd: 4 },
    { rowStart: 1, rowEnd: 5, columnStart: 26, columnEnd: 29 },
    { rowStart: 150, rowEnd: 153, columnStart: 26, columnEnd: 29 },
    { rowStart: 150, rowEnd: 153, columnStart: 1, columnEnd: 4 },
  ]);
  const ds = useClientDataSource({
    data: [],
    topData: employeeData.slice(0, 2),
    bottomData: employeeData.slice(0, 2),
  });

  return (
    <div className="areas-demo">
      <AreasPanel selections={selections} />

      <div className="areas-grid-container">
        <Grid
          columns={columns}
          rowSource={ds}
          cellSelectionMode="multi-range"
          cellSelections={selections}
          onCellSelectionChange={setSelections}
        />
      </div>
    </div>
  );
}
