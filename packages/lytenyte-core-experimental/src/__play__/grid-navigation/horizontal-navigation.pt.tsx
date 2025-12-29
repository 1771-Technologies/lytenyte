import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import NormalLayout from "./normal-layout.play.js";
import PinGapped from "./pinned-gap-layout.play.js";
import { userEvent } from "vitest/browser";
import { wait } from "@1771technologies/lytenyte-shared";
import CellSpans from "./cell-spans.play.js";
import CellWithTabbables from "./cell-with-tabbables.play.js";
import FullWidthRows from "./full-width-rows.play.js";
import CellSpansLarge from "./cell-spans-large.play.js";
import CellSpansWithPins from "./cell-spans-with-pins.play.js";
import ColumnGroups from "./column-groups.play.js";
import { getCellQuery } from "../utils.js";

test("when the grid is rendered tabbing through show skip cells inside", async () => {
  const screen = await render(<NormalLayout />);
  const start = screen.getByText("Top Capture");

  await expect.element(start).toBeVisible();
  start.element().focus();
  await expect.element(start).toHaveFocus();

  await userEvent.keyboard("{Tab}");
  const grid = screen.getByRole("grid");
  await expect.element(grid).toHaveFocus();

  await userEvent.keyboard("{Tab}");
  await expect.element(screen.getByText("Bottom Capture")).toHaveFocus();

  await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await expect.element(grid).toHaveFocus();
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await expect.element(start).toHaveFocus();
  await userEvent.keyboard("{Tab}");
  await userEvent.keyboard("{Tab}");

  await wait(100);
  await expect.element(screen.getByText("Bottom Capture")).toHaveFocus();
});

test("when a cell is focused, we can navigate to the start and end", async () => {
  const screen = await render(<NormalLayout />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 2, 0)) as HTMLElement;
  ourFirstCell.focus();

  await expect.element(ourFirstCell).toHaveFocus();
  const expected = [
    "35",
    "management",
    "1350",
    "tertiary",
    "single",
    "no",
    "yes",
    "no",
    "cellular",
    "16",
    "apr",
    "185",
    "1",
    "330",
    "1",
    "failure",
    "no",
  ];

  for (const ex of expected) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowRight}");
    await wait();
  }
  // Pressing arrow right again should result in a no op
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent(expected.at(-1)!);

  // Now go in reverse
  for (const ex of expected.toReversed()) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
  }
});

test("when a cell is focused, we can navigate to the start and end in rtl", async () => {
  const screen = await render(<NormalLayout rtl />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 2, 0)) as HTMLElement;
  await wait(100);
  ourFirstCell.focus();

  await expect.element(ourFirstCell).toHaveFocus();
  const expected = [
    "35",
    "management",
    "1350",
    "tertiary",
    "single",
    "no",
    "yes",
    "no",
    "cellular",
    "16",
    "apr",
    "185",
    "1",
    "330",
    "1",
    "failure",
    "no",
  ];

  for (const ex of expected) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
  }
  // Pressing arrow right again should result in a no op
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent(expected.at(-1)!);

  // Now go in reverse
  for (const ex of expected.toReversed()) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowRight}");
    await wait();
  }
});

test("when there columns pinned left and right and there is a gap the navigation should still work", async () => {
  const screen = await render(<PinGapped rtl />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 2, 0)) as HTMLElement;
  ourFirstCell.focus();

  await expect.element(ourFirstCell).toHaveFocus();
  const expected = ["35", "management", "single", "yes"];

  for (const ex of expected) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
  }
  // Pressing arrow right again should result in a no op
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent(expected.at(-1)!);

  // Now go in reverse
  for (const ex of expected.toReversed()) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowRight}");
    await wait();
  }
});

test("when there are column spans the grid should be able to navigate across the cells", async () => {
  const screen = await render(<CellSpans />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  let expected = [
    "30",
    "primary",
    "married",
    "no",
    "no",
    "cellular",
    "19",
    "oct",
    "79",
    "1",
    "-1",
    "0",
    "unknown",
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
    "management",
    "single",
    "no",
    "yes",
    "cellular",
    "16",
    "apr",
    "185",
    "1",
    "330",
    "1",
    "failure",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 4, 0)) as HTMLElement).focus();
  expected = [
    "59",
    "blue-collar",
    "0",
    "secondary",
    "no",
    "yes",
    "unknown",
    "5",
    "may",
    "226",
    "1",
    "-1",
    "0",
    "unknown",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 5, 0)) as HTMLElement).focus();
  expected = [
    "35",
    "management",
    "747",
    "secondary",
    "no",
    "no",
    "cellular",
    "23",
    "feb",
    "141",
    "2",
    "176",
    "3",
    "failure",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 6, 0)) as HTMLElement).focus();
  expected = [
    "36",
    "self-employed",
    "307",
    "secondary",
    "no",
    "yes",
    "cellular",
    "14",
    "may",
    "341",
    "1",
    "330",
    "2",
    "other",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 8, 0)) as HTMLElement).focus();
  expected = [
    "41",
    "entrepreneur",
    "221",
    "tertiary",
    "married",
    "no",
    "yes",
    "unknown",
    "14",
    "may",
    "57",
    "2",
    "-1",
    "0",
    "unknown",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 9, 0)) as HTMLElement).focus();
  expected = [
    "43",
    "service",
    "-88",
    "tertiary",
    "married",
    "no",
    "yes",
    "cellular",
    "17",
    "apr",
    "313",
    "1",
    "147",
    "2",
    "failure",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 10, 0)) as HTMLElement).focus();
  expected = [
    "39",
    "service",
    "9374",
    "tertiary",
    "married",
    "no",
    "yes",
    "unknown",
    "20",
    "may",
    "273",
    "1",
    "-1",
    "0",
    "unknown",
  ];
  await verify();

  await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("unknown");
  await userEvent.keyboard("{Control>}{ArrowLeft}{/Control}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("39");

  (document.querySelector(getCellQuery("x", 12, 0)) as HTMLElement).focus();
  expected = ["36", "tertiary", "no", "no", "cellular", "13", "aug", "328", "2", "-1", "0", "unknown"];
  await verify();

  (document.querySelector(getCellQuery("x", 13, 0)) as HTMLElement).focus();
  expected = [
    "20",
    "student",
    "502",
    "tertiary",
    "no",
    "no",
    "cellular",
    "30",
    "apr",
    "261",
    "1",
    "-1",
    "0",
    "unknown",
  ];
  await verify();
});

test("when there are column spans the grid should be able to navigate across the cells rlt", async () => {
  const screen = await render(<CellSpans rtl />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(100); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  let expected = [
    "30",
    "primary",
    "married",
    "no",
    "no",
    "cellular",
    "19",
    "oct",
    "79",
    "1",
    "-1",
    "0",
    "unknown",
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
    "management",
    "single",
    "no",
    "yes",
    "cellular",
    "16",
    "apr",
    "185",
    "1",
    "330",
    "1",
    "failure",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 4, 0)) as HTMLElement).focus();
  expected = [
    "59",
    "blue-collar",
    "0",
    "secondary",
    "no",
    "yes",
    "unknown",
    "5",
    "may",
    "226",
    "1",
    "-1",
    "0",
    "unknown",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 5, 0)) as HTMLElement).focus();
  expected = [
    "35",
    "management",
    "747",
    "secondary",
    "no",
    "no",
    "cellular",
    "23",
    "feb",
    "141",
    "2",
    "176",
    "3",
    "failure",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 6, 0)) as HTMLElement).focus();
  expected = [
    "36",
    "self-employed",
    "307",
    "secondary",
    "no",
    "yes",
    "cellular",
    "14",
    "may",
    "341",
    "1",
    "330",
    "2",
    "other",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 8, 0)) as HTMLElement).focus();
  expected = [
    "41",
    "entrepreneur",
    "221",
    "tertiary",
    "married",
    "no",
    "yes",
    "unknown",
    "14",
    "may",
    "57",
    "2",
    "-1",
    "0",
    "unknown",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 9, 0)) as HTMLElement).focus();
  expected = [
    "43",
    "service",
    "-88",
    "tertiary",
    "married",
    "no",
    "yes",
    "cellular",
    "17",
    "apr",
    "313",
    "1",
    "147",
    "2",
    "failure",
  ];
  await verify();

  (document.querySelector(getCellQuery("x", 10, 0)) as HTMLElement).focus();
  expected = [
    "39",
    "service",
    "9374",
    "tertiary",
    "married",
    "no",
    "yes",
    "unknown",
    "20",
    "may",
    "273",
    "1",
    "-1",
    "0",
    "unknown",
  ];
  await verify();

  await userEvent.keyboard("{Control>}{ArrowLeft}{/Control}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("unknown");
  await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("39");

  (document.querySelector(getCellQuery("x", 12, 0)) as HTMLElement).focus();
  expected = ["36", "tertiary", "no", "no", "cellular", "13", "aug", "328", "2", "-1", "0", "unknown"];
  await verify();

  (document.querySelector(getCellQuery("x", 13, 0)) as HTMLElement).focus();
  expected = [
    "20",
    "student",
    "502",
    "tertiary",
    "no",
    "no",
    "cellular",
    "30",
    "apr",
    "261",
    "1",
    "-1",
    "0",
    "unknown",
  ];
  await verify();
});

test("when cells have interactive elements they should be navigable", async () => {
  const screen = await render(<CellWithTabbables />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("married");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");

  (document.querySelector(getCellQuery("x", 5, 2)) as HTMLElement).focus();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("747");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
  (document.activeElement!.nextElementSibling as HTMLElement).focus();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Not Tabbable");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
  (document.activeElement!.previousElementSibling as HTMLElement).focus();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Not Tabbable");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
});

test("when cells have interactive elements they should be navigable rtl", async () => {
  const screen = await render(<CellWithTabbables rtl />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("married");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");

  (document.querySelector(getCellQuery("x", 5, 2)) as HTMLElement).focus();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("747");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
  (document.activeElement!.nextElementSibling as HTMLElement).focus();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Not Tabbable");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
  (document.activeElement!.previousElementSibling as HTMLElement).focus();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Not Tabbable");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
});

test("full width row navigation should correctly handle the tabbables", async () => {
  const screen = await render(<FullWidthRows />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (
    document.querySelector(
      `[data-ln-gridid="x"][data-ln-rowtype="full-width"][data-ln-rowindex="2"] > div `,
    ) as HTMLElement
  ).focus();
  await wait();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
  await userEvent.keyboard("{ArrowLeft}");
  await wait();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
  await userEvent.keyboard("{ArrowRight}");
  await wait();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");

  (
    document.querySelector(
      `[data-ln-gridid="x"][data-ln-rowtype="full-width"][data-ln-rowindex="4"] > div `,
    ) as HTMLElement
  ).focus();
  await wait();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
});

test("full width row navigation should correctly handle the tabbables rtl", async () => {
  const screen = await render(<FullWidthRows rtl />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (
    document.querySelector(
      `[data-ln-gridid="x"][data-ln-rowtype="full-width"][data-ln-rowindex="2"] > div `,
    ) as HTMLElement
  ).focus();
  await wait();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
  await userEvent.keyboard("{ArrowRight}");
  await wait();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
  await userEvent.keyboard("{ArrowLeft}");
  await wait();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");

  (
    document.querySelector(
      `[data-ln-gridid="x"][data-ln-rowtype="full-width"][data-ln-rowindex="4"] > div `,
    ) as HTMLElement
  ).focus();
  await wait();
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
});

test("when a column span is large navigation should still work", async () => {
  const screen = await render(<CellSpansLarge />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait(100);

  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("-1");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("0");
  await userEvent.keyboard("{ArrowRight}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("unknown");
  await userEvent.keyboard("{ArrowLeft}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("0");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("-1");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
});

test("when a column span is large navigation should still work rtl", async () => {
  const screen = await render(<CellSpansLarge rtl />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("-1");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("0");
  await userEvent.keyboard("{ArrowLeft}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("unknown");
  await userEvent.keyboard("{ArrowRight}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("0");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("-1");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
});

test("when the columns are pinned should be navigate across them", async () => {
  const screen = await render(<CellSpansWithPins />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  const expected = ["30", "no", "no", "oct", "79", "1", "-1", "0", "unknown", "cellular", "19"];
  for (const ex of expected) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowRight}");
    await wait();
  }
  for (const ex of expected.toReversed()) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
  }

  await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("19");
  await userEvent.keyboard("{Control>}{ArrowLeft}{/Control}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
});

test("when the columns are pinned should be navigate across them", async () => {
  const screen = await render(<CellSpansWithPins rtl />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  const expected = ["30", "no", "no", "oct", "79", "1", "-1", "0", "unknown", "cellular", "19"];
  for (const ex of expected) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
  }
  for (const ex of expected.toReversed()) {
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
    await userEvent.keyboard("{ArrowRight}");
    await wait();
  }

  await userEvent.keyboard("{Control>}{ArrowLeft}{/Control}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("19");
  await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
  await wait(100);
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
});

test("when the floating cell is focused should be to navigate through it", async () => {
  const screen = await render(<ColumnGroups />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("age");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("housing");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
});

test("when the header is focused should be to navigate through it", async () => {
  const screen = await render(<ColumnGroups />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  await userEvent.keyboard("{ArrowUp}");
  await wait();
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("age");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("housing");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
});

test("when the header group is focused should be able to navigate through", async () => {
  const screen = await render(<ColumnGroups />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
  await wait();

  await userEvent.keyboard("{ArrowUp}");
  await userEvent.keyboard("{ArrowUp}");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A-->B");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("T");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
  await userEvent.keyboard("{ArrowRight}");
  await userEvent.keyboard("{ArrowRight}");
  await userEvent.keyboard("{ArrowRight}");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("contact");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A-->B-->C");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement as HTMLElement).toHaveTextContent("day");
});
