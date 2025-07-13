import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { RowFullWidthReact } from "../row-full-width";

describe("RowFullWidthReact", () => {
  test("should render the correct attributes and styles", async () => {
    const screen = render(
      <RowFullWidthReact
        detail={<div>Detail</div>}
        detailHeight={40}
        gridId="x"
        rtl={false}
        yPositions={new Uint32Array([0, 100, 200, 300])}
        rowIndex={1}
        rowIsFocusRow={false}
        rowFirstPinBottom={undefined}
        rowLastPinTop={undefined}
      />,
    );

    const row = screen.getByRole("row");

    await expect.element(row).toBeVisible();

    await expect.element(row).toHaveAttribute("data-ln-gridid", "x");
    await expect.element(row).toHaveAttribute("data-ln-rowindex", "1");
    await expect.element(row).toHaveAttribute("data-ln-row", "true");
    await expect.element(row).toHaveAttribute("data-ln-rowtype", "full-width");
    await expect.element(row).toHaveAttribute("tabindex", "-1");
    await expect.element(row).not.toHaveAttribute("data-ln-last-top-pin");
    await expect.element(row).not.toHaveAttribute("data-ln-first-bottom-pin");

    const style = (row.element() as HTMLElement).style;

    expect(style.left).toEqual("0px");
    expect(style.gridTemplateColumns).toMatchInlineSnapshot(`"var(--lng-viewport-width)"`);
    expect(style.width).toMatchInlineSnapshot(`"var(--lng-viewport-width)"`);
    await expect.element(screen.getByText("Detail")).toBeVisible();
  });

  test("should render the correct attributes and styles with scroll-width", async () => {
    const screen = render(
      <RowFullWidthReact
        detail={<div>Detail</div>}
        detailHeight={40}
        gridId="x"
        rtl={true}
        yPositions={new Uint32Array([0, 100, 200, 300])}
        rowIndex={1}
        rowIsFocusRow={false}
        rowFirstPinBottom
        rowLastPinTop
        space="scroll-width"
      />,
    );

    const row = screen.getByRole("row");

    await expect.element(row).toBeVisible();

    await expect.element(row).toHaveAttribute("data-ln-gridid", "x");
    await expect.element(row).toHaveAttribute("data-ln-rowindex", "1");
    await expect.element(row).toHaveAttribute("data-ln-row", "true");
    await expect.element(row).toHaveAttribute("data-ln-rowtype", "full-width");
    await expect.element(row).toHaveAttribute("tabindex", "-1");
    await expect.element(row).toHaveAttribute("data-ln-last-top-pin");
    await expect.element(row).toHaveAttribute("data-ln-first-bottom-pin");

    const style = (row.element() as HTMLElement).style;

    expect(style.right).toEqual("0px");
    expect(style.gridTemplateColumns).toMatchInlineSnapshot(`"100%"`);
    expect(style.width).toMatchInlineSnapshot(`""`);
    await expect.element(screen.getByText("Detail")).toBeVisible();
  });
});
