import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import FullWidthRow from "./full-width-row.play.js";
import { wait } from "@1771technologies/lytenyte-shared";

test("should display full width rows and they should remain sticky even with scrolls", async () => {
  const screen = render(<FullWidthRow />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_001");

  const grid = screen.getByRole("grid").element();

  grid.scrollBy({ left: 200, top: 400 });
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_002");

  grid.scrollBy({ left: 40000, top: 400 });
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_003");
});

test("should display full width rows and they should remain sticky even with scrolls rtl", async () => {
  const screen = render(<FullWidthRow rtl />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_001-rtl");

  const grid = screen.getByRole("grid").element();

  grid.scrollBy({ left: -200, top: 400 });
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_002-rtl");

  grid.scrollBy({ left: -40000, top: 400 });
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_003-rtl");
});
