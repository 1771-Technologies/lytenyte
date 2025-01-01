import { type RefObject } from "react";
import { handleClose } from "../handle-close.js";

let controllerRef: RefObject<AbortController | null>;
let activeRef: RefObject<HTMLElement | null>;
let scrollbarWidthRef: RefObject<number>;

beforeEach(() => {
  // Setup fresh refs for each test
  controllerRef = {
    current: new AbortController(),
  };

  const mockElement = document.createElement("div");
  vi.spyOn(mockElement, "focus");
  activeRef = {
    current: mockElement,
  };

  scrollbarWidthRef = {
    current: 20,
  };
});

test("should abort controller and set it to null", () => {
  const abortSpy = vi.spyOn(controllerRef.current!, "abort");

  handleClose(controllerRef, activeRef, scrollbarWidthRef);

  expect(abortSpy).toHaveBeenCalledTimes(1);
  expect(controllerRef.current).toBeNull();
});

test("should focus active element and set it to null", () => {
  const focusSpy = vi.spyOn(activeRef.current!, "focus");

  handleClose(controllerRef, activeRef, scrollbarWidthRef);

  expect(focusSpy).toHaveBeenCalledTimes(1);
  expect(activeRef.current).toBeNull();
});

test("should remove scrollbar width property and reset the ref", () => {
  handleClose(controllerRef, activeRef, scrollbarWidthRef);

  expect(document.body.style.getPropertyValue("--scrollbar-width-removed")).toBe("");
  expect(scrollbarWidthRef.current).toBe(0);
});

test("should handle null refs gracefully", () => {
  const nullRefs: [
    RefObject<AbortController | null>,
    RefObject<HTMLElement | null>,
    RefObject<number>,
  ] = [{ current: null }, { current: null }, { current: null as unknown as number }];

  // Should not throw when refs are null
  expect(() => handleClose(...nullRefs)).not.toThrow();
});

test("should handle all operations together", () => {
  const abortSpy = vi.spyOn(controllerRef.current!, "abort");
  const focusSpy = vi.spyOn(activeRef.current!, "focus");

  handleClose(controllerRef, activeRef, scrollbarWidthRef);

  // Verify all operations happened
  expect(abortSpy).toHaveBeenCalledTimes(1);
  expect(focusSpy).toHaveBeenCalledTimes(1);
  expect(controllerRef.current).toBeNull();
  expect(activeRef.current).toBeNull();
  expect(scrollbarWidthRef.current).toBe(0);
  expect(document.body.style.getPropertyValue("--scrollbar-width-removed")).toBe("");
});
