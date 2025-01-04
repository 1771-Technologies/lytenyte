import { useState } from "react";
import { Popover, type PopoverTarget } from "../popover.js";
import { render, userEvent } from "@1771technologies/aio/browser";
import type { Placement } from "@1771technologies/positioner";

// A workaround for a vitest bug the appears to print null when a resize observer is used
const fn = console.error;
console.error = (...args) => {
  const print = args.filter((c) => c != null);
  if (print.length === 0) return;

  fn(...print);
};

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

test("should be able to manage the popover with rect target", async () => {
  function Component() {
    const [open, setOpen] = useState(false);
    const [target] = useState<PopoverTarget>({ x: 0, y: 0, height: 20, width: 20 });

    return (
      <div>
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          Show Popover
        </button>
        <Popover open={open} onOpenChange={setOpen} popoverTarget={target} arrow>
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

const placements: Placement[] = [
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
];

test("should handle placement", async () => {
  function Component() {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState(placements[0]);
    const [target, setTarget] = useState<PopoverTarget>(null);

    return (
      <div>
        <button
          onClick={(e) => {
            setOpen(true);
            setTarget(e.target as HTMLElement);
          }}
        >
          Show Popover
        </button>
        <button
          onClick={() =>
            setPlacement(placements[(placements.indexOf(placement) + 1) % placements.length])
          }
        >
          next
        </button>
        <Popover
          open={open}
          onOpenChange={setOpen}
          popoverTarget={target}
          placement={placement}
          arrow
        >
          This is the popover content
        </Popover>
      </div>
    );
  }

  const screen = render(<Component />);

  for (let i = 0; i < placements.length - 1; i++) {
    const openButton = screen.getByText("Show Popover");
    await openButton.click();

    const dialogContent = screen.getByText("This is the popover content");
    await expect.element(dialogContent).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await expect.element(dialogContent).not.toBeInTheDocument();

    const next = screen.getByText("next");
    await next.click();
  }
});
