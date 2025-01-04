import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { handleMove } from "../handle-move.js";
import { getClientX, getClientY, clamp } from "@1771technologies/js-utils";

// Mock the js-utils functions
vi.mock("@1771technologies/js-utils", () => ({
  getClientX: vi.fn(),
  getClientY: vi.fn(),
  clamp: vi.fn((_: number, value, __: number) => value), // Default to passing through the value
}));

describe("handleMove", () => {
  let mockEl: PointerEvent;
  let mockAnnouncer: HTMLElement;
  let mockRef: HTMLElement;
  let mockRaf: { current: number | null };
  let mockOnMove: (x: number, y: number) => void;
  let mockAxeProps: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock requestAnimationFrame and cancelAnimationFrame
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(performance.now());
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    // Setup basic mocks
    mockEl = new PointerEvent("pointerdown", {
      clientX: 100,
      clientY: 100,
    });
    mockAnnouncer = document.createElement("div");
    mockRef = document.createElement("div");
    Object.defineProperty(mockRef, "style", {
      value: {
        pointerEvents: "auto",
        top: "100px",
        left: "100px",
      },
      writable: true,
    });
    mockRaf = { current: null };
    mockOnMove = vi.fn();
    mockAxeProps = {
      axeMoveStartText: vi.fn((x, y) => `Started moving from ${x},${y}`),
      axeMoveEndText: vi.fn((x, y) => `Ended moving at ${x},${y}`),
    };

    // Mock getComputedStyle
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      top: "100px",
      left: "100px",
    } as CSSStyleDeclaration);

    // Setup window dimensions
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1000);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(1000);

    // Mock the client coordinates
    (getClientX as any).mockReturnValue(100);
    (getClientY as any).mockReturnValue(100);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should prevent default on initial event", () => {
    const preventDefault = vi.fn();
    const event = new PointerEvent("pointerdown", {
      clientX: 100,
      clientY: 100,
    });
    Object.defineProperty(event, "preventDefault", { value: preventDefault });

    handleMove(event, mockAnnouncer, mockAxeProps, mockRef, mockRaf, mockOnMove, 100, 100, vi.fn());

    expect(preventDefault).toHaveBeenCalled();
  });

  test("should set pointer-events to none after delay", async () => {
    vi.useFakeTimers();

    handleMove(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      mockRef,
      mockRaf,
      mockOnMove,
      100,
      100,
      vi.fn(),
    );

    expect(mockRef.style.pointerEvents).toBe("auto");

    await vi.advanceTimersByTimeAsync(41);

    expect(mockRef.style.pointerEvents).toBe("none");

    vi.useRealTimers();
  });

  test("should announce move start", async () => {
    vi.useFakeTimers();

    handleMove(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      mockRef,
      mockRaf,
      mockOnMove,
      100,
      100,
      vi.fn(),
    );

    await vi.advanceTimersByTimeAsync(41);

    expect(mockAxeProps.axeMoveStartText).toHaveBeenCalledWith(100, 100);
    expect(mockAnnouncer.textContent).toBe("Started moving from 100,100");

    vi.useRealTimers();
  });

  test("should handle pointer movement", async () => {
    vi.useFakeTimers();

    handleMove(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      mockRef,
      mockRaf,
      mockOnMove,
      100,
      100,
      vi.fn(),
    );

    await vi.advanceTimersByTimeAsync(41);

    // Simulate pointer movement
    (getClientX as any).mockReturnValue(150);
    (getClientY as any).mockReturnValue(150);

    const moveEvent = new PointerEvent("pointermove");
    window.dispatchEvent(moveEvent);

    expect(mockRef.style.left).toBe("150px");
    expect(mockRef.style.top).toBe("150px");

    vi.useRealTimers();
  });

  test("should handle pointer up event", async () => {
    vi.useFakeTimers();

    const sizeSync = vi.fn();
    handleMove(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      mockRef,
      mockRaf,
      mockOnMove,
      100,
      100,
      sizeSync,
    );

    await vi.advanceTimersByTimeAsync(41);

    // Simulate pointer up
    window.dispatchEvent(new PointerEvent("pointerup"));

    expect(mockOnMove).toHaveBeenCalledWith(100, 100);
    expect(mockAxeProps.axeMoveEndText).toHaveBeenCalledWith(100, 100);
    expect(mockRef.style.pointerEvents).toBe("auto");

    vi.useRealTimers();
  });

  test("should clamp movement within window bounds", async () => {
    vi.useFakeTimers();

    (clamp as any).mockImplementation((min: number, value: number, max: number) => {
      if (value < min) return min;
      if (value > max) return max;
      return value;
    });

    handleMove(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      mockRef,
      mockRaf,
      mockOnMove,
      100,
      100,
      vi.fn(),
    );

    await vi.advanceTimersByTimeAsync(41);

    // Simulate movement beyond window bounds
    (getClientX as any).mockReturnValue(2000);
    (getClientY as any).mockReturnValue(2000);

    const moveEvent = new PointerEvent("pointermove");
    window.dispatchEvent(moveEvent);

    expect(clamp).toHaveBeenCalledWith(0, expect.any(Number), 900); // 1000 - 100 (width)

    vi.useRealTimers();
  });

  test("should cancel animation frame if new movement occurs", async () => {
    vi.useFakeTimers();

    handleMove(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      mockRef,
      mockRaf,
      mockOnMove,
      100,
      100,
      vi.fn(),
    );

    await vi.advanceTimersByTimeAsync(41);

    mockRaf.current = 1;

    const moveEvent = new PointerEvent("pointermove");
    window.dispatchEvent(moveEvent);

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);

    vi.useRealTimers();
  });
});
