import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const columns: Grid.Column[] = [
  {
    id: "age",
    colSpan: (c) => {
      return c.rowIndex === 0 || c.rowIndex === 12 ? 3 : 1;
    },
  },
  {
    id: "job",
    colSpan: (c) => {
      return c.rowIndex === 2 ? 3 : 1;
    },
  },
  { id: "balance" },
  {
    id: "education",
    colSpan: (t) => {
      if (t.rowIndex === 4) return 2;
      if (t.rowIndex === 12) return 2;
      return 1;
    },
    rowSpan: (t) => {
      if (t.rowIndex === 4) return 3;
      if (t.rowIndex === 8) return 3;
      if (t.rowIndex === 12) return 2;
      return 1;
    },
  },
  { id: "marital" },
  { id: "default" },
  { id: "housing", colSpan: 2 },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", colSpan: 2 },
  { id: "y" },
];

export default function CellSpans({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} />;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { userEvent } = await import("vitest/browser");
  const { wait, getCellQuery } = await import("../utils.js");
  const { render } = await import("vitest-browser-react");

  test("when there are column spans the grid should be able to navigate across the cells", async () => {
    const screen = await render(<CellSpans />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    let expected = [
      "30",
      "Primary",
      "Married",
      "No",
      "No",
      "Cellular",
      "19",
      "Oct",
      "79",
      "1",
      "-1",
      "0",
      "Unknown",
    ];

    const verify = async () => {
      for (const ex of expected) {
        await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
        await userEvent.keyboard("{ArrowRight}");
        await wait(80);
      }

      for (const ex of expected.toReversed()) {
        await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
        await userEvent.keyboard("{ArrowLeft}");
        await wait(80);
      }
    };

    await verify();

    (document.querySelector(getCellQuery("x", 2, 0)) as HTMLElement).focus();
    expected = [
      "35",
      "Management",
      "Single",
      "No",
      "Yes",
      "Cellular",
      "16",
      "Apr",
      "185",
      "1",
      "330",
      "1",
      "Failure",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 4, 0)) as HTMLElement).focus();
    expected = [
      "59",
      "Blue-collar",
      "0",
      "Secondary",
      "No",
      "Yes",
      "Unknown",
      "5",
      "May",
      "226",
      "1",
      "-1",
      "0",
      "Unknown",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 5, 0)) as HTMLElement).focus();
    expected = [
      "35",
      "Management",
      "747",
      "Secondary",
      "No",
      "No",
      "Cellular",
      "23",
      "Feb",
      "141",
      "2",
      "176",
      "3",
      "Failure",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 6, 0)) as HTMLElement).focus();
    expected = [
      "36",
      "Self-employed",
      "307",
      "Secondary",
      "No",
      "Yes",
      "Cellular",
      "14",
      "May",
      "341",
      "1",
      "330",
      "2",
      "Other",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 8, 0)) as HTMLElement).focus();
    expected = [
      "41",
      "Entrepreneur",
      "221",
      "Tertiary",
      "Married",
      "No",
      "Yes",
      "Unknown",
      "14",
      "May",
      "57",
      "2",
      "-1",
      "0",
      "Unknown",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 9, 0)) as HTMLElement).focus();
    expected = [
      "43",
      "Service",
      "-88",
      "Tertiary",
      "Married",
      "No",
      "Yes",
      "Cellular",
      "17",
      "Apr",
      "313",
      "1",
      "147",
      "2",
      "Failure",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 10, 0)) as HTMLElement).focus();
    expected = [
      "39",
      "Service",
      "9374",
      "Tertiary",
      "Married",
      "No",
      "Yes",
      "Unknown",
      "20",
      "May",
      "273",
      "1",
      "-1",
      "0",
      "Unknown",
    ];
    await verify();

    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Unknown");
    await userEvent.keyboard("{Control>}{ArrowLeft}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("39");

    (document.querySelector(getCellQuery("x", 12, 0)) as HTMLElement).focus();
    expected = ["36", "Tertiary", "No", "No", "Cellular", "13", "Aug", "328", "2", "-1", "0", "Unknown"];
    await verify();

    (document.querySelector(getCellQuery("x", 13, 0)) as HTMLElement).focus();
    expected = [
      "20",
      "Student",
      "502",
      "Tertiary",
      "No",
      "No",
      "Cellular",
      "30",
      "Apr",
      "261",
      "1",
      "-1",
      "0",
      "Unknown",
    ];
    await verify();
  });

  test("when there are column spans the grid should be able to navigate across the cells rlt", async () => {
    const screen = await render(<CellSpans rtl />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(100); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    let expected = [
      "30",
      "Primary",
      "Married",
      "No",
      "No",
      "Cellular",
      "19",
      "Oct",
      "79",
      "1",
      "-1",
      "0",
      "Unknown",
    ];

    const verify = async () => {
      for (const ex of expected) {
        await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
        await userEvent.keyboard("{ArrowLeft}");
        await wait(80);
      }

      for (const ex of expected.toReversed()) {
        await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
        await userEvent.keyboard("{ArrowRight}");
        await wait(80);
      }
    };

    await verify();

    (document.querySelector(getCellQuery("x", 2, 0)) as HTMLElement).focus();
    expected = [
      "35",
      "Management",
      "Single",
      "No",
      "Yes",
      "Cellular",
      "16",
      "Apr",
      "185",
      "1",
      "330",
      "1",
      "Failure",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 4, 0)) as HTMLElement).focus();
    expected = [
      "59",
      "Blue-collar",
      "0",
      "Secondary",
      "No",
      "Yes",
      "Unknown",
      "5",
      "May",
      "226",
      "1",
      "-1",
      "0",
      "Unknown",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 5, 0)) as HTMLElement).focus();
    expected = [
      "35",
      "Management",
      "747",
      "Secondary",
      "No",
      "No",
      "Cellular",
      "23",
      "Feb",
      "141",
      "2",
      "176",
      "3",
      "Failure",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 6, 0)) as HTMLElement).focus();
    expected = [
      "36",
      "Self-employed",
      "307",
      "Secondary",
      "No",
      "Yes",
      "Cellular",
      "14",
      "May",
      "341",
      "1",
      "330",
      "2",
      "Other",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 8, 0)) as HTMLElement).focus();
    expected = [
      "41",
      "Entrepreneur",
      "221",
      "Tertiary",
      "Married",
      "No",
      "Yes",
      "Unknown",
      "14",
      "May",
      "57",
      "2",
      "-1",
      "0",
      "Unknown",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 9, 0)) as HTMLElement).focus();
    expected = [
      "43",
      "Service",
      "-88",
      "Tertiary",
      "Married",
      "No",
      "Yes",
      "Cellular",
      "17",
      "Apr",
      "313",
      "1",
      "147",
      "2",
      "Failure",
    ];
    await verify();

    (document.querySelector(getCellQuery("x", 10, 0)) as HTMLElement).focus();
    expected = [
      "39",
      "Service",
      "9374",
      "Tertiary",
      "Married",
      "No",
      "Yes",
      "Unknown",
      "20",
      "May",
      "273",
      "1",
      "-1",
      "0",
      "Unknown",
    ];
    await verify();

    await userEvent.keyboard("{Control>}{ArrowLeft}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Unknown");
    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("39");

    (document.querySelector(getCellQuery("x", 12, 0)) as HTMLElement).focus();
    expected = ["36", "Tertiary", "No", "No", "Cellular", "13", "Aug", "328", "2", "-1", "0", "Unknown"];
    await verify();

    (document.querySelector(getCellQuery("x", 13, 0)) as HTMLElement).focus();
    expected = [
      "20",
      "Student",
      "502",
      "Tertiary",
      "No",
      "No",
      "Cellular",
      "30",
      "Apr",
      "261",
      "1",
      "-1",
      "0",
      "Unknown",
    ];
    await verify();
  });

  test("should be able to navigate across column and row spans", async () => {
    const screen = await render(<CellSpans />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 3)) as HTMLElement;
    ourFirstCell.focus();

    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Primary");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Management");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Tertiary");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Tertiary");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Married");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Married");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Married");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Tertiary");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Tertiary");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Tertiary");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Tertiary");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Tertiary");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Management");
  });

  test("page up and down should focus the correct cells", async () => {
    const screen = await render(<CellSpans />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 3)) as HTMLElement;
    ourFirstCell.focus();

    await userEvent.keyboard("{PageDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Secondary");
    await userEvent.keyboard("{PageUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Primary");
  });

  test("home and end should work as expected", async () => {
    const screen = await render(<CellSpans />);
    await wait(100);
    const grid = screen.getByRole("grid");

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render
    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 3)) as HTMLElement;
    ourFirstCell.focus();

    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Primary");
    await userEvent.keyboard("{End}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Unknown");
    await userEvent.keyboard("{Home}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
    await userEvent.keyboard("{Control>}{End}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Unknown");
    await userEvent.keyboard("{Control>}{Home}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
  });
}
