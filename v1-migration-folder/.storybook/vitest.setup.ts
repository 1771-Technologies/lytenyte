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
