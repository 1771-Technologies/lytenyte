import "./drawer.css";

import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "..";
import type { DrawerRootProps } from "../root";

const meta: Meta<DrawerRootProps> = {
  title: "components/Drawer",
  component: Drawer.Root,
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

function Base(props: DrawerRootProps) {
  return (
    <Drawer.Root {...props} timeExit={300} timeEnter={200} offset={20}>
      <Drawer.Trigger>Open</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Panel className="drawer">This is my dialog panel</Drawer.Panel>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

type Story = StoryObj<DrawerRootProps>;

export const Default: Story = {
  render: Base,
};
