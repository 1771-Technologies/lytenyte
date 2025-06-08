import "../../css/main.css";
import type { Meta, StoryObj } from "@storybook/react";
import { TooltipGroup } from "../group.js";
import { TooltipRoot } from "../root.js";
import { TooltipTrigger } from "../trigger.js";
import { TooltipPositioner } from "../positioner.js";
import { TooltipPanel } from "../panel.js";
import { Portal } from "../../portal/portal.js";
import { expect, userEvent, within } from "@storybook/test";
import { sleep } from "@1771technologies/lytenyte-js-utils";
import { useState } from "react";
import { DialogPanel } from "../../dialog/panel.js";
import { DialogPortal } from "../../dialog/portal.js";
import { DialogTrigger } from "../../dialog/trigger.js";
import { DialogRoot } from "../../dialog/root.js";

const meta: Meta = {
  title: "Components/Tooltip",
};

export default meta;

export const Main: StoryObj = {
  render: () => {
    return (
      <>
        <TooltipGroup showDelay={40} hideDelay={40}>
          <TooltipRoot interactive>
            <TooltipTrigger>Run one not twice</TooltipTrigger>

            <Portal>
              <TooltipPositioner sideOffset={8}>
                <TooltipPanel style={{ border: "1px solid black" }}>
                  This is my tooltip content
                  <input />
                </TooltipPanel>
              </TooltipPositioner>
            </Portal>
          </TooltipRoot>
          <TooltipRoot interactive>
            <TooltipTrigger>Grouped</TooltipTrigger>

            <Portal>
              <TooltipPositioner sideOffset={8}>
                <TooltipPanel style={{ border: "1px solid black" }}>Another</TooltipPanel>
              </TooltipPositioner>
            </Portal>
          </TooltipRoot>
        </TooltipGroup>

        <TooltipGroup>
          <TooltipRoot>
            <TooltipTrigger>Not Grouped</TooltipTrigger>

            <Portal>
              <TooltipPositioner sideOffset={8}>
                <TooltipPanel style={{ border: "1px solid black" }}>
                  Another
                  <div tabIndex={0} role="dialog">
                    Grab me
                  </div>
                </TooltipPanel>
              </TooltipPositioner>
            </Portal>
          </TooltipRoot>
        </TooltipGroup>
      </>
    );
  },
  play: async ({ step }) => {
    const c = within(document.body);

    await step("Hovering", async () => {
      await userEvent.hover(c.getByText("Run one not twice"));
      await sleep(80);
      await expect(c.getByRole("tooltip")).toBeVisible();

      await userEvent.hover(c.getByRole("tooltip"));
      await sleep(80);
      await expect(c.getByRole("tooltip")).toBeVisible();

      await userEvent.unhover(c.getByRole("tooltip"));
      await userEvent.unhover(c.getByText("Run one not twice"));

      await userEvent.hover(c.getByText("Run one not twice"));
      await sleep(80);
      await expect(c.getByRole("tooltip")).toBeVisible();
      await userEvent.hover(c.getByText("Grouped"));
      await sleep(20);
      await expect(c.getByRole("tooltip")).toBeVisible();
      await userEvent.unhover(c.getByText("Grouped"));

      await userEvent.hover(c.getByText("Not Grouped"));
      await sleep(20);
      await expect(c.getByRole("tooltip")).toBeVisible();
      await userEvent.unhover(c.getByText("Not Grouped"));
      await sleep(200);

      await userEvent.hover(c.getByText("Run one not twice"));
      await sleep(80);
      await userEvent.keyboard("{Escape}");
      await sleep(80);

      await userEvent.hover(c.getByText("Not Grouped"));
      await sleep(300);
      await expect(c.getByRole("tooltip")).toBeVisible();
      const d = c.getByRole("dialog");
      d.focus();
      d.blur();
      await userEvent.unhover(c.getByText("Not Grouped"));
    });

    await step("Focus", async () => {
      const first = c.getByText("Run one not twice");
      first.focus();
      await sleep(100);
      const second = c.getByText("Grouped");
      second.focus();
      await sleep(100);
      second.blur();
      await sleep(100);
      first.focus();
      await sleep(100);
      const d = document.querySelector("input");
      d?.focus();
      d?.blur();
      await sleep(100);
    });
  },
};

const ControlledComp = () => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipRoot open={open} onOpenChange={(b) => setOpen(b)}>
      <TooltipTrigger>Open</TooltipTrigger>

      <Portal>
        <TooltipPositioner sideOffset={8}>
          <TooltipPanel style={{ border: "1px solid black" }}>
            Another
            <div tabIndex={0} role="dialog">
              Grab me
            </div>
          </TooltipPanel>
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  );
};

export const Controlled: StoryObj = {
  render: ControlledComp,
  play: async ({ step }) => {
    const c = within(document.body);

    await step("Hovering", async () => {
      await userEvent.hover(c.getByText("Open"));
      await sleep(80);
      await expect(c.getByRole("tooltip")).toBeVisible();
      await userEvent.unhover(c.getByText("Open"));
    });
  },
};

const InDialogComp = () => {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel className="dialog">
          <TooltipRoot open={open} onOpenChange={(b) => setOpen(b)}>
            <TooltipTrigger>Open</TooltipTrigger>

            <Portal>
              <TooltipPositioner sideOffset={8}>
                <TooltipPanel style={{ border: "1px solid black" }}>
                  Another
                  <div tabIndex={0} role="dialog">
                    Grab me
                  </div>
                </TooltipPanel>
              </TooltipPositioner>
            </Portal>
          </TooltipRoot>
        </DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
};

export const InDialog: StoryObj = {
  render: InDialogComp,
};
