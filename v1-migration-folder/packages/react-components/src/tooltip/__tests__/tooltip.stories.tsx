import type { Meta, StoryObj } from "@storybook/react";
import { TooltipDriver } from "../driver";
import { useTooltip } from "../use-tooltip";
import { expect, userEvent, within } from "@storybook/test";
import { sleep } from "@1771technologies/lytenyte-js-utils";
import { useState } from "react";
import { hide, show } from "../tooltip-api";

const meta: Meta = {
  title: "Components/Tooltip",
};

export default meta;

function Tooltip() {
  const p = useTooltip({
    id: "y",
    render: <div style={{ background: "black", color: "white" }}>I display as a tooltip</div>,
    position: { side: "top" },
  });
  return (
    <>
      <TooltipDriver />
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div {...p} style={{ border: "1px solid black" }}>
          Explain more
        </div>
      </div>
    </>
  );
}

export const Main: StoryObj = {
  render: Tooltip,
};

function TooltipMulti() {
  const p = useTooltip({
    id: "y",
    render: <div style={{ background: "black", color: "white" }}>I display as a tooltip</div>,
    position: { side: "top" },
  });
  const p2 = useTooltip({
    id: "x",
    render: <div style={{ background: "black", color: "white" }}>I display as a tooltip 2</div>,
    onHide: () => {},
    onShow: () => {},
    position: { side: "top" },
  });

  return (
    <>
      <TooltipDriver />
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div {...p} style={{ border: "1px solid black" }}>
          One
        </div>
        <div {...p2} style={{ border: "1px solid black" }}>
          Two
        </div>
      </div>
    </>
  );
}

export const Multi: StoryObj = {
  render: TooltipMulti,
  play: async () => {
    const c = within(document.body);
    const one = await c.findByText("One");
    await userEvent.hover(one);
    await userEvent.hover(one);
    await sleep();
    expect(c.getByText("I display as a tooltip")).toBeVisible();
    await userEvent.unhover(one);

    const two = await c.findByText("Two");
    await userEvent.hover(two);
    await userEvent.hover(two);
    await sleep();
    expect(c.getByText("I display as a tooltip 2")).toBeVisible();
    await userEvent.unhover(two);
    await sleep();

    two.focus();
    await sleep();
    expect(c.getByText("I display as a tooltip 2")).toBeVisible();
    two.blur();
    await sleep();
  },
};

function Hide() {
  const p = useTooltip({
    id: "x",
    render: (p) => (
      <div {...p} style={{ background: "black", color: "white" }}>
        I display as a tooltip
      </div>
    ),
    position: { side: "top" },
    hideDelay: 0,
  });
  return (
    <>
      <TooltipDriver />
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div {...p} style={{ border: "1px solid black" }}>
          Explain more
        </div>
      </div>
    </>
  );
}
export const HideAndCustom: StoryObj = {
  render: Hide,
  play: async () => {
    const c = within(document.body);

    const el = c.getByText("Explain more");
    await userEvent.hover(el);
    el.focus();
    await sleep();
    el.blur();
    await sleep();
    await userEvent.unhover(el);
  },
};

function ControlledComp() {
  const [open, setOpen] = useState(false);

  const p = useTooltip({
    id: "x",
    open,
    render: <div style={{ background: "black", color: "white" }}>I display as a tooltip</div>,
    position: { side: "top" },
    hideDelay: 0,
  });

  return (
    <>
      <TooltipDriver />
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div {...p} style={{ border: "1px solid black" }} onClick={() => setOpen((prev) => !prev)}>
          Explain more
        </div>
      </div>
    </>
  );
}

export const Controlled: StoryObj = {
  render: ControlledComp,
  play: async () => {
    const c = within(document.body);

    await userEvent.click(c.getByText("Explain more"));
    await sleep();
    await userEvent.click(c.getByText("Explain more"));
  },
};

function InteractiveComp() {
  const p = useTooltip({
    id: "x",
    render: <div style={{ background: "black", color: "white" }}>I display as a tooltip</div>,
    position: { side: "top", sideOffset: 12 },
    hideDelay: 100,
    interactive: true,
  });

  return (
    <>
      <TooltipDriver />
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div {...p} style={{ border: "1px solid black" }}>
          Explain more
        </div>
      </div>
    </>
  );
}

export const Interactive: StoryObj = {
  render: InteractiveComp,
  play: async () => {
    const c = within(document.body);

    await userEvent.hover(c.getByText("Explain more"));
    await sleep();
    await userEvent.unhover(c.getByText("Explain more"));
    await sleep(40);

    await userEvent.hover(c.getByText("I display as a tooltip"));
    await sleep();
    await userEvent.unhover(c.getByText("I display as a tooltip"));
  },
};

function ApiComp() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TooltipDriver />
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          onClick={(e) => {
            if (!open) {
              show({
                anchor: e.currentTarget,
                id: "x",
                render: <div>This is my custom tooltip</div>,
                showDelay: 100,
              });
              setOpen(true);
            } else {
              hide("x", true);
              setOpen(false);
            }
          }}
          style={{ border: "1px solid black" }}
        >
          Explain more
        </div>
      </div>
    </>
  );
}

export const Api: StoryObj = {
  render: ApiComp,
  play: async () => {
    const c = within(document.body);

    await userEvent.click(c.getByText("Explain more"));
    await sleep();
    await userEvent.click(c.getByText("Explain more"));
  },
};

function TaggedComp() {
  const t1 = useTooltip({
    id: "1",
    render: <div>Tooltip 1</div>,
    tag: "alpha",
    hideDelay: 100,
  });
  const t2 = useTooltip({
    id: "2",
    render: <div>Tooltip 2</div>,
    tag: "alpha",
    showDelay: 1000,
    hideDelay: 500,
  });
  const t3 = useTooltip({
    id: "3",
    render: <div>Tooltip 2</div>,
    showDelay: 1000,
    hideDelay: 500,
  });

  return (
    <>
      <TooltipDriver />
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div {...t1} style={{ border: "1px solid black" }}>
          Tag 1
        </div>
        <div {...t2} style={{ border: "1px solid black" }}>
          Tag 2
        </div>
        <div {...t3} style={{ border: "1px solid black" }}>
          Tag 3
        </div>
      </div>
    </>
  );
}

export const Tagged: StoryObj = {
  render: TaggedComp,
  play: async ({ canvas: c }) => {
    await userEvent.hover(c.getByText("Tag 1"));
    await sleep(20);
    await userEvent.unhover(c.getByText("Tag 1"));
    await sleep(20);
    await userEvent.hover(c.getByText("Tag 2"));
    await sleep(20);
    await userEvent.unhover(c.getByText("Tag 2"));
  },
};
