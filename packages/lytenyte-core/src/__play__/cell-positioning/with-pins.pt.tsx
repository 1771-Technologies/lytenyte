import { expect, test } from "vitest";
import WithPins from "./with-pins.play.js";
import { render } from "vitest-browser-react";
import { wait } from "@1771technologies/lytenyte-js-utils";

test("The layout should look correct when pins are presents", async () => {
  const screen = render(<WithPins />);

  const grid = screen.getByRole("grid");
  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  grid.element().focus();
  await expect.element(grid).toHaveFocus();

  await expect.element(grid).toMatchScreenshot("001-with-pins-start");
  grid.element().scrollBy({ top: 200, left: 300 });
  await wait();
  await expect.element(grid).toMatchScreenshot("002-with-pins-middle");
  grid.element().scrollBy({ top: 200, left: 2000 });
  await expect.element(grid).toMatchScreenshot("003-with-pins-end");
});

test("The layout should look correct when pins are present rtl", async () => {
  const screen = render(<WithPins rtl />);

  const grid = screen.getByRole("grid");
  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  grid.element().focus();
  await expect.element(grid).toHaveFocus();

  await expect.element(grid).toMatchScreenshot("001-with-pins-start-rtl");
  grid.element().scrollBy({ top: 200, left: -300 });
  await wait();
  await expect.element(grid).toMatchScreenshot("002-with-pins-middle-rtl");
  grid.element().scrollBy({ top: 200, left: -2000 });
  await expect.element(grid).toMatchScreenshot("003-with-pins-end-rtl");
});
