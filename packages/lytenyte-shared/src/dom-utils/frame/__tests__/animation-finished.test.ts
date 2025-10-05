import { expect, test, vi } from "vitest";
import { onAnimationFinished } from "../animation-finished.js";
import { wait } from "../../../js-utils/index.js";

test("when an element is animating the animation finished should only be called once it finishes", async () => {
  const button = document.createElement("button");
  Object.assign(button.style, { background: "white", transition: "background 200ms linear" });

  document.body.appendChild(button);

  await wait();
  button.style.backgroundColor = "black";
  await wait();
  const fn = vi.fn();
  onAnimationFinished({ element: button, fn });
  await wait();
  expect(fn).toHaveBeenCalledTimes(0);
  await wait(200);
  expect(fn).toHaveBeenCalledTimes(1);

  // Should wait for the next
  onAnimationFinished({ element: button, fn });
  expect(fn).toHaveBeenCalledTimes(1);
  await wait();
  expect(fn).toHaveBeenCalledTimes(2);

  const controller = new AbortController();
  button.style.backgroundColor = "white";
  await wait();
  onAnimationFinished({ element: button, fn, signal: controller.signal });
  await wait();
  controller.abort();
  await wait(200);
  expect(fn).toHaveBeenCalledTimes(2);
});

test("when the element does not have a getAnimations function the executor should immediately be called", () => {
  const fn = vi.fn();
  onAnimationFinished({ element: {} as HTMLElement, fn });
  expect(fn).toHaveBeenCalledOnce();
});
