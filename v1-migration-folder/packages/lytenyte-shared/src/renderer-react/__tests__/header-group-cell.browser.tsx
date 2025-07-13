import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { HeaderGroupCellReact } from "../header-group-cell";

describe("HeaderGroupCellReact", () => {
  test("should render the header group cell with the correct attributes", async () => {
    const screen = render(
      <HeaderGroupCellReact
        cell={{
          colStart: 1,
          colEnd: 2,
          colPin: null,
          colSpan: 1,
          rowEnd: 1,
          rowStart: 0,
        }}
        cellId="x"
        height={20}
        rtl={false}
        viewportWidth={200}
        xPositions={new Uint32Array([0, 100, 200, 300, 400])}
      >
        Header
      </HeaderGroupCellReact>,
    );

    const header = screen.getByRole("columnheader");
    await expect.element(header).toBeVisible();

    await expect.element(header).toHaveAttribute("data-ln-header-group", "true");
    await expect.element(header).toHaveAttribute("data-ln-header-id", "x");
    await expect.element(header).toHaveAttribute("data-ln-header-range", "1,2");
    await expect.element(header).toHaveAttribute("data-ln-rowindex", "0");
    await expect.element(header).toHaveAttribute("data-ln-colindex", "1");
    await expect.element(header).toHaveAttribute("data-ln-header-pin", "center");
    await expect.element(header).not.toHaveAttribute("data-ln-last-start-pin");
    await expect.element(header).not.toHaveAttribute("data-ln-first-end-pin");
  });

  test("should render the header group cell with the correct attributes with full pins", async () => {
    const screen = render(
      <HeaderGroupCellReact
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
        cellId="x"
        height={20}
        rtl={false}
        viewportWidth={200}
        xPositions={new Uint32Array([0, 100, 200, 300, 400])}
      >
        Header
      </HeaderGroupCellReact>,
    );

    const header = screen.getByRole("columnheader");
    await expect.element(header).toBeVisible();

    await expect.element(header).toHaveAttribute("data-ln-header-group", "true");
    await expect.element(header).toHaveAttribute("data-ln-header-id", "x");
    await expect.element(header).toHaveAttribute("data-ln-header-range", "1,2");
    await expect.element(header).toHaveAttribute("data-ln-rowindex", "0");
    await expect.element(header).toHaveAttribute("data-ln-colindex", "1");
    await expect.element(header).toHaveAttribute("data-ln-header-pin", "start");
    await expect.element(header).toHaveAttribute("data-ln-last-start-pin");
    await expect.element(header).toHaveAttribute("data-ln-first-end-pin");
  });
});
