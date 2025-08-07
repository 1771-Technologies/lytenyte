import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { RowsBottomReact, RowsCenterReact, RowsTopReact } from "../rows-sections.js";

describe("RowsTopReact", () => {
  test("should render with the correct attributes", async () => {
    const screen = render(
      <RowsTopReact height={200} rowFirst={0} rowLast={2} top={0}>
        Row
      </RowsTopReact>,
    );

    const section = screen.getByRole("rowgroup");
    await expect.element(section).toBeVisible();

    await expect.element(section).toHaveAttribute("data-ln-rows-top", "true");
    await expect.element(section).toHaveAttribute("data-ln-row-first", "0");
    await expect.element(section).toHaveAttribute("data-ln-row-last", "2");

    const style = (section.element() as HTMLElement).style;

    expect(style.position).toEqual("sticky");
    expect(style.zIndex).toEqual("3");
    expect(style.top).toEqual("0px");
  });

  test("should render nothing when the height is empty", async () => {
    render(
      <RowsTopReact height={0} rowFirst={0} rowLast={2} top={0}>
        Row
      </RowsTopReact>,
    );

    expect(document.body.firstChild?.childNodes.length).toEqual(0);
  });
});

describe("RowsCenterReact", () => {
  test("should render with the correct attributes", async () => {
    const screen = render(
      <RowsCenterReact height={200} rowFirst={0} rowLast={2}>
        Row
      </RowsCenterReact>,
    );

    const section = screen.getByRole("rowgroup");
    await expect.element(section).toBeVisible();

    await expect.element(section).toHaveAttribute("data-ln-rows-center", "true");
    await expect.element(section).toHaveAttribute("data-ln-row-first", "0");
    await expect.element(section).toHaveAttribute("data-ln-row-last", "2");
  });

  test("should render nothing when the height is empty", async () => {
    const screen = render(
      <RowsCenterReact height={0} rowFirst={0} rowLast={2}>
        Row
      </RowsCenterReact>,
    );

    await expect.element(screen.getByRole("presentation")).toBeInTheDocument();
  });
});

describe("RowsBottomReact", () => {
  test("should render with the correct attributes", async () => {
    const screen = render(
      <RowsBottomReact height={200} rowFirst={0} rowLast={2}>
        Row
      </RowsBottomReact>,
    );

    const section = screen.getByRole("rowgroup");
    await expect.element(section).toBeVisible();

    await expect.element(section).toHaveAttribute("data-ln-rows-bottom", "true");
    await expect.element(section).toHaveAttribute("data-ln-row-first", "0");
    await expect.element(section).toHaveAttribute("data-ln-row-last", "2");
  });

  test("should render nothing when the height is empty", async () => {
    render(
      <RowsBottomReact height={0} rowFirst={0} rowLast={2}>
        Row
      </RowsBottomReact>,
    );

    expect(document.body.firstChild?.childNodes.length).toEqual(0);
  });
});
