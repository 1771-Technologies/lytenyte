import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { useOnWindowResize } from "../use-on-window-resize.js";
import { renderHook } from "@testing-library/react";

describe("useOnWindowResize", () => {
  let resizeCallback: (event: Event) => void;

  beforeEach(() => {
    resizeCallback = vi.fn();
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("attaches resize event listener on mount", () => {
    renderHook(() => useOnWindowResize(resizeCallback));

    expect(window.addEventListener).toHaveBeenCalledWith("resize", resizeCallback);
  });

  test("removes resize event listener on unmount", () => {
    const { unmount } = renderHook(() => useOnWindowResize(resizeCallback));

    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith("resize", resizeCallback);
  });

  test("executes the callback when resize event occurs", () => {
    renderHook(() => useOnWindowResize(resizeCallback));

    window.dispatchEvent(new Event("resize"));

    expect(resizeCallback).toHaveBeenCalledTimes(1);
  });

  test("updates the callback if it changes", () => {
    const initialCallback = vi.fn();
    const { rerender } = renderHook(({ cb }) => useOnWindowResize(cb), {
      initialProps: { cb: initialCallback },
    });

    const newCallback = vi.fn();
    rerender({ cb: newCallback });

    window.dispatchEvent(new Event("resize"));
    expect(newCallback).toHaveBeenCalled();
    expect(initialCallback).not.toHaveBeenCalled();
  });
});
