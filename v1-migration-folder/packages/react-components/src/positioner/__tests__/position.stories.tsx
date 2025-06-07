import type { Meta, StoryObj } from "@storybook/react";
import type { Side } from "../use-positioner.js";
import { type UsePositioner } from "../use-positioner.js";
import { Positioner } from "../positioner.js";
import { useState } from "react";
import { expect, userEvent, within } from "@storybook/test";
import { sleep } from "@1771technologies/lytenyte-js-utils";
import type { Alignment } from "@1771technologies/lytenyte-floating";

const meta: Meta<Omit<UsePositioner, "floating">> = {
  title: "Components/Positioner",
};

export default meta;

function Main() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [side, setSide] = useState<Side>("bottom");
  const [align, setAlign] = useState<Alignment | "center">("center");
  const [active, setActive] = useState(true);
  const [sideOffset, setSideOffset] = useState(4);
  const [alignOffset, setAlignOffset] = useState(4);
  const [shiftPadding, setShiftPadding] = useState(8);

  return (
    <>
      <div>
        <button onClick={() => setSide("top")}>Top</button>
        <button onClick={() => setSide("bottom")}>Bottom</button>
        <button onClick={() => setSide("start")}>Start</button>
        <button onClick={() => setSide("end")}>End</button>
        <button onClick={() => setAlign("start")}>a-start</button>
        <button onClick={() => setAlign("center")}>center</button>
        <button onClick={() => setAlign("end")}>a-end</button>
      </div>
      <div>
        <button onClick={() => setActive((prev) => !prev)}>Toggle Active</button>
        <button onClick={() => setSideOffset((prev) => prev + 4)}>Offset Up</button>
        <button onClick={() => setSideOffset((prev) => prev - 4)}>Offset Down</button>
        <button onClick={() => setAlignOffset((prev) => prev + 4)}>Align Up</button>
        <button onClick={() => setAlignOffset((prev) => prev - 4)}>Align Down</button>
        <button onClick={() => setShiftPadding((prev) => prev + 4)}>Shift Up</button>
        <button onClick={() => setShiftPadding((prev) => prev - 4)}>Shift Down</button>
      </div>

      <div
        style={{
          width: "90vw",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 50, height: 50, background: "grey" }} ref={setRef}>
          Anchor
        </div>
        {ref && (
          <Positioner
            anchor={ref}
            side={side}
            align={align}
            active={active}
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            shiftPadding={shiftPadding}
          >
            <div style={{ width: "150px", height: "50px", background: "black", color: "white" }}>
              I will be positioned
            </div>
          </Positioner>
        )}
      </div>
    </>
  );
}

export const main: StoryObj = {
  render: Main,
  play: async ({ canvasElement, step }) => {
    const c = within(canvasElement);

    const el = await c.findByText("I will be positioned");
    expect(el).toBeVisible();

    expect(el.style.getPropertyValue("--reference-width")).toEqual("50px");
    expect(el.style.getPropertyValue("--reference-height")).toEqual("50px");
    expect(el.style.getPropertyValue("--floating-height")).toEqual("50px");
    expect(el.style.getPropertyValue("--floating-width")).toEqual("150px");

    await step("Bottom position", async () => {
      await userEvent.click(c.getByText("Bottom"));
      await sleep();
      expect(el.getAttribute("data-side")).toEqual("bottom");
      expect(el.getAttribute("data-align")).toEqual("center");
      await userEvent.click(c.getByText("a-start"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("start");
      expect(el.getAttribute("data-side")).toEqual("bottom");
      await userEvent.click(c.getByText("a-end"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("end");
      expect(el.getAttribute("data-side")).toEqual("bottom");
      await userEvent.click(c.getByText("center"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("center");
      expect(el.getAttribute("data-side")).toEqual("bottom");
    });

    await step("Top position", async () => {
      await userEvent.click(c.getByText("Top"));
      await sleep();
      expect(el.getAttribute("data-side")).toEqual("top");
      expect(el.getAttribute("data-align")).toEqual("center");
      await userEvent.click(c.getByText("a-start"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("start");
      expect(el.getAttribute("data-side")).toEqual("top");
      await userEvent.click(c.getByText("a-end"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("end");
      expect(el.getAttribute("data-side")).toEqual("top");
      await userEvent.click(c.getByText("center"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("center");
      expect(el.getAttribute("data-side")).toEqual("top");
    });

    await step("Start position", async () => {
      await userEvent.click(c.getByText("Start"));
      await sleep();
      expect(el.getAttribute("data-side")).toEqual("start");
      expect(el.getAttribute("data-align")).toEqual("center");
      await userEvent.click(c.getByText("a-start"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("start");
      expect(el.getAttribute("data-side")).toEqual("start");
      await userEvent.click(c.getByText("a-end"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("end");
      expect(el.getAttribute("data-side")).toEqual("start");
      await userEvent.click(c.getByText("center"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("center");
      expect(el.getAttribute("data-side")).toEqual("start");
    });

    await step("End position", async () => {
      await userEvent.click(c.getByText("End"));
      await sleep();
      expect(el.getAttribute("data-side")).toEqual("end");
      expect(el.getAttribute("data-align")).toEqual("center");
      await userEvent.click(c.getByText("a-start"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("start");
      expect(el.getAttribute("data-side")).toEqual("end");
      await userEvent.click(c.getByText("a-end"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("end");
      expect(el.getAttribute("data-side")).toEqual("end");
      await userEvent.click(c.getByText("center"));
      await sleep();
      expect(el.getAttribute("data-align")).toEqual("center");
      expect(el.getAttribute("data-side")).toEqual("end");
    });
  },
};

export const ActiveToggle: StoryObj = {
  render: Main,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);

    const el = await c.findByText("I will be positioned");
    expect(el).toBeVisible();
    await userEvent.click(c.getByText("Toggle Active"));
    await sleep();
    expect(c.queryByText("I will be positioned")).toEqual(null);
  },
};

export const Offsets: StoryObj = {
  render: Main,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);

    const el = await c.findByText("I will be positioned");
    expect(el).toBeVisible();

    await userEvent.click(c.getByText("Offset Up"));
    await sleep();
    await userEvent.click(c.getByText("Offset Up"));
    await sleep();
    await userEvent.click(c.getByText("Offset Down"));
    await sleep();
    await userEvent.click(c.getByText("Offset Down"));
    await sleep();
    await userEvent.click(c.getByText("Offset Down"));
    await sleep();

    await userEvent.click(c.getByText("a-start"));
    await sleep();
    await userEvent.click(c.getByText("Align Up"));
    await sleep();
    await userEvent.click(c.getByText("Align Up"));
    await sleep();
    await userEvent.click(c.getByText("Align Up"));
    await sleep();
    await userEvent.click(c.getByText("Align Down"));
    await sleep();
    await userEvent.click(c.getByText("Align Down"));
    await sleep();
    await userEvent.click(c.getByText("Align Down"));
    await sleep();
    await userEvent.click(c.getByText("Align Down"));
    await sleep();
  },
};

function ShiftComp() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [side] = useState<Side>("bottom");
  const [align] = useState<Alignment | "center">("center");
  const [active] = useState(true);
  const [sideOffset] = useState(4);
  const [alignOffset] = useState(4);
  const [shiftPadding] = useState(8);

  return (
    <div
      style={{
        width: "90vw",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 50, height: 50, background: "grey" }} ref={setRef}>
        Anchor
      </div>
      {ref && (
        <Positioner
          anchor={ref}
          side={side}
          align={align}
          active={active}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          shiftPadding={shiftPadding}
        >
          <div style={{ width: "150px", height: "50px", background: "black", color: "white" }}>
            I will be positioned
          </div>
        </Positioner>
      )}
      <div style={{ height: "300vh", width: "20px" }} />
    </div>
  );
}

export const Shift: StoryObj = {
  render: ShiftComp,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const el = c.getByText("Anchor");
    await expect(el).toBeVisible();
    const floating = c.getByText("I will be positioned");
    expect(floating.getAttribute("data-reference-hidden")).toEqual("false");

    document.documentElement.scrollBy({ top: 2000 });
    await sleep();
    expect(floating.getAttribute("data-reference-hidden")).toEqual("true");
  },
};

function Scroller() {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <div
      style={{
        width: "90vw",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        tabIndex={0}
        style={{ width: 500, height: 500, border: "1px solid black", overflow: "auto" }}
      >
        <div
          style={{
            position: "relative",
            left: 200,
            top: 200,
            width: 50,
            height: 50,
            background: "grey",
          }}
          ref={setRef}
        >
          Anchor
        </div>
        <div style={{ width: 2000, height: 2000 }} />

        {ref && (
          <Positioner anchor={ref} shiftPadding={0} rootBoundary="nearest">
            <div style={{ width: "150px", height: "50px", background: "black", color: "white" }}>
              I will be positioned
            </div>
          </Positioner>
        )}
      </div>
      <div style={{ height: "300vh", width: "20px" }} />
    </div>
  );
}

export const Scroll: StoryObj = {
  render: Scroller,
};

function Arrows() {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const [side, setSide] = useState<Side>("bottom");
  const [align, setAlign] = useState<Alignment | "center">("center");
  const [active, setActive] = useState(true);
  const [sideOffset, setSideOffset] = useState(4);
  const [alignOffset, setAlignOffset] = useState(4);
  const [shiftPadding, setShiftPadding] = useState(8);

  return (
    <>
      <div>
        <button onClick={() => setSide("top")}>Top</button>
        <button onClick={() => setSide("bottom")}>Bottom</button>
        <button onClick={() => setSide("start")}>Start</button>
        <button onClick={() => setSide("end")}>End</button>
        <button onClick={() => setAlign("start")}>a-start</button>
        <button onClick={() => setAlign("center")}>center</button>
        <button onClick={() => setAlign("end")}>a-end</button>
      </div>
      <div>
        <button onClick={() => setActive((prev) => !prev)}>Toggle Active</button>
        <button onClick={() => setSideOffset((prev) => prev + 4)}>Offset Up</button>
        <button onClick={() => setSideOffset((prev) => prev - 4)}>Offset Down</button>
        <button onClick={() => setAlignOffset((prev) => prev + 4)}>Align Up</button>
        <button onClick={() => setAlignOffset((prev) => prev - 4)}>Align Down</button>
        <button onClick={() => setShiftPadding((prev) => prev + 4)}>Shift Up</button>
        <button onClick={() => setShiftPadding((prev) => prev - 4)}>Shift Down</button>
      </div>

      <div
        style={{
          width: "90vw",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          tabIndex={0}
          style={{ width: 500, height: 500, border: "1px solid black", overflow: "auto" }}
        >
          <div
            style={{
              position: "relative",
              left: 200,
              top: 200,
              width: 50,
              height: 50,
              background: "grey",
            }}
            ref={setRef}
          >
            Anchor
          </div>
          <div style={{ width: 2000, height: 2000 }} />

          {ref && (
            <Positioner
              anchor={ref}
              side={side}
              align={align}
              active={active}
              sideOffset={sideOffset}
              alignOffset={alignOffset}
              shiftPadding={shiftPadding}
              rootBoundary="nearest"
              arrow="#arrow"
              arrowOffset={0}
            >
              <div style={{ width: "150px", height: "50px", background: "black", color: "white" }}>
                <div style={{ width: "8px", height: "8px", background: "yellow" }} id="arrow" />I
                will be positioned
              </div>
            </Positioner>
          )}
        </div>
        <div style={{ height: "300vh", width: "20px" }} />
      </div>
    </>
  );
}

export const Arrow: StoryObj = {
  render: Arrows,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Top"));
    await sleep();
    await userEvent.click(canvas.getByText("Bottom"));
    await sleep();
    await userEvent.click(canvas.getByText("Start"));
    await sleep();
    await userEvent.click(canvas.getByText("End"));
    await sleep();
    await userEvent.click(canvas.getByText("Bottom"));
    await sleep();
  },
};

function InlineComp() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);

  return (
    <div
      style={{
        width: "90vw",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        tabIndex={0}
        ref={setRoot}
        style={{ width: 500, height: 500, border: "1px solid black", overflow: "auto" }}
      >
        <div
          style={{
            position: "relative",
            left: 200,
            top: 200,
            width: 200,
            height: 50,
            background: "grey",
          }}
        >
          Anchor to a fine point <span ref={setRef}>in time and relive the</span> moment.
        </div>
        <div style={{ width: 2000, height: 2000 }} />

        {ref && (
          <Positioner
            anchor={ref}
            shiftPadding={0}
            rootBoundary={root ?? undefined}
            inline
            side="top"
          >
            <div style={{ width: "150px", height: "50px", background: "black", color: "white" }}>
              I will be positioned
            </div>
          </Positioner>
        )}
      </div>
      <div style={{ height: "300vh", width: "20px" }} />
    </div>
  );
}

export const Inline: StoryObj = {
  render: InlineComp,
};

function VirtualComp() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);

  return (
    <div
      style={{
        width: "90vw",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        tabIndex={0}
        ref={setRoot}
        style={{ width: 500, height: 500, border: "1px solid black", overflow: "auto" }}
      >
        <div
          style={{
            position: "relative",
            left: 200,
            top: 200,
            width: 200,
            height: 50,
            background: "grey",
          }}
        >
          Anchor to a fine point <span ref={setRef}>in time and relive the</span> moment.
        </div>
        <div style={{ width: 2000, height: 2000 }} />

        {ref && (
          <Positioner
            anchor={{
              getBoundingClientRect: () => ref.getBoundingClientRect(),
              contextElement: ref,
            }}
            shiftPadding={0}
            rootBoundary={root ?? undefined}
            side="top"
          >
            <div style={{ width: "150px", height: "50px", background: "black", color: "white" }}>
              I will be positioned
            </div>
          </Positioner>
        )}
      </div>
      <div style={{ height: "300vh", width: "20px" }} />
    </div>
  );
}

export const Virtual: StoryObj = {
  render: VirtualComp,
};
