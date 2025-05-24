import { renderHook } from "@testing-library/react";
import { test } from "vitest";

test("will work if window is not defined", async () => {
  const originalWindow = globalThis.window;
  globalThis.window = undefined as any;

  const c = await import("../use-iso-effect.js");
  globalThis.window = originalWindow;

  renderHook(() => c.useIsoEffect(() => console.log("lee")));
});
