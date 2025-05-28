import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { page, server, type Locator } from "@vitest/browser/context";
import { beforeAll } from "vitest";
import { expect } from "@storybook/test";
import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview.js";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

beforeAll(project.beforeAll);

expect.extend({
  async toMatchScreenshot(received: Locator | Element, expected: string, ...args) {
    // @ts-expect-error these commands do exist but to lazy to properly type them - I'll be refactoring
    // this soon enough.
    const { existsFile, compareImages, removeFile } = server.commands;

    // Grab the file path where we want to save our snapshots.
    // @ts-expect-error this will be defined
    const filePath = this.snapshotState.testFilePath;
    const testFileName = filePath.split("/").pop()!.replace(".tsx", "");
    const pathPref = `./(snap)/${testFileName}/${this.currentTestName}`;
    const expectPath = `${pathPref}/${expected}.png`;
    const resultPath = `${pathPref}/${expected}.actual.png`;

    const snapExists = await existsFile(expectPath);
    if (!snapExists) {
      await page.screenshot({ element: received, path: expectPath });

      console.log(`Successfully written image snapshot: ${expected}`);
      return { pass: true, message: () => "" };
    }

    // Create our actual screen shot. This will be compared with the current one on the server
    await page.screenshot({ element: received, path: resultPath });

    // Try compare images and see the result.
    let pass: any;
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
      await removeFile(resultPath);
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
