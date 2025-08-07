import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { RowsContainerReact } from "../rows-container.js";
import {
  SCROLL_WIDTH_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE,
} from "../../+constants.js";

describe("RowsContainerReact", () => {
  test("should render the correct attributes", async () => {
    const screen = render(
      <RowsContainerReact height={200} viewportHeight={100} viewportWidth={200} width={200}>
        Container
      </RowsContainerReact>,
    );

    const container = screen.getByRole("presentation");
    await expect.element(container).toBeVisible();

    await expect.element(container).toHaveAttribute("data-ln-rows-container", "true");

    const style = (container.element() as HTMLElement).style;
    expect(style.getPropertyValue(SCROLL_WIDTH_VARIABLE)).toMatchInlineSnapshot(`"200px"`);
    expect(style.getPropertyValue(VIEWPORT_WIDTH_VARIABLE)).toMatchInlineSnapshot(`"200px"`);
    expect(style.getPropertyValue(VIEWPORT_HEIGHT_VARIABLE)).toMatchInlineSnapshot(`"100px"`);
  });
});
