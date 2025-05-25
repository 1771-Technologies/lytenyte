import { renderHook } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { usePrevious } from "../use-previous.js";

describe("usePrevious", () => {
  test("returns initial value as undefined on first render", () => {
    const { result } = renderHook(() => usePrevious(1));
    expect(result.current).toBe(1);
  });

  test("returns previous value after state changes", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });

  test("does not update if shouldUpdate returns false", () => {
    const alwaysFalse = () => false;

    const { result, rerender } = renderHook(({ value }) => usePrevious(value, alwaysFalse), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    rerender({ value: "c" });
    expect(result.current).toBe("a");
  });
});
