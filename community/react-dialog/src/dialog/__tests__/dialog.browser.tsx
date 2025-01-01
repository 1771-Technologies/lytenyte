import { useState } from "react";
import { render, userEvent } from "@1771technologies/aio/browser";
import { Dialog } from "../dialog";

test("Can and close a dialog", async () => {
  function Component() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open</button>
        <Dialog onOpenChange={setOpen} open={open}>
          The dialog is open.
        </Dialog>
      </>
    );
  }

  // Render a React element into the DOM
  const screen = render(<Component />);

  const openButton = screen.getByRole("button");
  await expect.element(openButton).toHaveTextContent("Open");
  await openButton.click();

  const dialogContent = screen.getByText("The dialog is open");
  await expect.element(dialogContent).toBeVisible();

  await dialogContent.click();
  await expect.element(dialogContent).toBeVisible();

  await userEvent.keyboard("{Escape}");
  await expect.element(dialogContent).not.toBeInTheDocument();
});

test("The dialog captures focus", async () => {
  const Component = () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button onClick={() => setOpen(true)}>Open</button>
        <Dialog onOpenChange={setOpen} open={open}>
          <button>Alpha</button>
          <input data-testid="input"></input>
          <button>Live</button>
        </Dialog>
      </>
    );
  };

  const screen = render(<Component />);

  const button = screen.getByText("Open");
  await button.click();

  const alpha = screen.getByText("Alpha");
  await expect.element(alpha).toBeVisible();

  // The first element should automatically be focused.
  await expect.element(alpha).toHaveFocus();
  userEvent.keyboard("{Tab}");

  const input = screen.getByTestId("input");
  await expect.element(input).toBeVisible();
  await expect.element(input).toHaveFocus();
  userEvent.keyboard("{Tab}");

  const live = screen.getByText("Live");
  await expect.element(live).toBeVisible();
  await expect.element(live).toHaveFocus();

  userEvent.keyboard("{Tab}");
  await expect.element(alpha).toHaveFocus();

  userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await expect.element(live).toHaveFocus();
  userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await expect.element(input).toHaveFocus();
  userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await expect.element(alpha).toHaveFocus();
  userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await expect.element(live).toHaveFocus();
});

test("Nested dialogs", async () => {
  const Component = () => {
    const [open, setOpen] = useState(false);
    const [nested, setNestedOpen] = useState(false);

    return (
      <div>
        <button onClick={() => setOpen(true)}>Open</button>
        <Dialog open={open} onOpenChange={setOpen}>
          <button onClick={() => setNestedOpen(true)}>Nested</button>
          <Dialog open={nested} onOpenChange={setNestedOpen}>
            I am nested
            <button>Alpha</button>
            <button>Beta</button>
            <button>Sigma</button>
          </Dialog>
        </Dialog>
      </div>
    );
  };

  const screen = render(<Component />);

  const button = screen.getByText("Open");
  await expect.element(button).toBeVisible();
  await button.click();

  const nestedOpenButton = screen.getByText("Nested");
  await expect.element(nestedOpenButton).toBeVisible();
  await nestedOpenButton.click();

  await expect.element(screen.getByText("I am nested")).toBeVisible();

  const alpha = screen.getByText("Alpha");
  const beta = screen.getByText("Beta");
  const sigma = screen.getByText("Sigma");

  await expect.element(alpha).toBeVisible();
  await expect.element(beta).toBeVisible();
  await expect.element(sigma).toBeVisible();

  await expect.element(alpha).toHaveFocus();
  await userEvent.keyboard("{Tab}");
  await userEvent.keyboard("{Tab}");
  await expect.element(sigma).toHaveFocus();
  await userEvent.keyboard("{Tab}");
  await expect.element(alpha).toHaveFocus();
});

test("Dialog respects the declarative open setting", async () => {
  const Component = () => {
    return (
      <Dialog open onOpenChange={() => {}}>
        I will always be open
      </Dialog>
    );
  };

  const screen = render(<Component />);

  const content = screen.getByText("I will always be open");
  await expect.element(content).toBeVisible();
  userEvent.keyboard("{Escape}");
  await expect.element(content).toBeVisible();
});
