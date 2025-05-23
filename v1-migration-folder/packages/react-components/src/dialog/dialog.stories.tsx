import "./dialog.stories.css";

import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, type DialogRootProps } from "./dialog";

const meta: Meta<DialogRootProps> = {
  title: "components/Dialog",
  component: Dialog,
  args: {
    open: false,
    className: "dialog",
    timeEnter: 100,
    timeExit: 100,
  },
};

export default meta;

function WithChildren(props: DialogRootProps) {
  return (
    <Dialog {...props}>
      <div>Run Me</div>
    </Dialog>
  );
}

export const Default: StoryObj = {
  render: WithChildren,
};
