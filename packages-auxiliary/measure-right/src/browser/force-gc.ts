import type { Page } from "playwright";

export async function applyForceGC(page: Page) {
  await page.evaluate("window.gc({type:'major',execution:'sync',flavor:'last-resort'})");
}
