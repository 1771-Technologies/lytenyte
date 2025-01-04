import { renderHook } from "@1771technologies/aio/vitest";

test("will work if window is not defined", async () => {
  const originalWindow = globalThis.window;
  globalThis.window = undefined as any;

  const c = await import("../use-iso-effect.js");
  globalThis.window = originalWindow;

  renderHook(() => c.useIsoEffect(() => console.log("lee")));
});
