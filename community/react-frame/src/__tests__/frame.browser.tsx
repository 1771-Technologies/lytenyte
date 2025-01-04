import { useState } from "react";
import { defaultAxeProps } from "../default-axe-props.js";
import { Frame } from "../frame.js";
import { page, render, userEvent } from "@1771technologies/aio/browser";

test("should create a moveable frame", async () => {
  function X() {
    const [w, setW] = useState<number | null>(null);
    const [h, setH] = useState<number | null>(null);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [show, setShow] = useState(false);

    return (
      <div>
        <div>Width: {w}</div>
        <div>Height: {h}</div>
        <button onClick={() => setShow((prev) => !prev)}>Show Frame</button>
        <Frame
          onShowChange={setShow}
          show={show}
          x={x}
          y={y}
          width={w}
          height={h}
          maxWidth={"220vw"}
          header={<div>This is my header content</div>}
          axe={defaultAxeProps}
          onSizeChange={(w, h) => {
            setW(w);
            setH(h);
          }}
          onMove={(x, y) => {
            setX(x);
            setY(y);
          }}
        >
          This is my driver content. I put a lot of content into it.
        </Frame>
      </div>
    );
  }

  const screen = render(<X />);

  const show = screen.getByText("Show Frame");

  await show.click();

  const t = screen.getByText("This is my driver content. I put a lot of content into it");
  await expect.element(t).toBeVisible();

  const [_, header, resize] = screen.getByRole("button").all();

  await header.click();
  await userEvent.keyboard("{ArrowUp}{ArrowDown}{ArrowLeft}{ArrowRight}");
  await resize.click();
  await userEvent.keyboard("{ArrowUp}{ArrowDown}{ArrowLeft}{ArrowRight}");
  await resize.click();

  await page.viewport(1000, 1000);

  await userEvent.keyboard("{Escape}");
  await expect.element(t).not.toBeInTheDocument();

  screen.unmount();
});

test("should create a moveable frame uncontrolled", async () => {
  function X() {
    const [show, setShow] = useState(false);

    return (
      <div>
        <button onClick={() => setShow((prev) => !prev)}>Show Frame</button>
        <Frame
          onShowChange={setShow}
          show={show}
          x={22}
          y={11}
          maxWidth={"220vw"}
          header={<div>This is my header content</div>}
          axe={defaultAxeProps}
        >
          This is my driver content. I put a lot of content into it.
        </Frame>
      </div>
    );
  }

  const screen = render(<X />);

  const show = screen.getByText("Show Frame");

  await show.click();

  const t = screen.getByText("This is my driver content. I put a lot of content into it");
  await expect.element(t).toBeVisible();

  const [_, header, resize] = screen.getByRole("button").all();

  await header.click();
  await userEvent.keyboard("{ArrowUp}{ArrowDown}{ArrowLeft}{ArrowRight}");
  await resize.click();
  await userEvent.keyboard("{ArrowUp}{ArrowDown}{ArrowLeft}{ArrowRight}");
  await resize.click();

  await page.viewport(1000, 1000);

  await userEvent.keyboard("{Escape}");
  await expect.element(t).not.toBeInTheDocument();

  screen.unmount();
});

test("should create a frame that is not movable or resizable", async () => {
  function X() {
    const [show, setShow] = useState(false);

    return (
      <div>
        <button onClick={() => setShow((prev) => !prev)}>Show Frame</button>
        <Frame
          onShowChange={setShow}
          show={show}
          resizable={false}
          movable={false}
          x={22}
          y={11}
          maxWidth={"220vw"}
          header={<div>This is my header content</div>}
          axe={defaultAxeProps}
        >
          This is my driver content. I put a lot of content into it.
        </Frame>
      </div>
    );
  }

  const screen = render(<X />);

  const show = screen.getByText("Show Frame");

  await show.click();

  const t = screen.getByText("This is my driver content. I put a lot of content into it");
  await expect.element(t).toBeVisible();

  expect(screen.getByRole("button").all()).toHaveLength(1);

  await userEvent.keyboard("{Escape}");
  await expect.element(t).not.toBeInTheDocument();

  screen.unmount();
});
