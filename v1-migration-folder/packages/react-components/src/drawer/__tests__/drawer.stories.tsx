import "./drawer.css";

import type { Meta, StoryObj } from "@storybook/react";
import { DrawerRoot, type DrawerRootProps } from "../root";
import { DrawerTrigger } from "../trigger";
import { DrawerPortal } from "../portal";
import { DrawerPanel } from "../panel";

const meta: Meta<DrawerRootProps> = {
  title: "components/Drawer",
  component: DrawerRoot,
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
    <DrawerRoot {...props} timeExit={300} timeEnter={200} offset={20}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerPortal>
        <DrawerPanel className="drawer">This is my dialog panel</DrawerPanel>
      </DrawerPortal>
    </DrawerRoot>
  );
}

type Story = StoryObj<DrawerRootProps>;

export const Default: Story = {
  render: Base,
};
