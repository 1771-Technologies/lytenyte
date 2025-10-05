import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import NormalLayout from "./normal-layout.play.js";
import { wait } from "@1771technologies/lytenyte-shared";
import { getCellQuery } from "@1771technologies/lytenyte-shared";
import { userEvent } from "@vitest/browser/context";
import { bankDataSmall } from "../test-utils/bank-data-smaller.js";
import FullWidthRows from "./full-width-rows.play.js";
import CellSpans from "./cell-spans.play.js";

test("should be able to navigate up and down cells", async () => {
  const screen = render(<NormalLayout center={50} />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement;
  ourFirstCell.focus();

  const values = bankDataSmall.slice(0, 50).map((c) => `${c.age}`);

  for (const v of values) {
    await expect.element(document.activeElement).toHaveTextContent(v);
    await userEvent.keyboard("{ArrowDown}");
    await wait(100);
  }
  for (const v of values.toReversed()) {
    await expect.element(document.activeElement).toHaveTextContent(v);
    await userEvent.keyboard("{ArrowUp}");
    await wait(100);
  }
});

test("should be able to navigate up and down cells with pins", async () => {
  const screen = render(<NormalLayout pinTop={2} pinBot={2} center={50} />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement;
  ourFirstCell.focus();

  const values = bankDataSmall
    .slice(0, 2)
    .map((c) => `${c.age}`)
    .concat(bankDataSmall.slice(0, 50).map((c) => `${c.age}`))
    .concat(bankDataSmall.slice(0, 2).map((c) => `${c.age}`));

  for (const v of values) {
    await expect.element(document.activeElement).toHaveTextContent(v);
    await userEvent.keyboard("{ArrowDown}");
    await wait(100);
  }
  for (const v of values.toReversed()) {
    await expect.element(document.activeElement).toHaveTextContent(v);
    await userEvent.keyboard("{ArrowUp}");
    await wait(100);
  }
});

test("should be able to handle moving to the start or end", async () => {
  const screen = render(<NormalLayout />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement;
  ourFirstCell.focus();
  await expect.element(document.activeElement).toHaveTextContent("30");

  await userEvent.keyboard("{Control>}{ArrowDown}{/Control}");
  await wait(200);
  await expect.element(document.activeElement).toHaveTextContent("42");
  await userEvent.keyboard("{Control>}{ArrowUp}{/Control}");
  await wait(200);
  await expect.element(document.activeElement).toHaveTextContent("30");
});

test("should be navigate across full width rows", async () => {
  const screen = render(<FullWidthRows />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 2)) as HTMLElement;
  ourFirstCell.focus();

  await expect.element(document.activeElement).toHaveTextContent("1787");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("4789");

  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("Nothing");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("1476");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("ABC");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("747");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("ABC");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("1476");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("Nothing");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("4789");
});

test("should be able to navigate across column and row spans", async () => {
  const screen = render(<CellSpans />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 3)) as HTMLElement;
  ourFirstCell.focus();

  await expect.element(document.activeElement).toHaveTextContent("primary");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("management");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("tertiary");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("tertiary");
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(document.activeElement).toHaveTextContent("married");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("married");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("married");
  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(document.activeElement).toHaveTextContent("tertiary");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("tertiary");
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("tertiary");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("tertiary");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("tertiary");
  await userEvent.keyboard("{ArrowUp}");
  await expect.element(document.activeElement).toHaveTextContent("management");
});

test("page up and down should focus the correct cells", async () => {
  const screen = render(<CellSpans />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 3)) as HTMLElement;
  ourFirstCell.focus();

  await userEvent.keyboard("{PageDown}");
  await expect.element(document.activeElement).toHaveTextContent("secondary");
  await userEvent.keyboard("{PageUp}");
  await expect.element(document.activeElement).toHaveTextContent("management");
});

test("home and end should work as expected", async () => {
  const screen = render(<CellSpans />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render
  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 3)) as HTMLElement;
  ourFirstCell.focus();

  await expect.element(document.activeElement).toHaveTextContent("primary");
  await userEvent.keyboard("{End}");
  await wait(100);
  await expect.element(document.activeElement).toHaveTextContent("unknown");
  await userEvent.keyboard("{Home}");
  await wait(100);
  await expect.element(document.activeElement).toHaveTextContent("30");
  await userEvent.keyboard("{Control>}{End}{/Control}");
  await wait(100);
  await expect.element(document.activeElement).toHaveTextContent("unknown");
  await userEvent.keyboard("{Control>}{Home}{/Control}");
  await wait(100);
  await expect.element(document.activeElement).toHaveTextContent("30");
});
