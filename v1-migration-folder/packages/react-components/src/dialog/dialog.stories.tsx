import "./dialog.stories.css";

import type { Meta, StoryObj } from "@storybook/react";
import { DialogRoot, type DialogRootProps } from "./root";
import { DialogPanel } from "./panel";
import { DialogTrigger } from "./trigger";
import { DialogPortal } from "./portal";

const meta: Meta<DialogRootProps> = {
  title: "components/Dialog",
  component: DialogRoot,
  argTypes: {
    onOpenChange: { control: false, table: { disable: true } },
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
          <DialogPanel className="dialog">This is my dialog panel</DialogPanel>
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
