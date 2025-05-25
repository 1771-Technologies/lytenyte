import { renderHook } from "@1771technologies/aio/vitest";

test("will work if window is defined", async () => {
  const c = await import("../use-iso-effect.js");

  renderHook(() => c.useIsoEffect(() => {}));
});
