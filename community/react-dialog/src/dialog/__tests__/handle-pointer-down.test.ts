import { handlePointerDown } from "../handle-pointer-down.js";

let dialog: HTMLDialogElement;
let outsideButton: HTMLButtonElement;
let insideButton: HTMLButtonElement;

beforeEach(() => {
  dialog = document.createElement("dialog");
  outsideButton = document.createElement("button");
  insideButton = document.createElement("button");

  dialog.appendChild(insideButton);
  document.body.appendChild(dialog);
  document.body.appendChild(outsideButton);
});

afterEach(() => {
  dialog.remove();
  outsideButton.remove();
});

test("should close when clicking outside dialog boundaries", () => {
  dialog.getBoundingClientRect = () => ({
    bottom: 20,
    top: 10,
    x: 4,
    y: 4,
    left: 4,
    right: 4,
    height: 10,
    width: 10,
    toJSON: () => "",
  });

  const onOpenChange = vi.fn();
  handlePointerDown(
    { clientX: 0, clientY: 0, target: document.createElement("div") } as unknown as PointerEvent,
    dialog,
    onOpenChange,
  );

  expect(onOpenChange).toHaveBeenCalledWith(false);
});

test("should not close when clicking inside dialog boundaries", () => {
  dialog.getBoundingClientRect = () => ({
    bottom: 20,
    top: 10,
    x: 4,
    y: 4,
    left: 4,
    right: 22,
    height: 10,
    width: 10,
    toJSON: () => "",
  });

  const onOpenChange = vi.fn();
  handlePointerDown(
    {
      clientX: 12,
      clientY: 10,
      target: document.createElement("div"),
    } as unknown as PointerEvent,
    dialog,
    onOpenChange,
  );

  expect(onOpenChange).not.toHaveBeenCalled();
});

test("should not close when target is inside dialog", () => {
  dialog.getBoundingClientRect = () => ({
    bottom: 20,
    top: 10,
    x: 4,
    y: 4,
    left: 22,
    right: 22,
    height: 10,
    width: 10,
    toJSON: () => "",
  });

  const onOpenChange = vi.fn();
  handlePointerDown(
    {
      clientX: 0,
      clientY: 0,
      target: dialog.firstChild,
    } as unknown as PointerEvent,
    dialog,
    onOpenChange,
  );

  expect(onOpenChange).not.toHaveBeenCalled();
});

test("should not close when target is not an HTML element", () => {
  dialog.getBoundingClientRect = () => ({
    bottom: 20,
    top: 10,
    x: 4,
    y: 4,
    left: 22,
    right: 22,
    height: 10,
    width: 10,
    toJSON: () => "",
  });

  const onOpenChange = vi.fn();
  handlePointerDown(
    {
      clientX: 0,
      clientY: 0,
      target: null,
    } as unknown as PointerEvent,
    dialog,
    onOpenChange,
  );

  expect(onOpenChange).not.toHaveBeenCalled();
});
