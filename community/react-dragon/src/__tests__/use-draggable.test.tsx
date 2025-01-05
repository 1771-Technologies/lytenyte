import { renderHook } from "@testing-library/react";
import { dragState } from "../drag-state";
import { useDraggable } from "../use-draggable";

describe("useDraggable", () => {
  // Mock functions and data
  const mockDragData = { id: 1, type: "test" };
  const mockTags = ["tag1", "tag2"];
  const mockPlaceholder = () => <div>Drag Placeholder</div>;

  // Mock handlers
  const onDragStart = vi.fn();
  const onDragMove = vi.fn();
  const onDragEnd = vi.fn();
  const onDragCancel = vi.fn();

  // Mock HTMLElement for drag image
  const mockElement = document.createElement("div");
  vi.spyOn(document.body, "appendChild");
  vi.spyOn(mockElement, "remove");

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Reset dragState
    dragState.store.activeTags.set(null);
    dragState.store.dragActive.set(false);
    dragState.store.dragData.set(() => () => null);
    dragState.store.overTags.set(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should return draggable props", () => {
    const { result } = renderHook(() =>
      useDraggable({
        dragData: () => mockDragData,
        dragTags: () => mockTags,
      }),
    );

    expect(result.current.draggable).toBe(true);
    expect(typeof result.current.onDragStart).toBe("function");
  });

  test("should handle drag start correctly", () => {
    const { result } = renderHook(() =>
      useDraggable({
        dragData: () => mockDragData,
        dragTags: () => mockTags,
        onDragStart,
        placeholder: mockPlaceholder,
      }),
    );

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        setDragImage: vi.fn(),
        effectAllowed: "none",
        dropEffect: "none",
      },
      nativeEvent: new DragEvent("dragstart"),
    };

    result.current.onDragStart(mockEvent as any);

    expect(mockEvent.dataTransfer.effectAllowed).toBe("move");
    expect(mockEvent.dataTransfer.dropEffect).toBe("move");
    expect(onDragStart).toHaveBeenCalledWith({
      tags: mockTags,
      event: mockEvent.nativeEvent,
    });
    expect(dragState.store.dragActive.get()).toBe(true);
    expect(dragState.store.activeTags.get()).toEqual(mockTags);
  });

  test("should not start drag when disabled", () => {
    const { result } = renderHook(() =>
      useDraggable({
        dragData: () => mockDragData,
        dragTags: () => mockTags,
        disabled: true,
      }),
    );

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        setDragImage: vi.fn(),
        effectAllowed: "none",
        dropEffect: "none",
      },
    };

    result.current.onDragStart(mockEvent as any);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(dragState.store.dragActive.get()).toBe(false);
  });

  test("should handle drag move correctly", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useDraggable({
        dragData: () => mockDragData,
        dragTags: () => mockTags,
        onDragMove,
      }),
    );

    const startEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        setDragImage: vi.fn(),
        effectAllowed: "none",
        dropEffect: "none",
      },
      nativeEvent: { clientX: 0, clientY: 0 } as any,
    };

    result.current.onDragStart(startEvent as any);

    // Simulate drag move
    for (let i = 0; i < 2; i++) {
      const moveEvent = new DragEvent("drag", {
        clientX: 100,
        clientY: 100,
      });
      Object.defineProperty(moveEvent, "view", {
        value: { window },
      });

      document.dispatchEvent(moveEvent);
    }

    await vi.runAllTimersAsync();

    expect(onDragMove).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  test("should handle drag end correctly", () => {
    const { result } = renderHook(() =>
      useDraggable({
        dragData: () => mockDragData,
        dragTags: () => mockTags,
        onDragEnd,
        onDragCancel,
      }),
    );

    const startEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        setDragImage: vi.fn(),
        effectAllowed: "none",
        dropEffect: "move",
      },
      nativeEvent: new DragEvent("dragstart"),
    };

    result.current.onDragStart(startEvent as any);

    // Simulate successful drag end
    const endEvent = new DragEvent("dragend");
    Object.defineProperty(endEvent, "dataTransfer", {
      value: { dropEffect: "move" },
    });
    window.dispatchEvent(endEvent);

    expect(onDragEnd).toHaveBeenCalledWith({
      event: endEvent,
      tags: mockTags,
    });
    expect(onDragCancel).not.toHaveBeenCalled();
    expect(dragState.store.dragActive.get()).toBe(false);
    expect(dragState.store.activeTags.get()).toBe(null);
  });

  test("should handle drag cancel correctly", () => {
    const { result } = renderHook(() =>
      useDraggable({
        dragData: () => mockDragData,
        dragTags: () => mockTags,
        onDragEnd,
        onDragCancel,
      }),
    );

    const startEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        setDragImage: vi.fn(),
        effectAllowed: "none",
        dropEffect: "none",
      },
      nativeEvent: new DragEvent("dragstart"),
    };

    result.current.onDragStart(startEvent as any);

    // Simulate cancelled drag
    const cancelEvent = new DragEvent("dragend");
    Object.defineProperty(cancelEvent, "dataTransfer", {
      value: { dropEffect: "none" },
    });
    window.dispatchEvent(cancelEvent);

    expect(onDragCancel).toHaveBeenCalledWith({
      event: cancelEvent,
      tags: mockTags,
    });
    expect(onDragEnd).not.toHaveBeenCalled();
    expect(dragState.store.dragActive.get()).toBe(false);
    expect(dragState.store.activeTags.get()).toBe(null);
  });
});
