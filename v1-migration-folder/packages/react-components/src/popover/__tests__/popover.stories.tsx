import "../../css/main.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "../popover.js";

const meta: Meta = {
  title: "Components/Popover",
};

export default meta;

function PopoverMain() {
  return (
    <Popover.Root>
      <Popover.Trigger>Open me</Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Panel style={{ border: "1px solid black" }}>
            <Popover.Title>This is the title</Popover.Title>
            <Popover.Description>This is the description</Popover.Description>
            <Popover.Close>Close me</Popover.Close>
          </Popover.Panel>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export const Main: StoryObj = {
  render: PopoverMain,
};
