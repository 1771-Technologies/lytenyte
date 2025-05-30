import "./drawer.css";

import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "..";
import type { DrawerRootProps } from "../root";
import { within } from "@testing-library/react";
import { useState } from "react";
import { expect } from "@storybook/test";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const [open, setOpen] = useState<"top" | "bottom" | "start" | "end">("start");
  return (
    <Drawer.Root {...props} side={open} timeExit={300} timeEnter={200} offset={20}>
      <Drawer.Trigger onClick={() => setOpen("start")}>Left</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("end")}>Right</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("top")}>Top</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("bottom")}>Bottom</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Panel className="drawer">This is my dialog panel</Drawer.Panel>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

type Story = StoryObj<DrawerRootProps>;

export const Default: Story = {
  render: Base,

  play: async ({ step }) => {
    const screen = within(document.body);

    await step("Opening left", async () => {
      screen.getByText("Left").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });

    await step("Opening Right", async () => {
      screen.getByText("Right").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(400);
    });

    await step("Opening Top", async () => {
      screen.getByText("Top").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });

    await step("Opening Bottom", async () => {
      screen.getByText("Bottom").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });
  },
};

function OffsetSide(props: DrawerRootProps) {
  const [open, setOpen] = useState<"top" | "bottom" | "start" | "end">("start");
  return (
    <Drawer.Root {...props} side={open} timeExit={300} timeEnter={200} offset={[10, 20]}>
      <Drawer.Trigger onClick={() => setOpen("start")}>Left</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("end")}>Right</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("top")}>Top</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("bottom")}>Bottom</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Panel className="drawer">This is my dialog panel</Drawer.Panel>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export const OffsetSides: Story = {
  render: OffsetSide,

  play: async ({ step }) => {
    const screen = within(document.body);

    await step("Opening left", async () => {
      screen.getByText("Left").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });

    await step("Opening Right", async () => {
      screen.getByText("Right").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(400);
    });

    await step("Opening Top", async () => {
      screen.getByText("Top").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });

    await step("Opening Bottom", async () => {
      screen.getByText("Bottom").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });
  },
};

function AllSidesComponents(props: DrawerRootProps) {
  const [open, setOpen] = useState<"top" | "bottom" | "start" | "end">("start");
  return (
    <Drawer.Root {...props} side={open} timeExit={300} timeEnter={200} offset={[10, 20, 5, 0]}>
      <Drawer.Trigger onClick={() => setOpen("start")}>Left</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("end")}>Right</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("top")}>Top</Drawer.Trigger>
      <Drawer.Trigger onClick={() => setOpen("bottom")}>Bottom</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Panel className="drawer">This is my dialog panel</Drawer.Panel>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export const AllSides: Story = {
  render: AllSidesComponents,

  play: async ({ step }) => {
    const screen = within(document.body);

    await step("Opening left", async () => {
      screen.getByText("Left").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });

    await step("Opening Right", async () => {
      screen.getByText("Right").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(400);
    });

    await step("Opening Top", async () => {
      screen.getByText("Top").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });

    await step("Opening Bottom", async () => {
      screen.getByText("Bottom").click();
      await wait(300);
      await expect(screen.getByText("This is my dialog panel")).toBeVisible();
      const dialog = screen.getByRole("dialog");
      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 400,
          clientY: 400,
          detail: 1, // Tricks the is virtual test
        }),
      );

      await wait(300);
    });
  },
};
