import "./areas.css";
import { useState } from "react";
import type { DataRect } from "@1771technologies/lytenyte-shared";
import { Grid, useClientDataSource } from "../../index.js";
import { employeeData, type EmployeeSpec } from "./areas-data.js";
import { AreasPanel } from "./areas-panel.js";

const columns: Grid.Column<EmployeeSpec>[] = [
  { id: "id", name: "ID", width: 60, pin: "start" },
  { id: "name", name: "Name", width: 150, pin: "start" },
  { id: "department", name: "Department", width: 130 },
  { id: "role", name: "Role", width: 150 },
  { id: "salary", name: "Salary", width: 100 },

  { id: "age", name: "Age", width: 70 },
  { id: "startDate", name: "Start Date", width: 110 },
  { id: "country", name: "Country", width: 110 },
  { id: "city", name: "City", width: 110 },
  { id: "email", name: "Email", width: 220 },

  { id: "phone", name: "Phone", width: 130 },
  { id: "status", name: "Status", width: 100 },
  { id: "score", name: "Score", width: 80 },
  { id: "rating", name: "Rating", width: 120 },
  { id: "manager", name: "Manager", width: 140 },

  { id: "team", name: "Team", width: 90 },
  { id: "budget", name: "Budget", width: 100 },
  { id: "active", name: "Active", width: 80 },
  { id: "notes", name: "Notes", width: 230 },
  { id: "quarter", name: "Quarter", width: 90 },

  { id: "timezone", name: "Timezone", width: 100 },
  { id: "language", name: "Language", width: 110 },
  { id: "seniority", name: "Seniority", width: 100 },
  { id: "yearsExp", name: "Yrs Exp", width: 80 },
  { id: "lastReview", name: "Last Review", width: 120 },

  { id: "contractType", name: "Contract", width: 110 },
  { id: "projects", name: "Projects", width: 90 },
  { id: "overtime", name: "Overtime", width: 90 },
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
    data: employeeData,
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

if (import.meta.vitest) {
  const { wait } = await import("@1771technologies/js-utils");
  const { test, expect } = import.meta.vitest;
  const utils = await import("../utils.js");
  const r = await import("vitest-browser-react");

  test("should display range selections across pin boundaries without overlapping incorrectly", async () => {
    const screen = await r.render(<CellSelectionAreas />);
    await wait();

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await expect.element(grid).toMatchScreenshot("001_start_overlaps");
    utils.scrollGrid(grid, { x: 30 });
    await wait();
    await expect.element(grid).toMatchScreenshot("002_start_overlaps_with_some_scroll");
    utils.scrollGrid(grid, { x: 4_000 });
    await wait();
    await expect.element(grid).toMatchScreenshot("003_end_overlap");
    utils.scrollGrid(grid, { x: -30 });
    await wait();
    await expect.element(grid).toMatchScreenshot("004_end_overlaps_with_some_scroll");
    utils.scrollGrid(grid, { y: 30 });
    await wait();
    await expect.element(grid).toMatchScreenshot("005_row_overlaps_with_some_scroll");
    utils.scrollGrid(grid, { y: 8000 });
    await wait();
    await expect.element(grid).toMatchScreenshot("006_row_overlaps_at_bottom");
    utils.scrollGrid(grid, { y: -30 });
    await wait();
    await expect.element(grid).toMatchScreenshot("007_row_overlaps_at_bottom_overlap");
  });
}
