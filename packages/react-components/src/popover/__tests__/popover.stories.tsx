import "../../css/main.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "../index.js";
import { useRef, useState } from "react";
import type { DialogApi } from "../../dialog/index.js";
import type { ReferenceElement } from "@1771technologies/lytenyte-floating";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta = {
  title: "Components/Popover",
};

export default meta;

function PopoverMain() {
  const ref = useRef<DialogApi>(null);
  const [anchor, setAnchor] = useState<ReferenceElement | null>(null);
  return (
    <>
      <div
        style={{ display: "flex", gap: 20, border: "1px solid black", padding: 20 }}
        onContextMenu={(ev) => {
          setAnchor({
            getBoundingClientRect: () => ({
              height: 1,
              width: 1,
              left: ev.clientX,
              right: ev.clientX,
              top: ev.clientY,
              bottom: ev.clientY,
              x: ev.clientX,
              y: ev.clientY,
            }),
          });

          ref.current?.open(true);
        }}
      >
        <Popover.Root>
          <Popover.Trigger>Open Left</Popover.Trigger>

          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Panel style={{ border: "1px solid black" }}>
                <Popover.Title>This is run title</Popover.Title>
                <Popover.Description>This is the description</Popover.Description>
                <Popover.Close>Close me</Popover.Close>
              </Popover.Panel>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <Popover.Root modal={false} dismissible={false} lockBodyScroll={false}>
          <Popover.Trigger>Open Right</Popover.Trigger>

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

        <Popover.Root modal={false} dismissible={false}>
          <Popover.Trigger>Open Right Right</Popover.Trigger>

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
      </div>
      <Popover.Root ref={ref}>
        <Popover.Portal>
          <Popover.Positioner anchor={anchor}>
            <Popover.Panel style={{ border: "1px solid black" }}>
              <Popover.Title>This is the title</Popover.Title>
              <Popover.Description>This is the description</Popover.Description>
              <Popover.Close>Close me</Popover.Close>
            </Popover.Panel>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <div style={{ width: 200, height: 20000 }} />
    </>
  );
}

export const Main: StoryObj = {
  render: PopoverMain,
  play: async () => {
    const c = within(document.body);
    await userEvent.click(c.getByText("Open Left"));
    await expect(c.getByRole("dialog")).toBeVisible();
    await userEvent.click(c.getByText("Close me"));
  },
};
