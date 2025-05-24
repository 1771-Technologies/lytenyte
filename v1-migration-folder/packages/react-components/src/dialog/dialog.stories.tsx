import "./dialog.stories.css";

import type { Meta, StoryObj } from "@storybook/react";
import { DialogRoot, type DialogRootProps } from "./root";
import { DialogPanel } from "./dialog";
import { DialogTrigger } from "./trigger";

const meta: Meta<DialogRootProps> = {
  title: "components/Dialog",
  component: DialogRoot,
};

export default meta;

function WithChildren(props: DialogRootProps) {
  return (
    <DialogRoot {...props}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPanel className="dialog">This is my dialog panel</DialogPanel>
    </DialogRoot>
  );
}

export const Default: StoryObj = {
  render: WithChildren,
};
