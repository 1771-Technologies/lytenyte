// @vitest-environment jsdom

import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTransitionedOpen } from "../use-transitioned-open";

describe("useTransitionedOpen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("initial state is closed when no options passed", () => {
    const { result } = renderHook(() => useTransitionedOpen());
    expect(result.current.shouldMount).toBe(false);
    expect(result.current.open).toBe(false);
    expect(result.current.state).toBe("closed");
  });

  test("initial state is open when `initial: true`", () => {
    const { result } = renderHook(() => useTransitionedOpen({ initial: true }));
    expect(result.current.shouldMount).toBe(true);
    expect(result.current.open).toBe(true);
    expect(result.current.state).toBe("open");
  });

  test("opens in stages: open-begin → opening → open", () => {
    const { result } = renderHook(() => useTransitionedOpen({ timeEnter: 500 }));

    act(() => {
      result.current.toggle(true);
    });

    expect(result.current.state).toBe("open-begin");
    expect(result.current.open).toBe(true);
    expect(result.current.shouldMount).toBe(true);

    act(() => {
      vi.runOnlyPendingTimers(); // to 'opening'
    });
    expect(result.current.state).toBe("opening");

    act(() => {
      vi.runOnlyPendingTimers(); // to 'open'
    });
    expect(result.current.state).toBe("open");
  });

  test("closes in stages: close-begin → closing → closed", () => {
    const { result } = renderHook(() => useTransitionedOpen({ initial: true, timeExit: 700 }));

    act(() => {
      result.current.toggle(false);
    });

    expect(result.current.state).toBe("close-begin");
    expect(result.current.open).toBe(false);

    act(() => {
      vi.runOnlyPendingTimers(); // to 'closing'
    });
    expect(result.current.state).toBe("closing");

    act(() => {
      vi.runOnlyPendingTimers(); // to 'closed'
    });
    expect(result.current.state).toBe("closed");
    expect(result.current.shouldMount).toBe(false);
  });

  test("toggle() behaves idempotently if already open", () => {
    const { result } = renderHook(() => useTransitionedOpen({ initial: true }));

    act(() => {
      result.current.toggle(true);
    });

    expect(result.current.state).toBe("open"); // No transition needed
    expect(result.current.open).toBe(true);
    expect(result.current.shouldMount).toBe(true);
  });

  test("interrupts and restarts transition if toggle is called mid-animation", () => {
    const { result } = renderHook(() => useTransitionedOpen({ timeEnter: 400, timeExit: 400 }));

    act(() => {
      result.current.toggle(true); // opening starts
    });
    expect(result.current.state).toBe("open-begin");

    act(() => {
      vi.advanceTimersByTime(100); // in open-begin or just transitioning
      result.current.toggle(false); // interrupt and close
    });

    expect(result.current.state).toBe("close-begin");

    act(() => {
      vi.runOnlyPendingTimers(); // to 'closing'
    });
    expect(result.current.state).toBe("closing");

    act(() => {
      vi.runOnlyPendingTimers(); // to 'closed'
    });
    expect(result.current.state).toBe("closed");
    expect(result.current.shouldMount).toBe(false);
  });
});
