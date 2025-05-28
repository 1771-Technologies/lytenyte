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

    // @ts-expect-error this will be defined
    const filePath = this.snapshotState.testFilePath;
    const testFileName = filePath.split("/").pop()!.replace(".tsx", "");

    const pathPref = `./(snap)/${testFileName}/${this.currentTestName}`;

    const expectPath = `${pathPref}/${expected}.png`;
    const resultPath = `${pathPref}/${expected}-result.png`;

    const snapExists = await existsFile(expectPath);

    if (!snapExists) {
      await page.screenshot({ element: received, path: expectPath });

      console.log(`Successfully written image snapshot: ${expected}`);
      return { pass: true, message: () => "" };
    }

    await page.screenshot({ element: received, path: resultPath });

    const pass = await compareImages(`./(snap)/${expected}.png`, resultPath);

    await removeFile(resultPath);

    return {
      pass,
      message: () => `Image comparison for ${expected} failed. Snapshot diff written.`,
    };
  },
});
