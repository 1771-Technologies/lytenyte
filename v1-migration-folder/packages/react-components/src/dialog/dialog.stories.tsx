import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./dialog";

const meta: Meta = {
  title: "components/Dialog",
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    return <Dialog />;
  },
};
