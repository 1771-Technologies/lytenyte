import { page, server, type Locator } from "@vitest/browser/context";
import { expect } from "vitest";

expect.extend({
  async toMatchScreenshot(received: Locator | Element, expected: string) {
    const { existsFile, compareImages, removeFile } = server.commands;

    const snapExists = await existsFile(`./(snap)/${expected}.png`);

    if (!snapExists) {
      await page.screenshot({ element: received, path: `./(snap)/${expected}.png` });

      console.log(`Successfully written image snapshot: ${expected}`);
      return { pass: true, message: () => "" };
    }

    await page.screenshot({ element: received, path: `./(snap)/${expected}-result.png` });

    const pass = await compareImages(`./(snap)/${expected}.png`, `./(snap)/${expected}-result.png`);

    await removeFile(`./(snap)/${expected}-result.png`);

    return {
      pass,
      message: () => `Image comparison for ${expected} failed. Snapshot diff written.`,
    };
  },
});
