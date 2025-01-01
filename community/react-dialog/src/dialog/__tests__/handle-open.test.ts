import { type RefObject } from "react";
import { handleOpen } from "../handle-open.js";

let dialog: HTMLDialogElement;
let activeRef: RefObject<HTMLElement | null>;
let scrollbarWidthRef: RefObject<number>;
let button: HTMLButtonElement;

beforeEach(() => {
  // Setup DOM elements
  dialog = document.createElement("dialog");
  dialog.showModal = () => {};
  button = document.createElement("button");
  document.body.appendChild(button);
  document.body.appendChild(dialog);

  // Setup refs
  activeRef = { current: null };
  scrollbarWidthRef = { current: 0 };

  // Focus button to test activeElement capture
  button.focus();
});

afterEach(() => {
  // Cleanup
  document.body.removeChild(dialog);
  document.body.removeChild(button);
  document.body.style.removeProperty("--scrollbar-width-removed");
});

test("should capture currently focused element", () => {
  handleOpen(dialog, activeRef, scrollbarWidthRef);

  expect(activeRef.current).toBe(button);
});

test("should handle no focused element", () => {
  // Remove focus from all elements
  (document.activeElement as HTMLElement)?.blur();

  handleOpen(dialog, activeRef, scrollbarWidthRef);

  expect(activeRef.current).toBe(document.body);
});

test("should set scrollbar width CSS property when scrollbar exists", () => {
  // Mock scrollbar width
  vi.spyOn(window, "innerWidth", "get").mockImplementation(() => 1000);
  vi.spyOn(document.body, "offsetWidth", "get").mockImplementation(() => 985);
  document.body.style.margin = "0px";

  handleOpen(dialog, activeRef, scrollbarWidthRef);

  expect(scrollbarWidthRef.current).toBe(15);
  expect(document.body.style.getPropertyValue("--scrollbar-width-removed")).toBe("15px");
});

test("should not set scrollbar width CSS property when no scrollbar exists", () => {
  vi.spyOn(window, "innerWidth", "get").mockImplementation(() => 1000);
  vi.spyOn(document.body, "offsetWidth", "get").mockImplementation(() => 1000);
  document.body.style.margin = "0px";

  handleOpen(dialog, activeRef, scrollbarWidthRef);

  expect(scrollbarWidthRef.current).toBe(0);
  expect(document.body.style.getPropertyValue("--scrollbar-width-removed")).toBe("");
});

test("should call showModal on the dialog", () => {
  const showModalSpy = vi.spyOn(dialog, "showModal");

  handleOpen(dialog, activeRef, scrollbarWidthRef);

  expect(showModalSpy).toHaveBeenCalledTimes(1);
});

test("should handle all operations together in correct order", () => {
  vi.spyOn(window, "innerWidth", "get").mockImplementation(() => 1000);
  vi.spyOn(document.body, "offsetWidth", "get").mockImplementation(() => 985);
  document.body.style.margin = "0px";

  handleOpen(dialog, activeRef, scrollbarWidthRef);

  // Verify all operations occurred
  expect(activeRef.current).toBe(button);
  expect(scrollbarWidthRef.current).toBe(15);
  expect(document.body.style.getPropertyValue("--scrollbar-width-removed")).toBe("15px");
});
