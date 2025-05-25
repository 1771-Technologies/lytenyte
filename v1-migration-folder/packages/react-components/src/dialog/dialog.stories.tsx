import "./dialog.stories.css";
import "../css/main.css";

import type { Meta, StoryObj } from "@storybook/react";
import { DialogRoot, type DialogRootProps } from "./root";
import { DialogPanel } from "./panel";
import { DialogTrigger } from "./trigger";
import { DialogPortal } from "./portal";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meta: Meta<DialogRootProps> = {
  title: "components/Dialog",
  component: DialogRoot,
  argTypes: {
    onOpenChange: { table: { disable: true } },
    alert: { table: { disable: true } },
    dismissible: { table: { disable: true } },
    lockBodyScroll: { table: { disable: true } },
    modal: { table: { disable: true } },
    open: { table: { disable: true } },
    timeExit: { table: { disable: true } },
    timeEnter: { table: { disable: true } },
    trapFocus: { table: { disable: true } },
  },
};

export default meta;

function Base(props: DialogRootProps) {
  return (
    <DialogRoot {...props}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel className="dialog">This is my dialog panel</DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

type Story = StoryObj<DialogRootProps>;

export const Default: Story = {
  render: Base,
  play: async () => {
    const canvas = within(document.body);
    const c = canvas.getByRole("dialog");
    await expect(c).toBeVisible();
    await expect(c).toHaveTextContent("This is my dialog panel");
  },
  args: {
    open: true,
  },
  argTypes: {
    open: { table: { disable: false } },
    modal: { table: { disable: false } },
  },
};

function WithOpenDialog() {
  return (
    <DialogRoot>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel className="dialog">This is my dialog panel</DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

export const OpenTrigger: Story = {
  render: WithOpenDialog,
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Opening and closing a dialog when using normal trigger", async () => {
      const openButton = canvas.getByText("Open");
      await expect(openButton).toBeVisible();

      await userEvent.click(openButton);

      let dialog = await canvas.findByRole("dialog");

      await waitFor(async () => await expect(dialog).toBeVisible());
      await userEvent.keyboard("{Escape}");

      await userEvent.click(openButton);
      dialog = await canvas.findByRole("dialog");

      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 300,
          clientY: 300,
        }),
      );
      await wait(100);
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};

export const AlwaysOpen: Story = {
  render: Base,
  args: {
    open: true,
  },
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Opening and closing a dialog when using normal trigger", async () => {
      const dialog = await canvas.findByRole("dialog");

      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 300,
          clientY: 300,
        }),
      );
      await wait(100);
      await expect(canvas.queryByRole("dialog")).toBeInTheDocument();
    });
  },
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};

export const NotDismissible: Story = {
  render: Base,
  args: {
    dismissible: false,
  },
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Opening and closing a dialog when using normal trigger", async () => {
      const openButton = canvas.getByText("Open");
      await expect(openButton).toBeVisible();

      await userEvent.click(openButton);

      const dialog = await canvas.findByRole("dialog");

      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 300,
          clientY: 300,
        }),
      );
      await wait(100);
      await expect(canvas.queryByRole("dialog")).toBeInTheDocument();
    });
  },
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};

function LocksBodyComponent(props: DialogRootProps) {
  return (
    <>
      <DialogRoot {...props}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal>
          <DialogPanel className="dialog">
            <div>
              <input />
              <input />
              <input />
              <button>X Run</button>
            </div>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
      <div style={{ width: 2000, height: 2000 }} />
    </>
  );
}

export const LocksBodyScroll: Story = {
  render: LocksBodyComponent,
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};

function FocusAddAndRemove(props: DialogRootProps) {
  const [remove, setRemove] = useState(false);
  return (
    <>
      <DialogRoot {...props}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal>
          <DialogPanel className="dialog" onClick={() => setRemove(false)}>
            {!remove && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setRemove(true);
                }}
              >
                <input />
                <input />
                <input />
                <button>X Run</button>
              </div>
            )}
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
      <div style={{ width: 2000, height: 2000 }} />
    </>
  );
}

export const FocusRemove: Story = {
  render: FocusAddAndRemove,
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};
