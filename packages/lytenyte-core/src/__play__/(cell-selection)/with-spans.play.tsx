import "./areas.css";
import { Grid, useClientDataSource } from "../../index.js";
import { employeeData, type EmployeeSpec } from "./areas-data.js";

const columns: Grid.Column<EmployeeSpec>[] = [
  { id: "id", name: "ID", width: 60 },
  { id: "name", name: "Name", width: 150 },
  {
    id: "department",
    name: "Department",
    width: 130,
    colSpan: (p) => {
      if (p.rowIndex === 2) {
        return 4;
      }
      return 1;
    },
    rowSpan: (p) => {
      if (p.rowIndex === 2) return 2;
      if (p.rowIndex === 4) return 3;
      return 1;
    },
  },
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
  { id: "certification", name: "Certification", width: 120 },
  { id: "region", name: "Region", width: 90 },
];

export default function CellSelectionWithSpans({ rtl }: { rtl?: boolean }) {
  const ds = useClientDataSource({
    data: employeeData,
  });

  return (
    <div className="areas-demo">
      <div className="areas-grid-container">
        <Grid columns={columns} rowSource={ds} cellSelectionMode="range" gridId="x" rtl={rtl} />
      </div>
    </div>
  );
}

if (import.meta.vitest) {
  const { wait } = await import("@1771technologies/js-utils");
  const { test, expect } = import.meta.vitest;
  const r = await import("vitest-browser-react");
  const utils = await import("../utils.js");
  const { userEvent } = await import("vitest/browser");

  test("Should handle keybinding expansions through spans", async () => {
    const screen = await r.render(<CellSelectionWithSpans />);
    await wait(100);

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();

    const pivotCell = utils.getCell("x", 4, 3);
    await userEvent.click(pivotCell);
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await wait();
    await expect.element(grid).toMatchScreenshot("span_001_selection");

    await userEvent.click(pivotCell);
    await wait(100);
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_002_selection");

    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await wait();
    await expect.element(grid).toMatchScreenshot("span_003_selection");
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_004_selection");

    await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_005_selection");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_006_selection");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_007_selection");
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_008_selection");

    await screen.unmount();
  });

  test("Should handle keybinding expansions through spans for RTL", async () => {
    const screen = await r.render(<CellSelectionWithSpans rtl />);
    await wait();

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await wait(80);

    const pivotCell = utils.getCell("x", 4, 3);
    await userEvent.click(pivotCell);
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await wait();
    await expect.element(grid).toMatchScreenshot("span_rtl_001_selection");

    await userEvent.click(pivotCell);
    await wait();
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_rtl_002_selection");

    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    await wait();
    await expect.element(grid).toMatchScreenshot("span_rtl_003_selection");
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_rtl_004_selection");

    await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_rtl_005_selection");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_rtl_006_selection");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_rtl_007_selection");
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");
    await expect.element(grid).toMatchScreenshot("span_rtl_008_selection");

    await screen.unmount();
  });

  test("Should handle expansions across sections with the control key and no spans", async () => {
    const screen = await r.render(<CellSelectionWithSpans />);
    await wait();
    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await wait(80);

    let pivotCell = utils.getCell("x", 0, 0);
    await userEvent.click(pivotCell);
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_001_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowUp}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_002_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowRight}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_003_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_004_expand");

    pivotCell = utils.getCell("x", 1, 1);
    await userEvent.click(pivotCell);
    await wait(50);
    await expect.element(pivotCell).toHaveTextContent("David Anderson");
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_005_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowUp}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_006_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowRight}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_007_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_008_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowUp}{/Shift}{/Control}");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowLeft}{/Shift}{/Control}");
    await wait(80);
    await expect.element(grid).toMatchScreenshot("ctrl_009_expand");
  });

  test("Should handle expansions across sections with the control key and no spans rtl", async () => {
    const screen = await r.render(<CellSelectionWithSpans rtl />);
    await wait();
    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await wait(80);

    let pivotCell = utils.getCell("x", 0, 0);
    await userEvent.click(pivotCell);
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_001_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowUp}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_002_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowLeft}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_003_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_004_expand");

    pivotCell = utils.getCell("x", 1, 1);
    await userEvent.click(pivotCell);
    await wait(50);
    await expect.element(pivotCell).toHaveTextContent("David Anderson");
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_005_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowUp}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_006_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowLeft}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_007_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_008_expand");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowUp}{/Shift}{/Control}");
    await userEvent.keyboard("{Control>}{Shift>}{ArrowRight}{/Shift}{/Control}");
    await wait(80);
    await expect.element(grid).toMatchScreenshot("ctrl_rtl_009_expand");
  });

  test("Should handle expansion across spanning areas", async () => {
    const screen = await r.render(<CellSelectionWithSpans />);
    await wait();
    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await wait(80);

    let pivotCell = utils.getCell("x", 2, 0);
    await userEvent.click(pivotCell);
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Control>}{Shift>}{ArrowRight}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_span_001_expand_with_span");

    pivotCell = utils.getCell("x", 0, 3);
    await userEvent.click(pivotCell);
    await expect.element(pivotCell).toHaveTextContent("Manager");
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_span_002_expand_with_span");
  });

  test("Should handle expansion across spanning areas rtl", async () => {
    const screen = await r.render(<CellSelectionWithSpans rtl />);
    await wait();
    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await wait(80);

    let pivotCell = utils.getCell("x", 2, 0);
    await userEvent.click(pivotCell);
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Control>}{Shift>}{ArrowLeft}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_span_rtl_001_expand_with_span");

    pivotCell = utils.getCell("x", 0, 3);
    await userEvent.click(pivotCell);
    await expect.element(pivotCell).toHaveTextContent("Manager");
    await expect.element(pivotCell).toHaveFocus();

    await userEvent.keyboard("{Control>}{Shift>}{ArrowDown}{/Shift}{/Control}");
    await expect.element(grid).toMatchScreenshot("ctrl_span_rtl_002_expand_with_span");
  });
}
