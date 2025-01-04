import { useState } from "react";
import { Popover, type PopoverTarget } from "../popover";
import { render, userEvent } from "@1771technologies/aio/browser";

test("should be able to manage the popover", async () => {
  function Component() {
    const [open, setOpen] = useState(false);
    const [target, setTarget] = useState<PopoverTarget>(null);

    return (
      <div>
        <button
          onClick={(e) => {
            setTarget(e.target as HTMLElement);
            setOpen(true);
          }}
        >
          Show Popover
        </button>
        <Popover open={open} onOpenChange={setOpen} popoverTarget={target}>
          This is the popover content
        </Popover>
      </div>
    );
  }

  const screen = render(<Component />);

  const openButton = screen.getByRole("button");
  await expect.element(openButton).toHaveTextContent("Show Popover");
  await openButton.click();

  const dialogContent = screen.getByText("This is the popover content");
  await expect.element(dialogContent).toBeVisible();

  await userEvent.keyboard("{Escape}");
  await expect.element(dialogContent).not.toBeInTheDocument();
});

test("should not show the popover content if the target is not set, even if the dialog is open", async () => {
  function Component() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          Show Popover
        </button>
        <Popover open={open} onOpenChange={setOpen} popoverTarget={null}>
          This is the popover content
        </Popover>
      </div>
    );
  }

  const screen = render(<Component />);

  const openButton = screen.getByRole("button");
  await expect.element(openButton).toHaveTextContent("Show Popover");
  await openButton.click();

  const dialogContent = screen.getByText("This is the popover content");
  await expect.element(dialogContent).not.toBeInTheDocument();
});
