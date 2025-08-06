import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { HeaderRowReact } from "../header-row";

describe("HeaderRowReact", () => {
  test("should render the correct attributes", async () => {
    const screen = render(
      <HeaderRowReact headerRowIndex={2} maxRow={3}>
        Row
      </HeaderRowReact>,
    );

    const row = screen.getByRole("row");
    await expect.element(row).toBeVisible();
    await expect.element(row).toHaveAttribute("data-ln-header-row", "true");

    const element = row.element() as HTMLElement;
    expect(element.style.gridRow).toMatchInlineSnapshot(`"3 / 4"`);
  });
});
