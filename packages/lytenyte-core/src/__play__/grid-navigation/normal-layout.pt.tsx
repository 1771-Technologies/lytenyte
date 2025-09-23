import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import Play from "./normal-layout.play.js";
import { userEvent } from "@vitest/browser/context";

test("when the grid is rendered tabbing through show skip cells inside", async () => {
  const screen = render(<Play />);
  const start = screen.getByText("Top Capture");

  await expect.element(start).toBeVisible();
  start.element().focus();
  await expect.element(start).toHaveFocus();

  await userEvent.keyboard("{Tab}");
  const grid = screen.getByRole("grid");
  await expect.element(grid).toHaveFocus();

  await userEvent.keyboard("{Tab}");
  await expect.element(screen.getByText("Bottom Capture")).toHaveFocus();

  await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await expect.element(grid).toHaveFocus();
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await expect.element(start).toHaveFocus();
  await userEvent.keyboard("{Tab}");
  await userEvent.keyboard("{Tab}");
  await expect.element(screen.getByText("Bottom Capture")).toHaveFocus();
});

// Test scenarios
/**
 
Horizontal Navigation
- Navigating across row.
- Navigate across pin gaps
- Navigate across spans
  - Span is the first column
  - Span is the last column
  - Span is in pinned section
  - Span is on a different row
- Header Navigation
- Header group navigation
- Floating row navigation

*/
