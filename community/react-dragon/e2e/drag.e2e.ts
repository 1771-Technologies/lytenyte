import { test, expect } from "@1771technologies/aio/playwright";
import { getUrl } from "./get-url.js";

test("drag between containers", async ({ page }) => {
  await page.goto(getUrl("list"));

  const drag = page.getByTestId("drag-handle");
  const dropOdd = page.getByTestId("drop-odd");
  const dropEven = page.getByTestId("drop-even");

  await expect(drag).toBeVisible();
  await expect(dropOdd).toBeVisible();
  await expect(dropEven).toBeVisible();
  await expect(page).toHaveScreenshot("list-01-initial.png");

  await drag.dragTo(dropEven);
  await expect(dropEven).toHaveText("0");

  await expect(page).toHaveScreenshot("list-02-after-drag-to-even.png");

  await drag.dragTo(dropOdd);
  await expect(dropOdd).toHaveText("1");

  await expect(page).toHaveScreenshot("list-03-after-drag-to-odd.png");

  await drag.dragTo(dropOdd);

  await page.waitForTimeout(2000);

  await expect(dropOdd).toHaveText("1");
  await expect(page).toHaveScreenshot("list-04-drop-rejected.png");
  await expect(drag).toHaveText("H");
});

test("drag in nested container", async ({ page }) => {
  await page.goto(getUrl("nested"));

  const drag = page.getByTestId("drag-handle");
  const dropOdd = page.getByTestId("drop-odd");
  const dropEven = page.getByTestId("drop-even");
  const dropAny = page.getByTestId("drop-any");

  await expect(drag).toBeVisible();
  await expect(dropOdd).toBeVisible();
  await expect(dropEven).toBeVisible();
  await expect(dropAny).toBeVisible();

  await expect(page).toHaveScreenshot("nested-01-initial.png");

  await drag.dragTo(dropAny, { targetPosition: { x: 3, y: 3 } });
  await expect(page).toHaveScreenshot("nested-02-after-any.png");

  await drag.dragTo(dropOdd, { targetPosition: { x: 3, y: 3 } });
  await expect(page).toHaveScreenshot("nested-03-after-odd.png");

  await drag.dragTo(dropEven, { targetPosition: { x: 3, y: 3 } });
  await expect(page).toHaveScreenshot("nested-04-after-even.png");
});
