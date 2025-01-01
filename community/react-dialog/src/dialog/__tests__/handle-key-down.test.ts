import { handleKeydown } from "../handle-key-down.js";

let dialog: HTMLDialogElement;
let onOpenChange: (b: boolean) => void;
let button1: HTMLButtonElement;
let button2: HTMLButtonElement;
let button3: HTMLButtonElement;

beforeEach(() => {
  // Setup dialog and focusable elements
  dialog = document.createElement("dialog");
  button1 = document.createElement("button");
  button2 = document.createElement("button");
  button3 = document.createElement("button");

  button1.textContent = "Button 1";
  button2.textContent = "Button 2";
  button3.textContent = "Button 3";

  dialog.appendChild(button1);
  dialog.appendChild(button2);
  dialog.appendChild(button3);
  document.body.appendChild(dialog);

  onOpenChange = vi.fn();
});

afterEach(() => {
  dialog.remove();
});

test("should handle Escape key press", () => {
  const event = new KeyboardEvent("keydown", { key: "Escape" });
  const preventDefaultSpy = vi.spyOn(event, "preventDefault");

  handleKeydown(event, dialog, onOpenChange);

  expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

test("should cycle focus forward when Tab is pressed", () => {
  button3.focus();
  expect(document.activeElement).toBe(button3);

  const event = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey: false,
  });

  handleKeydown(event, dialog, onOpenChange);
  expect(document.activeElement).toBe(button1);
});

test("should cycle focus backward when Shift+Tab is pressed", () => {
  button1.focus();
  expect(document.activeElement).toBe(button1);

  const event = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey: true,
  });

  handleKeydown(event, dialog, onOpenChange);
  expect(document.activeElement).toBe(button3);
});
