import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { useOnWindowScroll } from "../use-on-window-scroll.js";
import { renderHook } from "@testing-library/react";

describe("useOnWindowScroll", () => {
  let onScroll: () => void;

  beforeEach(() => {
    onScroll = vi.fn();
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("adds scroll listener when enabled is true", () => {
    renderHook(() => useOnWindowScroll(onScroll, true));
    expect(window.addEventListener).toHaveBeenCalledWith("scroll", onScroll, {
      capture: true,
      passive: true,
    });
  });

  test("does not add scroll listener when enabled is false", () => {
    renderHook(() => useOnWindowScroll(onScroll, false));
    expect(window.addEventListener).not.toHaveBeenCalled();
  });

  test("removes scroll listener on unmount if enabled", () => {
    const { unmount } = renderHook(() => useOnWindowScroll(onScroll, true));
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith("scroll", onScroll, true);
  });

  test("does not remove scroll listener on unmount if not added", () => {
    const { unmount } = renderHook(() => useOnWindowScroll(onScroll, false));
    unmount();
    expect(window.removeEventListener).not.toHaveBeenCalled();
  });

  test("executes callback on scroll when enabled", () => {
    renderHook(() => useOnWindowScroll(onScroll, true));
    window.dispatchEvent(new Event("scroll"));
    expect(onScroll).toHaveBeenCalled();
  });

  test("updates scroll listener when callback changes", () => {
    const initialCallback = vi.fn();
    const { rerender } = renderHook(({ cb, enabled }) => useOnWindowScroll(cb, enabled), {
      initialProps: { cb: initialCallback, enabled: true },
    });

    const newCallback = vi.fn();
    rerender({ cb: newCallback, enabled: true });

    window.dispatchEvent(new Event("scroll"));
    expect(newCallback).toHaveBeenCalled();
    expect(initialCallback).not.toHaveBeenCalled();
  });
});
