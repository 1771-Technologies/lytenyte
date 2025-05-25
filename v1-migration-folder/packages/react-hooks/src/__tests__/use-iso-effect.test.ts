import { renderHook } from "@testing-library/react";
import { test } from "vitest";

test("will work if window is defined", async () => {
  const c = await import("../use-iso-effect.js");

  renderHook(() => c.useIsoEffect(() => {}));
});
