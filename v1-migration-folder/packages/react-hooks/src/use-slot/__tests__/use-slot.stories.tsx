import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { Counter, CounterNoProps } from "./counter.js";
import { useState } from "react";

const meta: Meta = {
  title: "react-hooks/useSlotBasic",
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    return <Counter counter={2} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText("0"));

    await expect(canvas.getByText("2")).toBeInTheDocument();
  },
};

export const AlteredRender: StoryObj = {
  render: () => {
    return <Counter slot={<button />} counter={2} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const el = canvas.getByRole("button");
    await userEvent.click(el);

    await expect(canvas.getByText("2")).toBeInTheDocument();
  },
};

export const MergesEventHandlers: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [external, setExternal] = useState(0);
    return (
      <>
        <Counter slot={<button />} counter={2} onClick={() => setExternal((prev) => prev + 1)} />
        <div>{external}</div>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const el = canvas.getByRole("button");
    await userEvent.click(el);

    await expect(canvas.getByText("2")).toBeInTheDocument();
    await expect(canvas.getByText("1")).toBeInTheDocument();
  },
};

export const FunctionRender: StoryObj = {
  render: () => {
    return <Counter slot={() => <button />} counter={2} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const el = canvas.getByRole("button");
    await userEvent.click(el);

    await expect(canvas.getByText("2")).toBeInTheDocument();
  },
};

export const HandlesStylesAndClassName: StoryObj = {
  render: () => {
    return (
      <Counter
        className="bob"
        style={{ height: 200 }}
        onPointerDown={() => {}}
        slot={() => (
          <button
            style={{ width: 200, boxSizing: "border-box", margin: 0, border: "0px" }}
            onMouseEnter={() => {}}
            className="alpha"
          />
        )}
        counter={2}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const el = canvas.getByRole("button");
    await userEvent.click(el);

    await expect(canvas.getByText("2")).toBeInTheDocument();
    expect(el.clientHeight).toEqual(200);
    expect(el.clientWidth).toEqual(200);
    expect(el.className).toEqual("bob alpha");
  },
};

export const HandlesNoProps: StoryObj = {
  render: () => {
    return <CounterNoProps slot={<button />} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const el = canvas.getByRole("button");
    await userEvent.click(el);

    await expect(canvas.getByText("1")).toBeInTheDocument();
  },
};

export const ShouldHandleRefs: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [ref1, setRef1] = useState<HTMLElement | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [ref2, setRef2] = useState<HTMLElement | null>(null);
    return (
      <>
        <Counter ref={setRef1} slot={<button ref={setRef2} />} counter={2} />
        {ref1 && <div>Ref 1 Is Fine</div>}
        {ref2 && <div>Ref 2 Is Fine</div>}
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const el = canvas.getByRole("button");
    await userEvent.click(el);

    await expect(canvas.getByText("2")).toBeInTheDocument();
    await expect(canvas.getByText("Ref 1 Is Fine")).toBeVisible();
    await expect(canvas.getByText("Ref 2 Is Fine")).toBeVisible();
  },
};
