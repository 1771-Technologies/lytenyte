import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { dragState } from "../drag-state";
import { useDroppable } from "../use-droppable";

describe("useDroppable", () => {
  const mockTags = ["tag1", "tag2"];
  const mockDragData = { id: 1, type: "test" };

  const onDragEnter = vi.fn();
  const onDragLeave = vi.fn();
  const onDrop = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    dragState.activeTags.set(null);
    dragState.dragActive.set(false);
    dragState.dragData.set(() => () => null);
    dragState.overTags.set(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state and basic setup", () => {
    it("should return correct initial state with full config", () => {
      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDragEnter,
          onDragLeave,
          onDrop,
        }),
      );

      expect(result.current.isOver).toBe(false);
      expect(result.current.canDrop).toBe(false);
      expect(typeof result.current.onDragOver).toBe("function");
      expect(typeof result.current.onDrop).toBe("function");
    });

    it("should return correct initial state with minimal config", () => {
      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
        }),
      );

      expect(result.current.isOver).toBe(false);
      expect(result.current.canDrop).toBe(false);
    });
  });

  describe("onDragOver handling", () => {
    it("should do nothing when drag is not active", () => {
      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDragEnter,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: document.createElement("div"),
        nativeEvent: new DragEvent("dragover"),
      };

      act(() => {
        result.current.onDragOver(mockEvent as any);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
      expect(result.current.isOver).toBe(false);
      expect(onDragEnter).not.toHaveBeenCalled();
    });

    it("should handle dragOver with matching tags", () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag1"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDragEnter,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: document.createElement("div"),
        nativeEvent: new DragEvent("dragover"),
      };

      act(() => {
        result.current.onDragOver(mockEvent as any);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(result.current.canDrop).toBe(true);
      expect(result.current.isOver).toBe(true);
      expect(onDragEnter).toHaveBeenCalledWith({
        getData: expect.any(Function),
        event: mockEvent.nativeEvent,
        overTags: mockTags,
        dragTags: ["tag1"],
      });
    });

    it("should handle dragOver with non-matching tags", () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag3"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDragEnter,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: document.createElement("div"),
        nativeEvent: new DragEvent("dragover"),
      };

      act(() => {
        result.current.onDragOver(mockEvent as any);
      });

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(result.current.canDrop).toBe(false);
    });

    it("should not trigger dragEnter when already over", () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag1"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDragEnter,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: document.createElement("div"),
        nativeEvent: new DragEvent("dragover"),
      };

      act(() => {
        result.current.onDragOver(mockEvent as any);
        result.current.onDragOver(mockEvent as any);
      });

      expect(onDragEnter).toHaveBeenCalledTimes(1);
    });

    it("should handle dragOver with null activeTags", () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(null);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDragEnter,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: document.createElement("div"),
        nativeEvent: new DragEvent("dragover"),
      };

      act(() => {
        result.current.onDragOver(mockEvent as any);
      });

      expect(result.current.canDrop).toBe(false);
    });
  });

  describe("drag leave handling", () => {
    it("should handle dragLeave correctly", async () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag1"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDragLeave,
        }),
      );

      const element = document.createElement("div");
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: element,
        nativeEvent: new DragEvent("dragover"),
      };

      act(() => {
        result.current.onDragOver(mockEvent as any);
      });

      expect(result.current.isOver).toBe(true);

      act(() => {
        element.dispatchEvent(new DragEvent("dragleave"));
      });

      // Need to wait for state updates
      await vi.runAllTimersAsync();

      expect(result.current.isOver).toBe(false);
      expect(onDragLeave).toHaveBeenCalledWith({
        getData: expect.any(Function),
        event: expect.any(DragEvent),
        overTags: mockTags,
        dragTags: ["tag1"],
      });
    });

    it("should handle dragLeave without onDragLeave handler", async () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag1"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
        }),
      );

      const element = document.createElement("div");
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: element,
        nativeEvent: new DragEvent("dragover"),
      };

      act(() => {
        result.current.onDragOver(mockEvent as any);
      });

      act(() => {
        element.dispatchEvent(new DragEvent("dragleave"));
      });

      await vi.runAllTimersAsync();
      expect(result.current.isOver).toBe(false);
    });
  });

  describe("drop handling", () => {
    it("should handle drop with matching tags", () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag1"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDrop,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        nativeEvent: new DragEvent("drop"),
      };

      act(() => {
        result.current.onDrop(mockEvent as any);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(onDrop).toHaveBeenCalledWith({
        getData: expect.any(Function),
        event: mockEvent,
        overTags: mockTags,
        dragTags: ["tag1"],
      });
    });

    it("should not trigger onDrop with non-matching tags", () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag3"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDrop,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        nativeEvent: new DragEvent("drop"),
      };

      act(() => {
        result.current.onDrop(mockEvent as any);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(onDrop).not.toHaveBeenCalled();
    });

    it("should handle drop when onDrop is not provided", () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag1"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        nativeEvent: new DragEvent("drop"),
      };

      act(() => {
        result.current.onDrop(mockEvent as any);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe("cleanup and edge cases", () => {
    it("should handle multiple dragOver events without creating multiple listeners", () => {
      dragState.dragActive.set(true);
      dragState.activeTags.set(["tag1"]);
      dragState.dragData.set(() => () => mockDragData);

      const { result } = renderHook(() =>
        useDroppable({
          tags: mockTags,
          onDragEnter,
          onDragLeave,
        }),
      );

      const element = document.createElement("div");
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: element,
        nativeEvent: new DragEvent("dragover"),
      };

      // Trigger multiple dragOver events
      act(() => {
        result.current.onDragOver(mockEvent as any);
        result.current.onDragOver(mockEvent as any);
        result.current.onDragOver(mockEvent as any);
      });

      act(() => {
        element.dispatchEvent(new DragEvent("dragleave"));
      });

      expect(onDragEnter).toHaveBeenCalledTimes(1);
      expect(onDragLeave).toHaveBeenCalledTimes(1);
    });
  });
});
