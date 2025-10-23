import { expect, test, vi } from "vitest";
import { handleFocus } from "../handle-focus.js";

test("handleFocus should correctly focus cells", async () => {
  const container = document.createElement("div");
  container.tabIndex = 0;
  const x = document.createElement("div");
  const y = document.createElement("div");

  x.tabIndex = 0;
  y.tabIndex = 0;

  x.innerText = "bob";
  y.innerText = "zod";

  container.appendChild(x);
  container.appendChild(y);
  document.body.appendChild(container);

  const queryCell = () => container;
  const postFocus = vi.fn();

  expect(handleFocus(false, queryCell, postFocus)).toEqual(true);

  await expect.element(container).toHaveFocus();
  expect(postFocus).toHaveBeenCalledOnce();

  expect(handleFocus(true, queryCell, postFocus)).toEqual(true);
  await expect.element(y).toHaveFocus();
  expect(postFocus).toHaveBeenCalledTimes(2);

  x.remove();
  y.remove();

  expect(handleFocus(true, queryCell, postFocus)).toEqual(true);
  await expect.element(container).toHaveFocus();
  expect(postFocus).toHaveBeenCalledTimes(3);

  expect(handleFocus(true, () => null)).toEqual(false);
});
