import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import BasicRendering from "./basic-rendering.play.js";
import { scrollGrid } from "./utils.js";

test("should render without any issues", async () => {
  const screen = render(<BasicRendering />);

  const grid = screen.getByRole("grid");
  await expect.element(grid).toBeVisible();

  await expect.element(grid).toMatchScreenshot("001_render_without_issues.png");

  scrollGrid(grid, { y: 2000 });

  await expect.element(grid).toMatchScreenshot("002_render_without_issues.png");

  scrollGrid(grid, { y: 2_000_000 });

  await expect.element(grid).toMatchScreenshot("003_render_without_issues.png");
});
