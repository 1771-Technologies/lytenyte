import { renderHook } from "@testing-library/react";
import { describe, test } from "vitest";

describe("useIsoEffect Window", () => {
  test("will work if window is defined", async () => {
    const c = await import("../use-iso-effect.js");

    renderHook(() => c.useIsoEffect(() => {}));
  });
});
