import "./dialog.stories.css";
import "../css/main.css";

import type { Meta, StoryObj } from "@storybook/react";
import { DialogRoot, type DialogRootProps } from "./root";
import { DialogPanel } from "./panel";
import { DialogTrigger } from "./trigger";
import { DialogPortal } from "./portal";
import { useState } from "react";

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
      <DialogPortal>
        <DialogPanel className="dialog">This is my dialog panel</DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

type Story = StoryObj<DialogRootProps>;

export const Default: Story = {
  render: Base,
  args: {
    open: true,
  },
  argTypes: {
    open: { control: { type: "boolean", disable: false }, table: { disable: false } },
  },
};

function WithOpenDialog(props: DialogRootProps) {
  return (
    <DialogRoot {...props}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel className="dialog">This is my dialog panel</DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

export const WithOpen: Story = {
  render: WithOpenDialog,
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
