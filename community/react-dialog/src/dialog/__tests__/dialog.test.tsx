import { render, fireEvent, act } from "@1771technologies/aio/vitest";
import { Dialog } from "../dialog.js";
import { useState } from "react";

test("should render the dialog component", () => {
  const mock = vi.fn();
  const closeMock = vi.fn();
  HTMLDialogElement.prototype.showModal = mock;
  HTMLDialogElement.prototype.close = closeMock;
  let openRef: (b: boolean) => void;
  const dialogRef: { current: null | HTMLDialogElement } = { current: null };

  function Component() {
    const [open, setOpen] = useState(false);
    openRef = setOpen;
    return (
      <div>
        <Dialog ref={dialogRef} open={open} onOpenChange={setOpen}>
          This is some content.
        </Dialog>
      </div>
    );
  }
  const c = render(<Component />);

  expect(c).toBeDefined();

  act(() => {
    openRef(true);
  });

  expect(mock).toHaveBeenCalledOnce();
  const element = dialogRef.current!;
  fireEvent(element, new Event("close"));
  fireEvent(element, new Event("keydown"));
  fireEvent(element, new Event("pointerdown"));

  act(() => {
    openRef(false);
  });

  expect(mock).toHaveBeenCalledTimes(2);
  expect(closeMock).toHaveBeenCalledOnce();
});
