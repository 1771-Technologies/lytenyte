import { renderHook, act } from "@1771technologies/aio/vitest";
import { useHovered } from "../use-hovered";

describe("useHovered", () => {
  it("should initialize with hovered state as false", () => {
    const { result } = renderHook(() => useHovered());
    const [hovered] = result.current;

    expect(hovered).toBe(false);
  });

  it("should set hovered to true when onMouseEnter is called", () => {
    const { result } = renderHook(() => useHovered());
    const [, handlers] = result.current;

    act(() => {
      handlers.onMouseEnter();
    });
    const [hoveredAfterEnter] = result.current;

    expect(hoveredAfterEnter).toBe(true);
  });

  it("should set hovered to false when onMouseLeave is called", () => {
    const { result } = renderHook(() => useHovered());
    const [, handlers] = result.current;

    // First set it to true
    act(() => {
      handlers.onMouseEnter();
    });

    // Then trigger mouse leave
    act(() => {
      handlers.onMouseLeave();
    });
    const [hoveredAfterLeave] = result.current;

    expect(hoveredAfterLeave).toBe(false);
  });

  it("should maintain correct hover state through multiple interactions", () => {
    const { result } = renderHook(() => useHovered());
    const [, handlers] = result.current;

    // Initial state
    expect(result.current[0]).toBe(false);

    // Mouse enter
    act(() => {
      handlers.onMouseEnter();
    });
    expect(result.current[0]).toBe(true);

    // Mouse leave
    act(() => {
      handlers.onMouseLeave();
    });
    expect(result.current[0]).toBe(false);

    // Mouse enter again
    act(() => {
      handlers.onMouseEnter();
    });
    expect(result.current[0]).toBe(true);
  });
});
