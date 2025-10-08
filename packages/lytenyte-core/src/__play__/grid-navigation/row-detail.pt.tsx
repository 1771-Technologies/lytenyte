import { wait } from "@1771technologies/lytenyte-shared";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import RowDetail from "./row-detail.play.js";
import { getCellQuery } from "@1771technologies/lytenyte-shared";
import { userEvent } from "@vitest/browser/context";
import RowDetailWithSpans from "./row-detail-with-spans.play.js";

test("when row details are present it should be possible to navigate across them", async () => {
  const screen = render(<RowDetail />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement;
  ourFirstCell.focus();
  await expect.element(ourFirstCell).toHaveFocus();

  await userEvent.keyboard("{ArrowDown}");
  await wait();
  await userEvent.keyboard("{ArrowDown}");
  await wait();
  await userEvent.keyboard("{ArrowDown}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("Detail A");

  await userEvent.keyboard("{ArrowLeft}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("Detail ADetail B");
  await userEvent.keyboard("{ArrowLeft}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("Detail B");
  await userEvent.keyboard("{ArrowLeft}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("Detail A");
  await userEvent.keyboard("{ArrowDown}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("X");
  await userEvent.keyboard("{ArrowDown}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("ABC");
  await userEvent.keyboard("{ArrowUp}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("X");
  await userEvent.keyboard("{ArrowUp}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("Detail A");
  await userEvent.keyboard("{ArrowDown}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("X");
  await userEvent.keyboard("{ArrowLeft}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("X");
  await userEvent.click(document.activeElement!);
  await wait();
  await userEvent.keyboard("{ArrowDown}");
  await expect.element(document.activeElement).toHaveTextContent("Detail A");
});

test("when there are row spans it should be cutoff when the detail is expanded", async () => {
  const screen = render(<RowDetailWithSpans />);
  const grid = screen.getByRole("grid");

  await expect.element(grid).toBeVisible();
  await wait(); // Give the grid a moment to render

  const ourFirstCell = document.querySelector(getCellQuery("x", 0, 2)) as HTMLElement;
  ourFirstCell.focus();
  await expect.element(ourFirstCell).toHaveFocus();

  await expect.element(document.activeElement).toHaveTextContent("unemployed");
  await userEvent.keyboard("{ArrowDown}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("management");
  await userEvent.keyboard("{ArrowDown}");
  await wait();
  await expect.element(document.activeElement).toHaveTextContent("Detail A");
});
