import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { HeaderCellReact } from "../header-cell";

describe("HeaderCellReact", () => {
  test("should render the header cell with the correct attributes", async () => {
    const screen = render(
      <HeaderCellReact
        cell={{
          colStart: 1,
          colEnd: 2,
          colPin: null,
          colSpan: 1,
          rowEnd: 1,
          rowStart: 0,
        }}
        columnId="x"
        isFloating={false}
        rtl={false}
        viewportWidth={200}
        xPositions={new Uint32Array([0, 100, 200, 300, 400])}
      >
        Header
      </HeaderCellReact>,
    );

    const header = screen.getByRole("columnheader");
    await expect.element(header).toBeVisible();

    await expect.element(header).toHaveAttribute("data-ln-header-cell", "true");
    await expect.element(header).not.toHaveAttribute("data-ln-header-floating");
    await expect.element(header).toHaveAttribute("data-ln-header-id", "x");
    await expect.element(header).toHaveAttribute("data-ln-header-range", "1,2");
    await expect.element(header).toHaveAttribute("data-ln-rowindex", "0");
    await expect.element(header).toHaveAttribute("data-ln-colindex", "1");
    await expect.element(header).toHaveAttribute("data-ln-header-pin", "center");
    await expect.element(header).not.toHaveAttribute("data-ln-last-start-pin");
    await expect.element(header).not.toHaveAttribute("data-ln-first-end-pin");
  });

  test("should render the header cell with the correct attributes with full pins", async () => {
    const screen = render(
      <HeaderCellReact
        cell={{
          colStart: 1,
          colEnd: 2,
          colPin: "start",
          colSpan: 1,
          rowEnd: 1,
          rowStart: 0,
          colFirstEndPin: true,
          colLastStartPin: true,
        }}
        columnId="x"
        isFloating
        rtl={false}
        viewportWidth={200}
        xPositions={new Uint32Array([0, 100, 200, 300, 400])}
      >
        Header
      </HeaderCellReact>,
    );

    const header = screen.getByRole("columnheader");
    await expect.element(header).toBeVisible();

    await expect.element(header).toHaveAttribute("data-ln-header-cell", "true");
    await expect.element(header).toHaveAttribute("data-ln-header-floating", "true");
    await expect.element(header).toHaveAttribute("data-ln-header-id", "x");
    await expect.element(header).toHaveAttribute("data-ln-header-range", "1,2");
    await expect.element(header).toHaveAttribute("data-ln-rowindex", "0");
    await expect.element(header).toHaveAttribute("data-ln-colindex", "1");
    await expect.element(header).toHaveAttribute("data-ln-header-pin", "start");
    await expect.element(header).toHaveAttribute("data-ln-last-start-pin");
    await expect.element(header).toHaveAttribute("data-ln-first-end-pin");
  });
});
