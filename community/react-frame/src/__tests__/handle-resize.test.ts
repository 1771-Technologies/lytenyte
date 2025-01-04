import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { handleResize } from "../handle-resize.js";
import { getClientX, getClientY } from "@1771technologies/js-utils";

// Mock the js-utils functions
vi.mock("@1771technologies/js-utils", () => ({
  getClientX: vi.fn(),
  getClientY: vi.fn(),
}));

describe("handleResize", () => {
  let mockEl: PointerEvent;
  let mockAnnouncer: HTMLDivElement;
  let mockRef: HTMLElement;
  let mockAxeProps: any;
  let mockSizeChange: (w: number, h: number) => void;
  let mockSizeSync: () => void;
  let mockBoundingBox: { width: number; height: number };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup initial bounding box dimensions
    mockBoundingBox = { width: 200, height: 200 };

    // Setup basic mocks
    mockEl = new PointerEvent("pointerdown", {
      clientX: 100,
      clientY: 100,
    });

    mockAnnouncer = document.createElement("div") as HTMLDivElement;

    mockRef = document.createElement("div");
    Object.defineProperty(mockRef, "style", {
      value: {
        width: "200px",
        height: "200px",
      },
      writable: true,
    });

    // Mock getBoundingClientRect properly
    mockRef.getBoundingClientRect = vi.fn(() => ({
      width: mockBoundingBox.width,
      height: mockBoundingBox.height,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: mockBoundingBox.width,
      bottom: mockBoundingBox.height,
      toJSON: () => ({}),
    }));

    mockAxeProps = {
      axeResizeStartText: vi.fn((w, h) => `Started resizing from ${w}x${h}`),
      axeResizeEndText: vi.fn((w, h) => `Finished resizing to ${w}x${h}`),
    };

    mockSizeChange = vi.fn();
    mockSizeSync = vi.fn();

    // Setup window dimensions
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1000);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(1000);

    // Mock the client coordinates initial values
    (getClientX as any).mockReturnValue(100);
    (getClientY as any).mockReturnValue(100);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should set initial announcement text", () => {
    handleResize(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      0,
      0,
      200,
      200,
      mockRef,
      mockSizeChange,
      mockSizeSync,
    );

    expect(mockAxeProps.axeResizeStartText).toHaveBeenCalledWith(200, 200);
    expect(mockAnnouncer.textContent).toBe("Started resizing from 200x200");
  });

  test("should handle pointer movement within bounds", () => {
    handleResize(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      0,
      0,
      200,
      200,
      mockRef,
      mockSizeChange,
      mockSizeSync,
    );

    // Update bounding box to simulate resize
    mockBoundingBox.width = 250;
    mockBoundingBox.height = 250;

    // Simulate movement to make element larger
    (getClientX as any).mockReturnValue(150);
    (getClientY as any).mockReturnValue(150);

    const moveEvent = new PointerEvent("pointermove");
    window.dispatchEvent(moveEvent);

    expect(mockRef.style.width).toBe("250px"); // 200 + (150 - 100)
    expect(mockRef.style.height).toBe("250px"); // 200 + (150 - 100)
  });

  test("should respect maximum window bounds", () => {
    handleResize(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      500, // x position
      500, // y position
      200,
      200,
      mockRef,
      mockSizeChange,
      mockSizeSync,
    );

    // Update bounding box to simulate resize
    mockBoundingBox.width = 500;
    mockBoundingBox.height = 500;

    // Simulate movement beyond window bounds
    (getClientX as any).mockReturnValue(1000);
    (getClientY as any).mockReturnValue(1000);

    const moveEvent = new PointerEvent("pointermove");
    window.dispatchEvent(moveEvent);

    expect(mockRef.style.width).toBe("500px"); // Limited by window.innerWidth - x
    expect(mockRef.style.height).toBe("500px"); // Limited by window.innerHeight - y
  });

  test("should handle pointer up event", () => {
    handleResize(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      0,
      0,
      200,
      200,
      mockRef,
      mockSizeChange,
      mockSizeSync,
    );

    // Simulate pointer up
    window.dispatchEvent(new PointerEvent("pointerup"));

    expect(mockSizeChange).toHaveBeenCalledWith(200, 200);
    expect(mockAxeProps.axeResizeEndText).toHaveBeenCalledWith(200, 200);
  });

  test("should call sizeSync after a timeout on pointer up", () => {
    vi.useFakeTimers();

    handleResize(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      0,
      0,
      200,
      200,
      mockRef,
      mockSizeChange,
      mockSizeSync,
    );

    window.dispatchEvent(new PointerEvent("pointerup"));

    expect(mockSizeSync).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(mockSizeSync).toHaveBeenCalled();

    vi.useRealTimers();
  });

  test("should handle negative resize deltas", () => {
    handleResize(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      0,
      0,
      200,
      200,
      mockRef,
      mockSizeChange,
      mockSizeSync,
    );

    // Update bounding box to simulate resize
    mockBoundingBox.width = 150;
    mockBoundingBox.height = 150;

    // Simulate movement to make element smaller
    (getClientX as any).mockReturnValue(50);
    (getClientY as any).mockReturnValue(50);

    const moveEvent = new PointerEvent("pointermove");
    window.dispatchEvent(moveEvent);

    expect(mockRef.style.width).toBe("150px"); // 200 + (50 - 100)
    expect(mockRef.style.height).toBe("150px"); // 200 + (50 - 100)
  });

  test("should clean up event listeners on pointer up", () => {
    const abortSpy = vi.spyOn(AbortController.prototype, "abort");

    handleResize(
      mockEl,
      mockAnnouncer,
      mockAxeProps,
      0,
      0,
      200,
      200,
      mockRef,
      mockSizeChange,
      mockSizeSync,
    );

    window.dispatchEvent(new PointerEvent("pointerup"));

    expect(abortSpy).toHaveBeenCalled();
  });
});
