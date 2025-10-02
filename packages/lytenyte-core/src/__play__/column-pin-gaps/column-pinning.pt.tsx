import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import ColumnPinning from "./column-pinning.play.js";
import { wait } from "@1771technologies/lytenyte-js-utils";
import { userEvent } from "@vitest/browser/context";

test("should handle one start", async () => {
  const screen = render(<ColumnPinning initial="One Start" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_001");
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_002-rtl");
});

test("should handle two start", async () => {
  const screen = render(<ColumnPinning initial="Two Start" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_001");
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_002-rtl");
});

test("should handle one end", async () => {
  const screen = render(<ColumnPinning initial="One End" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_end_001");
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_end_002-rtl");
});

test("should handle two end", async () => {
  const screen = render(<ColumnPinning initial="Two End" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_end_001");
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_end_002-rtl");
});

test("should handle three end", async () => {
  const screen = render(<ColumnPinning initial="Three End" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("three_end_001");
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("three_end_002-rtl");
});

test("should handle one start and one end", async () => {
  const screen = render(<ColumnPinning initial="One Start and End" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_and_end_001");
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_and_end_002-rtl");
});

test("should handle two start and end", async () => {
  const screen = render(<ColumnPinning initial="Two Start and End" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_end_001");
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_end_002-rtl");
});

test("should handle two start and scrollable", async () => {
  const screen = render(<ColumnPinning initial="Two Start and Scrollable" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_scrollable_001");
  const grid = screen.getByRole("grid").element();
  grid.scrollBy({ left: 10_000 });
  await wait(100);
  await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_scrollable_002");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_and_scrollable_003-rtl");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_and_scrollable_004-rtl");
});

test("should handle two start, two end, and scrollable", async () => {
  const screen = render(<ColumnPinning initial="Two Start, Two End and Scrollable" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_scrollable_001");
  const grid = screen.getByRole("grid").element();
  grid.scrollBy({ left: 10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_scrollable_002");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_scrollable_003-rtl");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_scrollable_004-rtl");
});

test("should handle one start, two end, and scrollable", async () => {
  const screen = render(<ColumnPinning initial="One Start, Two End, and Scrollable" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("one_start_two_end_and_scrollable_001");
  const grid = screen.getByRole("grid").element();
  grid.scrollBy({ left: 10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("one_start_two_end_and_scrollable_002");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("one_start_two_end_and_scrollable_003-rtl");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("one_start_two_end_and_scrollable_004-rtl");
});

test("should handle two start, one end, and scrollable", async () => {
  const screen = render(<ColumnPinning initial="One Start, Two End, and Scrollable" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_one_end_and_scrollable_001");
  const grid = screen.getByRole("grid").element();
  grid.scrollBy({ left: 10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_one_end_and_scrollable_002");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_one_end_and_scrollable_003-rtl");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_one_end_and_scrollable_004-rtl");
});

test("should handle two start, two end, and many scrollable", async () => {
  const screen = render(<ColumnPinning initial="Two Start, Two End, and Many Scrollable" />);

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_many_scrollable_001");
  const grid = screen.getByRole("grid").element();
  grid.scrollBy({ left: 10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_many_scrollable_002");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_many_scrollable_003-rtl");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_many_scrollable_004-rtl");
});

test("should handle two start (with groups), two end, and scrollable", async () => {
  const screen = render(
    <ColumnPinning initial="Two Start (with groups), Two End, and Scrollable" />,
  );

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_groups_two_end_and_scrollable_001");
  const grid = screen.getByRole("grid").element();
  grid.scrollBy({ left: 10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_groups_two_end_and_scrollable_002");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_groups_two_end_and_scrollable_003-rtl");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_groups_two_end_and_scrollable_004-rtl");
});

test("should handle two start, two end (with groups), and scrollable", async () => {
  const screen = render(
    <ColumnPinning initial="Two Start, Two End (with groups), and Scrollable" />,
  );

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_groups_and_scrollable_001");
  const grid = screen.getByRole("grid").element();
  grid.scrollBy({ left: 10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_groups_and_scrollable_002");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_groups_and_scrollable_003-rtl");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_groups_and_scrollable_004-rtl");
});

test("should handle two start, two end, and scrollable (with groups)", async () => {
  const screen = render(
    <ColumnPinning initial="Two Start, Two End, and Scrollable (with groups)" />,
  );

  await expect.element(screen.getByRole("grid")).toBeVisible();
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_scrollable_groups_001");
  const grid = screen.getByRole("grid").element();
  grid.scrollBy({ left: 10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_scrollable_groups_002");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
  await wait(100);

  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_scrollable_groups_003-rtl");
  grid.scrollBy({ left: -10_000 });
  await wait(100);
  await expect
    .element(screen.getByRole("grid"))
    .toMatchScreenshot("two_start_two_end_and_scrollable_groups_004-rtl");
});
