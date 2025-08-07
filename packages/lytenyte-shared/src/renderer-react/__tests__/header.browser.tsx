import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { HeaderReact } from "../header.js";

describe("HeaderReact", () => {
  test("should render the correct attributes and styles", async () => {
    const screen = render(
      <HeaderReact
        floatingRowEnabled={false}
        floatingRowHeight={30}
        headerGroupHeight={30}
        headerHeight={40}
        rows={3}
        width={20}
      >
        Header
      </HeaderReact>,
    );

    const header = screen.getByRole("rowgroup");
    await expect.element(header).toBeVisible();

    await expect.element(header).toHaveAttribute("data-ln-header", "true");

    const style = (header.element() as HTMLElement).style;
    expect(style.gridTemplateRows).toMatchInlineSnapshot(`"30px 30px 40px"`);
  });

  test("should render the correct attributes and styles when the floating row is present", async () => {
    const screen = render(
      <HeaderReact
        floatingRowEnabled={true}
        floatingRowHeight={24}
        headerGroupHeight={30}
        headerHeight={40}
        rows={3}
        width={20}
      >
        Header
      </HeaderReact>,
    );

    const header = screen.getByRole("rowgroup");
    await expect.element(header).toBeVisible();

    await expect.element(header).toHaveAttribute("data-ln-header", "true");

    const style = (header.element() as HTMLElement).style;
    expect(style.gridTemplateRows).toMatchInlineSnapshot(`"30px 30px 40px 24px"`);
  });
});
