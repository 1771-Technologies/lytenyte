import { renderHook } from "@1771technologies/aio/vitest";
import { useCombinedRefs } from "../use-combine-refs.js";

test("should handle two ref objects", () => {
  const leftRef = { current: null };
  const rightRef = { current: null };

  const { result } = renderHook(() => useCombinedRefs<HTMLDivElement>(leftRef, rightRef));

  const element = document.createElement("div");

  result.current(element);

  expect(leftRef.current).toBe(element);
  expect(rightRef.current).toBe(element);
});

test("should handle ref callbacks", () => {
  const leftCallback = vi.fn();
  const rightCallback = vi.fn();

  const { result } = renderHook(() => useCombinedRefs<HTMLDivElement>(leftCallback, rightCallback));

  const element = document.createElement("div");

  result.current(element);

  expect(leftCallback).toHaveBeenCalledWith(element);
  expect(rightCallback).toHaveBeenCalledWith(element);
});

test("should handle mixed ref types", () => {
  const refObject = { current: null };
  const refCallback = vi.fn();

  const { result } = renderHook(() => useCombinedRefs<HTMLDivElement>(refObject, refCallback));

  const element = document.createElement("div");

  result.current(element);

  expect(refObject.current).toBe(element);
  expect(refCallback).toHaveBeenCalledWith(element);
});

test("should handle null refs", () => {
  const refObject = { current: null };

  const { result } = renderHook(() => useCombinedRefs<HTMLDivElement>(refObject, null));

  const element = document.createElement("div");

  expect(() => result.current(element)).not.toThrow();
  expect(refObject.current).toBe(element);
});

test("should maintain referential equality between renders", () => {
  const leftRef = { current: null };
  const rightRef = { current: null };

  const { result, rerender } = renderHook(() => useCombinedRefs<HTMLDivElement>(leftRef, rightRef));

  const initialCallback = result.current;

  rerender();
  expect(result.current).toBe(initialCallback);
});

test("should handle setting ref to null", () => {
  const refObject = { current: document.createElement("div") };
  const refCallback = vi.fn();

  const { result } = renderHook(() => useCombinedRefs<HTMLDivElement>(refObject, refCallback));

  result.current(null);

  expect(refObject.current).toBeNull();
  expect(refCallback).toHaveBeenCalledWith(null);
});
