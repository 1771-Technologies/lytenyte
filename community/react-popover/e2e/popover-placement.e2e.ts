import { test, expect, AxeBuilder } from "@1771technologies/aio/playwright";
import { getUrl } from "./get-url.js";

test("should open the popover with the correct placements", async ({ page }) => {
  const placements = [
    "left",
    "left-start",
    "left-end",
    "right",
    "right-start",
    "right-end",
    "top",
    "top-start",
    "top-end",
    "bottom",
    "bottom-start",
    "bottom-end",
  ];

  await page.goto(getUrl(""));

  const select = page.locator("select");
  const open = page.getByRole("button");

  const scanner = new AxeBuilder({ page });
  for (const placement of placements) {
    await select.selectOption(placement);
    await expect(select).toHaveValue(placement);

    await open.click();

    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();
    await expect(page).toHaveScreenshot(`placement-${placement}.png`);

    expect((await scanner.analyze()).violations).toEqual([]);

    await dialog.press("Escape");
    await expect(dialog).not.toBeVisible();
  }

  expect((await scanner.analyze()).violations).toEqual([]);
});
