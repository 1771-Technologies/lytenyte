import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { RowReact } from "../row.js";

describe("RowReact", () => {
  test("should renderer the correct attributes", async () => {
    const screen = render(
      <RowReact
        accepted={[]}
        gridId="x"
        rowFirstPinBottom={undefined}
        rowLastPinTop={undefined}
        rowIndex={1}
        rowIsFocusRow={false}
        yPositions={new Uint32Array([0, 100, 200, 300])}
      >
        Row
      </RowReact>,
    );

    const row = screen.getByRole("row");
    await expect.element(row).toBeVisible();
    await expect.element(row).toHaveAttribute("data-ln-row");
    await expect.element(row).toHaveAttribute("data-ln-gridid", "x");
    await expect.element(row).toHaveAttribute("data-ln-rowindex", "1");
    await expect.element(row).toHaveAttribute("data-ln-rowtype", "normal-row");
    await expect.element(row).not.toHaveAttribute("data-ln-last-top-pin");
    await expect.element(row).not.toHaveAttribute("data-ln-first-bottom-pin");
  });

  test("should renderer the correct attributes with pins", async () => {
    const screen = render(
      <RowReact
        accepted={[]}
        gridId="x"
        rowFirstPinBottom
        rowLastPinTop
        rowIndex={1}
        rowIsFocusRow={false}
        yPositions={new Uint32Array([0, 100, 200, 300])}
      >
        Row
      </RowReact>,
    );

    const row = screen.getByRole("row");
    await expect.element(row).toBeVisible();
    await expect.element(row).toHaveAttribute("data-ln-row");
    await expect.element(row).toHaveAttribute("data-ln-gridid", "x");
    await expect.element(row).toHaveAttribute("data-ln-rowindex", "1");
    await expect.element(row).toHaveAttribute("data-ln-rowtype", "normal-row");
    await expect.element(row).toHaveAttribute("data-ln-last-top-pin");
    await expect.element(row).toHaveAttribute("data-ln-first-bottom-pin");
  });
});
