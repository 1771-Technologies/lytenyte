import { test, expect, AxeBuilder } from "@1771technologies/aio/playwright";
import { getUrl } from "./get-url.js";

test("dialog can be opened and closed", async ({ page }) => {
  await page.goto(getUrl(""));

  const openOpen = page.getByText("Show Frame");

  await openOpen.click();

  const header = page.getByRole("button").nth(1);

  await expect(header).toHaveText("This is my header content");

  await expect(page).toHaveScreenshot("initial-frame.png");

  const bb = (await header.boundingBox())!;

  await page.mouse.move(bb.x + 3, bb.y + 2);
  await page.mouse.down({ button: "left" });
  await page.waitForTimeout(200);
  await page.mouse.move(bb.x + 30, bb.y + 30);
  await page.mouse.up({ button: "left" });

  await expect(page).toHaveScreenshot("after-move.png");

  const accessibilityScan = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScan.violations).toEqual([]);

  const dialog = page.getByRole("dialog");
  await dialog.press("Escape");
  await expect(dialog).not.toBeVisible();
});
