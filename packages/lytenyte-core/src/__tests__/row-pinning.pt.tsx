import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import RowPinning from "./row-pinning.play.js";
import { userEvent } from "@vitest/browser/context";
import { scrollGrid } from "./utils.js";

test("Should be able to add row pins at will", async () => {
  const screen = render(<RowPinning />);

  const grid = screen.getByRole("grid");
  await expect.element(grid).toBeVisible();

  await userEvent.click(screen.getByText("Pin Top").element());

  await expect.element(grid).toMatchScreenshot("001_row_pinning");

  await userEvent.click(screen.getByText("Pin Bottom").element());

  await expect.element(grid).toMatchScreenshot("002_row_pinning");

  scrollGrid(grid, { y: 2000 });

  await expect.element(grid).toMatchScreenshot("003_row_pinning");

  scrollGrid(grid, { y: 2_000_000 });

  await expect.element(grid).toMatchScreenshot("004_row_pinning");

  await userEvent.click(screen.getByText("Remove Bottom").element());

  await expect.element(grid).toMatchScreenshot("005_row_pinning");

  scrollGrid(grid, { y: -2_000_000 });

  await expect.element(grid).toMatchScreenshot("006_row_pinning");

  await userEvent.click(screen.getByText("Remove Top").element());

  await expect.element(grid).toMatchScreenshot("007_row_pinning");

  await userEvent.click(screen.getByText("Empty").element());
  await userEvent.click(screen.getByText("Pin Top").element());
  await expect.element(grid).toMatchScreenshot("008_row_pinning");
  await userEvent.click(screen.getByText("Pin Bottom").element());
  await expect.element(grid).toMatchScreenshot("009_row_pinning");

  await userEvent.click(screen.getByText("Small").element());
  await expect.element(grid).toMatchScreenshot("010_row_pinning");
  await userEvent.click(screen.getByText("Full").element());
  await expect.element(grid).toMatchScreenshot("011_row_pinning");

  scrollGrid(grid, { y: 2000 });
  await expect.element(grid).toMatchScreenshot("012_row_pinning");
  await userEvent.click(screen.getByText("Small").element());
  await expect.element(grid).toMatchScreenshot("013_row_pinning");
});
