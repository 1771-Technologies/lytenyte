import { expect, test } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useControlled } from "../use-controlled.js";
import { wait } from "@1771technologies/lytenyte-shared";

test("when a controlled value is provided, setting the use controlled should do nothing", async () => {
  const { result } = await renderHook(() => useControlled({ controlled: false, default: true }));

  expect(result.current[0]).toEqual(false);
  result.current[1](true);
  expect(result.current[0]).toEqual(false);
});

test("when a controlled value is not provided, the uncontrolled value should work", async () => {
  const { result } = await renderHook(() => useControlled({ controlled: undefined, default: true }));

  expect(result.current[0]).toEqual(true);
  result.current[1](false);
  await wait(100);
  expect(result.current[0]).toEqual(false);
});
