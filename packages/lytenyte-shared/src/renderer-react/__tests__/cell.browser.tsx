import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { CellReact } from "../cell.js";

describe("CellReact", () => {
  test("should create a cell with the correct data attributes", async () => {
    const screen = render(
      <CellReact
        cell={{
          colIndex: 1,
          colSpan: 1,
          rowIndex: 1,
          rowSpan: 1,
        }}
        detailHeight={0}
        isEditing={false}
        rtl={false}
        viewportWidth={200}
        xPosition={new Uint32Array([0, 20, 40])}
        yPosition={new Uint32Array([0, 23, 60])}
      >
        My cell
      </CellReact>,
    );

    const cell = screen.getByRole("gridcell");
    await expect.element(cell).toBeVisible();

    await expect.element(cell).toHaveAttribute("data-ln-rowindex", "1");
    await expect.element(cell).toHaveAttribute("data-ln-rowspan", "1");
    await expect.element(cell).toHaveAttribute("data-ln-colindex", "1");
    await expect.element(cell).toHaveAttribute("data-ln-colspan", "1");
    await expect.element(cell).toHaveAttribute("data-ln-cell", "true");
    await expect.element(cell).not.toHaveAttribute("data-ln-last-top-pin");
    await expect.element(cell).not.toHaveAttribute("data-ln-first-bottom-pin");
    await expect.element(cell).not.toHaveAttribute("data-ln-last-start-pin");
    await expect.element(cell).not.toHaveAttribute("data-ln-first-end-pin");
    await expect.element(cell).toHaveAttribute("tabindex", "0");
  });

  test("should create a cell with the correct data attributes when is pinned", async () => {
    const screen = render(
      <CellReact
        cell={{
          colIndex: 1,
          colSpan: 1,
          rowIndex: 1,
          rowSpan: 1,
          colFirstEndPin: true,
          colLastStartPin: true,
          colPin: "end",
          rowFirstPinBottom: true,
          rowLastPinTop: true,
          rowPin: "top",
        }}
        detailHeight={0}
        isEditing
        rtl={false}
        viewportWidth={200}
        xPosition={new Uint32Array([0, 20, 40])}
        yPosition={new Uint32Array([0, 23, 60])}
      >
        My cell
      </CellReact>,
    );

    const cell = screen.getByRole("gridcell");
    await expect.element(cell).toBeVisible();

    await expect.element(cell).toHaveAttribute("data-ln-rowindex", "1");
    await expect.element(cell).toHaveAttribute("data-ln-rowspan", "1");
    await expect.element(cell).toHaveAttribute("data-ln-colindex", "1");
    await expect.element(cell).toHaveAttribute("data-ln-colspan", "1");
    await expect.element(cell).toHaveAttribute("data-ln-cell", "true");
    await expect.element(cell).toHaveAttribute("data-ln-last-top-pin");
    await expect.element(cell).toHaveAttribute("data-ln-first-bottom-pin");
    await expect.element(cell).toHaveAttribute("data-ln-last-start-pin");
    await expect.element(cell).toHaveAttribute("data-ln-first-end-pin");
    await expect.element(cell).toHaveAttribute("tabindex", "-1");
  });
});
