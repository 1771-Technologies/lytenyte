import "../../css/main.css";

import type { Meta, StoryObj } from "@storybook/react";
import type { DialogApi } from "../root.js";
import { DialogRoot, type DialogRootProps } from "../root.js";
import { DialogPanel } from "../panel.js";
import { DialogTrigger } from "../trigger.js";
import { DialogPortal } from "../portal.js";
import { useRef, useState } from "react";
import { expect, userEvent, waitFor, within, fn } from "@storybook/test";
import { DialogTitle } from "../title.js";
import { DialogDescription } from "../description.js";
import { DialogClose } from "../close.js";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meta: Meta<DialogRootProps> = {
  title: "components/Dialog",
  component: DialogRoot,
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

function Base(props: DialogRootProps) {
  return (
    <DialogRoot {...props}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel className="dialog">This is my this works</DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

type Story = StoryObj<DialogRootProps>;

export const Default: Story = {
  render: Base,
  play: async ({ step }) => {
    await step("The dialog should be displayed", async () => {
      const canvas = within(document.body);
      const c = canvas.getByRole("dialog");
      await expect(c).toBeVisible();
      await expect(c).toHaveTextContent("This is my this works");

      await expect(c).toMatchScreenshot("one-shot");
    });
  },
  args: {
    open: true,
  },
  argTypes: {
    open: { table: { disable: false } },
    modal: { table: { disable: false } },
  },
};

function WithOpenDialog() {
  return (
    <DialogRoot>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel className="dialog">This is my dialog panel</DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

export const OpenTrigger: Story = {
  render: WithOpenDialog,
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Opening and closing a dialog when using normal trigger", async () => {
      const openButton = canvas.getByText("Open");
      await expect(openButton).toBeVisible();

      await userEvent.click(openButton);

      let dialog = await canvas.findByRole("dialog");

      await waitFor(async () => await expect(dialog).toBeVisible());
      await userEvent.keyboard("{Escape}");

      await userEvent.click(openButton);
      dialog = await canvas.findByRole("dialog");

      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 300,
          clientY: 300,
          detail: 1, // Tricks the is virtual test
        }),
      );
      await wait(100);
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};

export const AlwaysOpen: Story = {
  render: Base,
  args: {
    open: true,
  },
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Opening and closing a dialog when using normal trigger", async () => {
      const dialog = await canvas.findByRole("dialog");

      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 300,
          clientY: 300,
          detail: 1, // Tricks the is virtual test
        }),
      );
      await wait(100);
      await expect(canvas.queryByRole("dialog")).toBeInTheDocument();
    });
  },
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};

export const NotDismissible: Story = {
  render: Base,
  args: {
    dismissible: false,
  },
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Opening and closing a dialog when using normal trigger", async () => {
      const openButton = canvas.getByText("Open");
      await expect(openButton).toBeVisible();

      await userEvent.click(openButton);

      const dialog = await canvas.findByRole("dialog");

      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 300,
          clientY: 300,
        }),
      );
      await wait(100);
      await expect(canvas.queryByRole("dialog")).toBeInTheDocument();
    });
  },
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
          <DialogPanel className="dialog">
            <div>
              <input />
              <input />
              <input />
              <button>X Run</button>
            </div>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
      <div style={{ width: 2000, height: 2000 }} />
    </>
  );
}

export const LocksBodyScroll: Story = {
  render: LocksBodyComponent,
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Opening should hide the scrollbar, and closing should show it again", async () => {
      const open = canvas.getByText("Open");
      await expect(open).toBeVisible();

      await userEvent.click(open);

      const dialog = await canvas.findByRole("dialog");
      await waitFor(async () => await expect(dialog).toBeVisible());

      expect(document.body).toHaveStyle({ overflow: "hidden" });

      dialog.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 300,
          clientY: 300,
          detail: 1, // Tricks the is virtual test
        }),
      );
      await wait(100);
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      expect(document.body).not.toHaveStyle({ overflow: "hidden" });
    });
  },
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};

function FocusAddAndRemove(props: DialogRootProps) {
  const [remove, setRemove] = useState(false);
  return (
    <>
      <DialogRoot {...props}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal>
          <DialogPanel className="dialog">
            <div onClick={() => setRemove((prev) => !prev)}>Toggle Focusables</div>
            {!remove && (
              <div>
                <label htmlFor="1">A</label>
                <input id="1" />
                <label htmlFor="2">A</label>
                <input id="2" />
                <label htmlFor="3">A</label>
                <input id="3" />
              </div>
            )}
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
      <div style={{ width: 2000, height: 2000 }} />
    </>
  );
}

export const FocusRemove: Story = {
  render: FocusAddAndRemove,
  play: async ({ step }) => {
    const canvas = within(document.body);
    await step("Should handle switching between focus and no focus and traps focus", async () => {
      const open = canvas.getByRole("button");

      await userEvent.click(open);

      await expect(document.getElementById("1")).toHaveFocus();

      await userEvent.click(canvas.getByText("Toggle Focusables"));
      await userEvent.keyboard("{Tab}");
      await userEvent.keyboard("{Tab}");
      await userEvent.click(canvas.getByText("Toggle Focusables"));
      await wait(100);

      await userEvent.keyboard("{Tab}");
      await userEvent.keyboard("{Tab}");

      await expect(document.getElementById("2")).toHaveFocus();

      await userEvent.keyboard("{Tab}");
      await userEvent.keyboard("{Tab}");
      await expect(document.getElementById("1")).toHaveFocus();
    });
  },
  argTypes: {
    open: { control: false, table: { disable: true } },
  },
};

function FormHandlingAndTitleAndDescription(props: DialogRootProps) {
  const [text, setText] = useState("");
  return (
    <>
      <DialogRoot {...props}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal>
          <DialogPanel className="dialog">
            <DialogTitle>This is the title</DialogTitle>
            <DialogDescription>This is my description</DialogDescription>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setText("Submitted");
              }}
            >
              <label htmlFor="1">Name</label>
              <input id="1" name="name"></input>

              <label htmlFor="2">Password</label>
              <input id="2" />

              <button>Submit</button>
            </form>
            <div>{text}</div>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
      <div style={{ width: 2000, height: 2000 }} />
    </>
  );
}

export const FormHandling: Story = {
  render: FormHandlingAndTitleAndDescription,
  play: async ({ step }) => {
    const canvas = within(document.body);
    await step("Should handle forms in dialogs", async () => {
      await userEvent.click(canvas.getByText("Open"));

      const title = await canvas.findByText("This is the title");
      expect(title.tagName).toEqual("H2");

      const description = await canvas.findByText("This is my description");
      expect(description.tagName).toEqual("P");

      const dialog = await canvas.findByRole("dialog");

      expect(dialog.getAttribute("aria-describedby")).toEqual(description.id);
      expect(dialog.getAttribute("aria-labelledby")).toEqual(title.id);

      await userEvent.keyboard("{Tab}{Tab}");
      const submitButton = await canvas.findByText("Submit");
      await expect(submitButton).toHaveFocus();

      await userEvent.click(submitButton);

      await wait(100);
      await expect(dialog).toBeVisible();
      await expect(canvas.getByText("Submitted")).toBeVisible();
    });
  },
};

function ModalSettingsComponent(props: DialogRootProps) {
  const [lockScroll, setLockScroll] = useState(true);
  const [trapFocus, setTrapFocus] = useState(true);
  const [dismissible, setDismissible] = useState(true);
  const [modal, setModal] = useState(true);

  return (
    <>
      <DialogRoot
        {...props}
        lockBodyScroll={lockScroll}
        trapFocus={trapFocus}
        dismissible={dismissible}
        modal={modal}
      >
        <DialogTrigger>Open</DialogTrigger>
        <button onClick={() => setModal((prev) => !prev)}>Toggle Modal</button>
        <div>
          <ul>
            <li>Focus: {trapFocus ? "Trapped" : "Not Trapped"}</li>
            <li>Modal: {modal ? "ON" : "Not ON"}</li>
            <li>Locked: {lockScroll ? "Locked" : "Not Locked"}</li>
            <li>Dismiss: {dismissible ? "ON" : "Not ON"}</li>
          </ul>
        </div>
        <DialogPortal>
          <DialogPanel style={{ top: "50%", left: "50%" }} className="dialog">
            <DialogTitle>This is the title</DialogTitle>
            <DialogDescription>This is my description</DialogDescription>
            <DialogClose>Close me</DialogClose>
            <button onClick={() => setLockScroll((prev) => !prev)}>Toggle Lock Scroll</button>
            <button onClick={() => setTrapFocus((prev) => !prev)}>Toggle Focus Trap</button>
            <button onClick={() => setDismissible((prev) => !prev)}>Toggle Dismiss</button>
          </DialogPanel>
        </DialogPortal>
        <div>
          <button>Other Focus Pointer</button>
        </div>
      </DialogRoot>
      <div style={{ width: 2000, height: 2000 }} />
    </>
  );
}

export const ModalSetting: Story = {
  render: ModalSettingsComponent,
  play: async ({ step }) => {
    const canvas = within(document.body);
    await step("Should be able to toggle scroll lock", async () => {
      const open = canvas.getByText("Open");
      await userEvent.click(open);

      const toggle = canvas.getByText("Toggle Lock Scroll");
      expect(document.body).toHaveStyle({ overflow: "hidden" });
      toggle.click();
      await waitFor(() => expect(document.body).not.toHaveStyle({ overflow: "hidden" }));
      toggle.click();
      await waitFor(() => expect(document.body).toHaveStyle({ overflow: "hidden" }));

      canvas.getByText("Close me").click();
      await wait(20);
      expect(canvas.queryByRole("dialog")).toBeNull();
    });

    await step("Should be able to toggle focus trap", async () => {
      const modalToggle = canvas.getByText("Toggle Modal");
      await userEvent.click(modalToggle);
      const open = canvas.getByText("Open");
      await userEvent.click(open);

      await expect(canvas.getByText("Close me")).toHaveFocus();
      await userEvent.keyboard("{Tab}{Tab}");
      await expect(canvas.getByText("Toggle Focus Trap")).toHaveFocus();
      await userEvent.keyboard("{Tab}{Tab}");
      await expect(canvas.getByText("Close me")).toHaveFocus();

      const toggle = canvas.getByText("Toggle Focus Trap");
      toggle.click();

      await userEvent.keyboard("{Tab}{Tab}{Tab}{Tab}{Tab}{Tab}");
      await expect(open).toHaveFocus();

      toggle.click();
      await wait(20);
      const close = canvas.getByText("Close me");
      await expect(close).toHaveFocus();

      close.click();

      modalToggle.click();

      await wait(100);
    });

    await step("Should be able to toggle dismissible", async () => {
      const open = canvas.getByText("Open");
      await userEvent.click(open);

      const toggleDismiss = canvas.getByText("Toggle Dismiss");
      toggleDismiss.click();

      await wait(20);

      await userEvent.keyboard("{Escape}{Escape}");
      await wait(20);

      await expect(canvas.getByText("This is the title")).toBeVisible();

      toggleDismiss.click();
      await wait(20);
      await userEvent.keyboard("{Escape}{Escape}");
      await wait(20);

      await expect(canvas.queryByText("This is the title")).toBeNull();
    });

    await step("Should flag that focus trap is required for modal dialogs", async () => {
      const open = canvas.getByText("Open");
      await userEvent.click(open);

      const err = console.error;
      const cb = fn();
      console.error = cb;

      const toggleTrap = canvas.getByText("Toggle Focus Trap");
      toggleTrap.click();
      await wait(20);

      expect(cb).toHaveBeenCalledOnce();
      expect(cb).toHaveBeenCalledWith(
        "A modal dialog will always trap focus. Setting `trapFocus` to false has no impact. If you do not want to trap focus, set `modal` to false as well.",
      );

      console.error = err;

      await userEvent.click(canvas.getByText("Close me"));
      await wait(20);
    });
  },
};

function AlertDialogComponent() {
  const ref = useRef<DialogApi | null>(null);

  const [dismiss, setDismiss] = useState(false);
  return (
    <DialogRoot ref={ref} alert dismissible={dismiss}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogClose>Cancel</DialogClose>
          <button onClick={() => ref.current?.open(false)}>Accept</button>
          <button onClick={() => setDismiss((prev) => !prev)}>Toggle Dismiss</button>
        </DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

export const AlertDialog: Story = {
  render: AlertDialogComponent,
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Alert Dialog should have the correct role and dismiss behavior", async () => {
      const open = canvas.getByText("Open");
      await userEvent.click(open);

      const dialog = await canvas.findByRole("alertdialog");
      await wait(20);
      await expect(dialog).toBeVisible();

      await userEvent.keyboard("{Escape}{Escape}");

      await wait(30);
      await expect(dialog).toBeVisible();

      await userEvent.click(canvas.getByText("Accept"));
      await wait(30);
      await expect(canvas.queryByRole("alertdialog")).toBeNull();
    });

    await step("Alert Dialog should", async () => {
      const open = canvas.getByText("Open");
      await userEvent.click(open);

      const err = console.error;
      const cb = fn();
      console.error = cb;

      const toggle = canvas.getByText("Toggle Dismiss");
      toggle.click();
      await wait(80);

      expect(cb).toHaveBeenCalledOnce();
      expect(cb).toHaveBeenLastCalledWith(
        "An Alert Dialog will never be dismissible. Alert dialogs by definition require user input to proceed. Use or a normal dialog or set dismissible to false.",
      );

      console.error = err;
    });
  },
};

function CustomRenderElements() {
  return (
    <DialogRoot>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel>
          <DialogTitle id="1" as={<h1></h1>}>
            Are you sure?
          </DialogTitle>
          <DialogDescription id="2" as={<h3></h3>}>
            This is my description
          </DialogDescription>
          <DialogClose as={<h2></h2>}>Cancel</DialogClose>
        </DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

export const CustomRenderers: Story = {
  render: CustomRenderElements,
  play: async ({ step }) => {
    const canvas = within(document.body);
    await step("Should render the correct elements", async () => {
      await userEvent.click(canvas.getByText("Open"));
      await wait(20);

      const title = canvas.getByText("Are you sure?");
      const description = canvas.getByText("This is my description");
      const cancel = canvas.getByText("Cancel");

      expect(title.tagName).toEqual("H1");
      expect(description.tagName).toEqual("H3");
      expect(cancel.tagName).toEqual("H2");

      const dialog = canvas.getByRole("dialog");
      expect(dialog.getAttribute("aria-describedby")).toEqual("2");
      expect(dialog.getAttribute("aria-labelledby")).toEqual("1");

      cancel.click();
      await wait(20);
      expect(canvas.queryByRole("dialog")).toBeNull();
    });
  },
};

function PortalHandling() {
  const [enabled, setEnabled] = useState(true);
  const [keepMounted, setKeepMounted] = useState(false);
  const [switchTarget, setTarget] = useState<null | HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");

  return (
    <div id="root-parent">
      <button onClick={() => setQuery((prev) => (!prev ? "#different-target" : ""))}>
        Use Query
      </button>
      <button onClick={() => setEnabled((prev) => !prev)}>Toggle Portal</button>
      <button onClick={() => setKeepMounted((prev) => !prev)}>Keep Mounted</button>
      <button onClick={() => setTarget((prev) => (prev === ref.current ? null : ref.current))}>
        Toggle Target
      </button>
      <DialogRoot>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal
          enabled={enabled}
          target={query ? query : (switchTarget ?? undefined)}
          keepMounted={keepMounted}
        >
          <DialogPanel id="di">
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This is my description</DialogDescription>
            <DialogClose>Cancel</DialogClose>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
      <div id="different-target" ref={ref}></div>
    </div>
  );
}

export const Portal: Story = {
  render: PortalHandling,
  play: async ({ step }) => {
    const canvas = within(document.body);
    await step("Should render the dialog on the body", async () => {
      await userEvent.click(canvas.getByText("Open"));
      await wait(20);

      const dialog = canvas.getByRole("dialog");
      expect(dialog.parentElement).toEqual(document.body);

      await userEvent.keyboard("{Escape}");
      await wait(20);
    });

    await step("Should render the dialog on target", async () => {
      await userEvent.click(canvas.getByText("Toggle Target"));

      await userEvent.click(canvas.getByText("Open"));
      await wait(20);

      const dialog = canvas.getByRole("dialog");
      expect(dialog.parentElement).toEqual(document.getElementById("different-target"));

      await userEvent.keyboard("{Escape}");
      await wait(20);
      await userEvent.click(canvas.getByText("Toggle Target"));
      await wait(20);
    });

    await step("Should render the dialog on target using query", async () => {
      await userEvent.click(canvas.getByText("Use Query"));

      await userEvent.click(canvas.getByText("Open"));
      await wait(20);

      const dialog = canvas.getByRole("dialog");
      expect(dialog.parentElement).toEqual(document.getElementById("different-target"));

      await userEvent.keyboard("{Escape}");
      await wait(20);
      await userEvent.click(canvas.getByText("Use Query"));
      await wait(20);
    });

    await step("Should be disabled", async () => {
      await userEvent.click(canvas.getByText("Toggle Portal"));

      await userEvent.click(canvas.getByText("Open"));
      await wait(20);

      const dialog = canvas.getByRole("dialog");
      expect(dialog.parentElement).toEqual(document.getElementById("root-parent"));

      await userEvent.keyboard("{Escape}");
      await wait(20);
      await userEvent.click(canvas.getByText("Toggle Portal"));
      await wait(20);
      await expect(canvas.queryByRole("dialog")).toBeNull();
    });

    await step("Should be disabled", async () => {
      await userEvent.click(canvas.getByText("Keep Mounted"));

      await userEvent.click(canvas.getByText("Open"));
      await wait(20);

      const dialog = canvas.getByRole("dialog");
      expect(dialog.parentElement).toEqual(document.body);

      await userEvent.keyboard("{Escape}");
      await wait(20);
      expect(document.getElementById("di")).not.toBeNull();

      await userEvent.click(canvas.getByText("Keep Mounted"));
      await wait(20);
      expect(document.getElementById("di")).toBeNull();
    });
  },
};

function NestedDialogs() {
  return (
    <DialogRoot>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogPanel>
          <DialogTitle>This is one</DialogTitle>
          <DialogRoot>
            <DialogTrigger>Open Nested</DialogTrigger>
            <DialogPortal>
              <DialogPanel>
                <button>Nested</button>
                <DialogClose>Close me</DialogClose>
              </DialogPanel>
            </DialogPortal>
          </DialogRoot>
        </DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
}

export const Nested: Story = {
  render: NestedDialogs,
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Should handle nested dialogs correctly", async () => {
      await userEvent.click(canvas.getByText("Open"));
      await wait(20);

      const dialog = canvas.getByRole("dialog");
      expect(dialog.getAttribute("data-nested")).toEqual("false");
      expect(dialog.getAttribute("data-nested-dialog-open")).toEqual("false");

      await userEvent.click(canvas.getByText("Open Nested"));
      await wait(20);
      expect(dialog.getAttribute("data-nested")).toEqual("false");
      expect(dialog.getAttribute("data-nested-dialog-open")).toEqual("true");

      const nestedDialog = canvas.getAllByRole("dialog").at(-1)!;
      expect(nestedDialog.getAttribute("data-nested")).toEqual("true");
      expect(nestedDialog.getAttribute("data-nested-dialog-open")).toEqual("false");

      await userEvent.click(canvas.getByText("Close me"));

      await wait(20);
      expect(dialog.getAttribute("data-nested")).toEqual("false");
      expect(dialog.getAttribute("data-nested-dialog-open")).toEqual("false");
    });
  },
};

function FocusReturning() {
  return (
    <>
      <DialogRoot>
        <DialogTrigger>Open safe</DialogTrigger>
        <DialogPortal>
          <DialogPanel>
            <DialogClose>Close Me</DialogClose>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>

      <DialogRoot
        returnFocus={() => {
          return document.getElementById("here");
        }}
        initialFocus="#alpha"
      >
        <DialogTrigger>Open</DialogTrigger>
        <button id="here">not em</button>

        <DialogPortal>
          <DialogPanel>
            <DialogTitle>This is one</DialogTitle>
            <DialogClose>Close Root</DialogClose>

            <DialogRoot
              returnFocus="#alpha"
              initialFocus={(dialog) => {
                return dialog.querySelector("#focus-me-first");
              }}
            >
              <DialogTrigger>Open Nested</DialogTrigger>
              <button id="alpha">Return to me</button>
              <DialogPortal>
                <DialogPanel>
                  <button>Nested</button>
                  <DialogClose id="focus-me-first">Close me</DialogClose>
                </DialogPanel>
              </DialogPortal>
            </DialogRoot>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
    </>
  );
}

export const Focus: Story = {
  render: FocusReturning,
  play: async ({ step }) => {
    const canvas = within(document.body);
    await step("Should return focus to the correct place", async () => {
      const openSafe = canvas.getByText("Open safe");
      await userEvent.click(openSafe);
      await wait(20);

      await userEvent.click(canvas.getByText("Close Me"));
      await wait(100);
      expect(openSafe).toHaveFocus();
    });

    await step("Should be able to control the focus return and initial", async () => {
      const open = canvas.getByText("Open");
      await userEvent.click(open);
      await wait(20);

      await expect(canvas.getByText("Return to me")).toHaveFocus();
      await userEvent.click(canvas.getByText("Open Nested"));
      await wait(20);
      await expect(canvas.getByText("Close me")).toHaveFocus();
      await userEvent.click(canvas.getByText("Close me"));
      await wait(20);
      await expect(canvas.getByText("Return to me")).toHaveFocus();
      await userEvent.click(canvas.getByText("Close Root"));
      await wait(20);
      await expect(canvas.getByText("not em")).toHaveFocus();
    });
  },
};

function FocusReturningNonModalsNonTrapped() {
  return (
    <>
      <DialogRoot modal={false} trapFocus={false}>
        <DialogTrigger>Open safe</DialogTrigger>
        <DialogPortal>
          <DialogPanel>
            <DialogClose>Close Me</DialogClose>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>

      <DialogRoot
        modal={false}
        trapFocus={false}
        returnFocus={() => {
          return document.getElementById("here");
        }}
        initialFocus="#alpha"
      >
        <DialogTrigger>Open</DialogTrigger>
        <button id="here">not em</button>

        <DialogPortal>
          <DialogPanel>
            <DialogTitle>This is one</DialogTitle>
            <DialogClose>Close Root</DialogClose>

            <DialogRoot
              modal={false}
              trapFocus={false}
              returnFocus="#alpha"
              initialFocus={(dialog) => {
                return dialog.querySelector("#focus-me-first");
              }}
            >
              <DialogTrigger>Open Nested</DialogTrigger>
              <button id="alpha">Return to me</button>
              <DialogPortal>
                <DialogPanel>
                  <button>Nested</button>
                  <DialogClose id="focus-me-first">Close me</DialogClose>
                </DialogPanel>
              </DialogPortal>
            </DialogRoot>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
    </>
  );
}

export const FocusNonTrapped: Story = {
  render: FocusReturningNonModalsNonTrapped,
  play: async ({ step }) => {
    const canvas = within(document.body);
    await step("Should return focus to the correct place", async () => {
      const openSafe = canvas.getByText("Open safe");
      await userEvent.click(openSafe);
      await wait(20);

      await userEvent.click(canvas.getByText("Close Me"));
      await wait(100);
      expect(openSafe).toHaveFocus();
    });

    await step("Should be able to control the focus return and initial", async () => {
      const open = canvas.getByText("Open");
      await userEvent.click(open);
      await wait(20);

      await expect(canvas.getByText("Return to me")).toHaveFocus();
      await userEvent.click(canvas.getByText("Open Nested"));
      await wait(20);
      await expect(canvas.getByText("Close me")).toHaveFocus();
      await userEvent.click(canvas.getByText("Close me"));
      await wait(20);
      await expect(canvas.getByText("Return to me")).toHaveFocus();
      await userEvent.click(canvas.getByText("Close Root"));
      await wait(20);
      await expect(canvas.getByText("not em")).toHaveFocus();
    });
  },
};

function DismissPropagates() {
  return (
    <>
      <DialogRoot>
        <DialogTrigger>Open</DialogTrigger>
        <button id="here">not em</button>

        <DialogPortal>
          <DialogPanel style={{ background: "rgba(0,0,0,0.2)" }}>
            <DialogTitle>This is one</DialogTitle>
            <DialogClose>Close Root</DialogClose>

            <DialogRoot dismissPropagates>
              <DialogTrigger>Open Nested</DialogTrigger>
              <button id="alpha">Return to me</button>
              <DialogPortal>
                <DialogPanel style={{ background: "rgba(0,0,0,0.2)", left: 50, top: 100 }}>
                  <button>Nested</button>
                  <DialogClose id="focus-me-first">Close me</DialogClose>

                  <DialogRoot dismissPropagates>
                    <DialogTrigger>Open Nested 2</DialogTrigger>
                    <button id="alpha">Return to me</button>
                    <DialogPortal>
                      <DialogPanel
                        id="bob"
                        style={{ background: "rgba(0,0,0,0.2)", left: 100, top: 200 }}
                      >
                        <DialogClose>Final Nesting Level</DialogClose>
                      </DialogPanel>
                    </DialogPortal>
                  </DialogRoot>
                </DialogPanel>
              </DialogPortal>
            </DialogRoot>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
    </>
  );
}

export const Dismiss: Story = {
  render: DismissPropagates,
  play: async ({ step }) => {
    const canvas = within(document.body);

    await step("Should be able to control the focus return and initial", async () => {
      const open = canvas.getByText("Open");
      await userEvent.click(open);

      await userEvent.click(canvas.getByText("Open Nested"));
      await userEvent.click(canvas.getByText("Open Nested 2"));

      const dialog = document.getElementById("bob");
      dialog?.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 300,
          clientY: 300,
          detail: 1, // Tricks the is virtual test
        }),
      );
      await wait(80);

      const all = canvas.queryAllByRole("dialog");
      expect(all).toHaveLength(0);
    });
  },
};

function Transitioned() {
  return (
    <>
      <DialogRoot timeEnter={200} timeExit={200}>
        <DialogTrigger>Open</DialogTrigger>
        <button id="here">not em</button>

        <DialogPortal>
          <DialogPanel style={{ background: "rgba(0,0,0,0.2)" }}>
            <DialogTitle>This is one</DialogTitle>
            <DialogClose>Close Root</DialogClose>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
    </>
  );
}

export const Transition: Story = {
  render: Transitioned,
  play: async ({ step }) => {
    const canvas = within(document.body);
    await step("Should handled transitioned exit", async () => {
      await userEvent.click(canvas.getByText("Open"));
      await wait(20);

      await userEvent.click(canvas.getByText("Close Root"));
      await wait(20);
      expect(canvas.getByRole("dialog")).toBeVisible();
      await wait(200);
      expect(canvas.queryByRole("dialog")).toBeNull();
    });
  },
};
