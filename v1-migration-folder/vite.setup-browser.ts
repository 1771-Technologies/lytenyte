import { page, server, type Locator } from "@vitest/browser/context";
import { expect } from "vitest";

expect.extend({
  async toMatchScreenshot(received: Locator | Element, expected: string) {
    const { existsFile, compareImages, removeFile } = server.commands;

    const expectPath = `./(snap)/${expected}.png`;
    const resultPath = `./(snap)/${expected}.actual.png`;

    const snapExists = await existsFile(expectPath);
    if (!snapExists) {
      await page.screenshot({ element: received, path: expectPath });

      console.log(`Successfully written image snapshot: ${expected}`);
      return { pass: true, message: () => "" };
    }

    // Create our actual screen shot. This will be compared with the current one on the server
    await page.screenshot({ element: received, path: resultPath });

    // Try compare images and see the result.
    let pass;
    try {
      pass = await compareImages(expectPath, resultPath);
    } catch (e: any) {
      pass = false;
      console.log(e.message);
    }

    // If the result is different but we should update the snapshot then update it.
    const shouldUpdate = (this as any).snapshotState?._updateSnapshot === "all";
    if (!pass && shouldUpdate) {
      await page.screenshot({ element: received, path: expectPath });
      console.log("Updated snapshot");
      return {
        pass: true,
        message: () => "",
      };
    } else if (pass) {
      // If we passed, then we should remove the actual file
      await removeFile(resultPath);
    }

    return {
      pass,
      message: () => `Image comparison for ${expected} failed. Snapshot diff written.`,
    };
  },
});
