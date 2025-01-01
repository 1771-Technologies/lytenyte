import { test, expect, AxeBuilder } from "@1771technologies/aio/playwright";
import { getUrl } from "./get-url";

test("always open dialog cannot be closed", async ({ page }) => {
  await page.goto(getUrl("dialog/always-open"));

  const dialog = page.getByRole("dialog");

  await expect(dialog).toHaveText("I will never close");

  await dialog.press("Escape");
  await dialog.press("Escape");

  await expect(dialog).toBeFocused();
  await expect(dialog).toHaveText("I will never close");
  await expect(dialog).toHaveScreenshot();

  const accessibilityScan = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScan.violations).toEqual([]);
});

test("dialog can be opened and closed", async ({ page }) => {
  await page.goto(getUrl("dialog/"));

  const openOpen = page.getByText("Open Dialog Now");

  await openOpen.click();

  const dialog = page.getByRole("dialog");

  await expect(dialog).toBeVisible();

  await expect(page).toHaveScreenshot();

  const accessibilityScan = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScan.violations).toEqual([]);

  await dialog.press("Escape");
  await expect(dialog).not.toBeVisible();
});
