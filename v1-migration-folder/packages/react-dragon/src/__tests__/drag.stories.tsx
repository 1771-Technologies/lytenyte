import "./drag.stories.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useDraggable, type DragProps } from "../use-draggable.js";
import { DropWrap } from "../drop-wrap/drop-wrap.js";
import { useState, type Dispatch, type SetStateAction } from "react";
import { expect, fn, within } from "@storybook/test";
import { dragHandler } from "./drag-utils";

const wait = (n?: number) => new Promise((res) => setTimeout(res, n ?? 20));
const meta: Meta = {
  title: "dragon/Drag",
};

export default meta;

function DragBasicComp() {
  const { dragProps } = useDraggable({
    getItems: () => {
      return {};
    },
  });

  return (
    <div>
      <div {...dragProps} style={{ width: 200, height: 200, background: "green" }}></div>
    </div>
  );
}

export const DragBasic: StoryObj = {
  render: DragBasicComp,
};

function DropItemComp() {
  const [count, setCount] = useState(1);
  const [data, setData] = useState<number | null>(0);

  const { dragProps } = useDraggable({
    getItems: () => {
      return {
        siteLocalData: {
          fine: count,
        },
      };
    },
    onDrop: () => setCount((prev) => prev + 1),
  });

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div {...dragProps}>Box containing {count}</div>

      <DropWrap
        accepted={["fine"]}
        onDrop={(p) => {
          const count = p.state.siteLocalData?.fine;

          setData((prev) => prev + count);
        }}
      >
        Target For Drop: {data}
      </DropWrap>
    </div>
  );
}

export const DropHandling: StoryObj = {
  render: DropItemComp,
};

function DragNestedComp() {
  const { dragProps, isDragging } = useDraggable({
    getItems: () => ({ siteLocalData: { x: 2 } }),
    onDrop: (ev) => {
      alert(`Dropped on ${ev.dropElement.id}`);
    },
  });
  return (
    <div>
      <div {...dragProps} className={isDragging ? "dragging" : ""}>
        I will be dragged
      </div>
      <div
        style={{
          width: 600,
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DropWrap
          id="drop-outer"
          accepted={["x"]}
          style={{ width: "300px", height: "300px", background: "green" }}
        >
          <DropWrap
            id="drop-inner"
            accepted={["x"]}
            style={{ width: 150, height: 150, background: "blue" }}
          >
            <div style={{ height: 50, width: 50, background: "gray" }}></div>
          </DropWrap>
        </DropWrap>
      </div>
    </div>
  );
}

export const DragNestedHandling: StoryObj = {
  render: DragNestedComp,
};

function CoveredNestedComp() {
  const mock = fn();
  const { dragProps, isDragging } = useDraggable({
    getItems: () => ({ siteLocalData: { x: 2 } }),
    onDrop: (ev) => {
      mock(ev.dropElement.id);
    },
  });
  return (
    <div>
      <div {...dragProps} className={isDragging ? "dragging" : ""}>
        I will be dragged
      </div>
      <div
        style={{
          width: 600,
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            background: "black",
            position: "relative",
            left: "80px",
          }}
        >
          I covered
        </div>
        <DropWrap
          id="drop-outer"
          accepted={["x"]}
          style={{ width: "300px", height: "300px", background: "green" }}
        >
          <DropWrap
            id="drop-inner"
            accepted={["x"]}
            style={{ width: 150, height: 150, background: "blue" }}
          >
            <div style={{ height: 50, width: 50, background: "gray" }}>Inner</div>
          </DropWrap>
          Finally
        </DropWrap>
      </div>
    </div>
  );
}

export const DragNestedHandlingCovered: StoryObj = {
  render: CoveredNestedComp,
  play: async ({ canvasElement }) => {
    const ctx = within(canvasElement);

    const cover = ctx.getByText("I covered");
    await expect(cover).toBeVisible();
    const bb = cover.getBoundingClientRect();

    const dragEl = ctx.getByText("I will be dragged");
    await expect(dragEl).toBeVisible();

    dragHandler.touchstart(dragEl);
    await wait(300);

    dragHandler.touchmove(dragEl, { x: bb.x + 2, y: bb.y + 2 });
    dragHandler.touchmove(dragEl, { x: bb.x + 2, y: bb.y + 2 });
    await wait();

    const inner = ctx.getByText("Inner");
    await expect(inner).toBeVisible();
    const innerBB = inner.getBoundingClientRect();
    dragHandler.touchmove(dragEl, { x: innerBB.x, y: innerBB.y + 2 });
    await wait();
    dragHandler.touchend(dragEl);
    await wait();
  },
};

function DragScrollContainers() {
  const { dragProps } = useDraggable({
    getItems: () => ({ siteLocalData: { x: 2 } }),
    onDrop: (ev) => {
      alert(`Dropped on ${ev.dropElement.id}`);
    },
  });

  return (
    <div>
      <div style={{ height: 50, width: 50, border: "1px solid black" }} {...dragProps}>
        Box
      </div>
      <div style={{ width: 200, height: 300, overflow: "auto" }}>
        <div style={{ height: 2000, width: 3000 }}></div>
        <div style={{ width: 3000, display: "flex", justifyContent: "flex-end" }}>
          <DropWrap
            id="Hidden by scrolls"
            accepted={["x"]}
            style={{ height: "80px", width: "80px", background: "green" }}
          ></DropWrap>
        </div>
      </div>
    </div>
  );
}
export const DragWithScrollContainers: StoryObj = {
  render: DragScrollContainers,
};

function NestedDragScrollersComp() {
  const { dragProps } = useDraggable({
    getItems: () => ({ siteLocalData: { x: 2 } }),
    onDrop: (ev) => {
      alert(`Dropped on ${ev.dropElement.id}`);
    },
  });

  return (
    <div>
      <div style={{ height: 50, width: 50, border: "1px solid black" }} {...dragProps}>
        Box
      </div>
      <div style={{ width: 400, height: 500, overflow: "auto" }}>
        <div style={{ height: 2000, width: 3000 }}></div>
        <div style={{ width: 3000, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 300, height: 300, overflow: "auto" }}>
            <div style={{ height: 3000 }}></div>

            <DropWrap
              id="Hidden by scrolls"
              accepted={["x"]}
              style={{ height: "80px", width: "80px", background: "green" }}
            ></DropWrap>
          </div>
        </div>
      </div>
    </div>
  );
}
export const NestedDragScrollers: StoryObj = {
  render: NestedDragScrollersComp,
};

function DragEventsComp() {
  const [count, setCount] = useState(1);
  const [data, setData] = useState<number | null>(0);

  const [start, setStart] = useState(0);
  const [move, setMove] = useState(0);

  const { dragProps } = useDraggable({
    getItems: () => {
      return {
        siteLocalData: {
          fine: count,
        },
      };
    },
    onDragStart: (ev) => {
      setStart(ev.position.x);
    },
    onDragMove: (ev) => {
      setMove(ev.position.x);
    },
    onDragEnd: () => {
      alert("ended");
    },
    onDrop: () => setCount((prev) => prev + 1),
  });

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div {...dragProps}>Box containing {count}</div>
      <pre>Start: {start}</pre>
      <pre>Move: {move}</pre>

      <DropWrap
        accepted={["fine"]}
        onDrop={(p) => {
          const count = p.state.siteLocalData?.fine;

          setData((prev) => prev + count);
        }}
      >
        Target For Drop: {data}
      </DropWrap>
    </div>
  );
}

export const DragEvents: StoryObj = {
  render: DragEventsComp,
};

function DragPlaceholder() {
  const [count, setCount] = useState(1);
  const [data, setData] = useState<number | null>(0);

  const { dragProps } = useDraggable({
    getItems: () => {
      return {
        siteLocalData: {
          fine: count,
        },
      };
    },
    placeholder: (d) => <div className="dragging">Value: {d.siteLocalData?.fine}</div>,
    placeholderOffset: [20, 20],
    onDrop: () => setCount((prev) => prev + 1),
  });

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div {...dragProps}>Box containing {count}</div>

      <DropWrap
        accepted={["fine"]}
        onDrop={(p) => {
          const count = p.state.siteLocalData?.fine;

          setData((prev) => prev + count);
        }}
      >
        Target For Drop: {data}
      </DropWrap>
    </div>
  );
}

export const Placeholder: StoryObj = {
  render: DragPlaceholder,
};

function ReorderableList() {
  const [letters, setLetters] = useState(["A", "B", "C", "D"]);

  const { dragProps } = useDraggable({
    getItems: (el) => {
      return {
        siteLocalData: {
          letter: el.id,
        },
      };
    },
    placeholder: (d) => <div className="dragging">Value: {d.siteLocalData?.letter}</div>,
    placeholderOffset: [20, 20],
  });

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {letters.map((c) => {
          return <OverWithBars dragProps={dragProps} c={c} key={c} setLetters={setLetters} />;
        })}
      </div>
    </div>
  );
}

function OverWithBars({
  dragProps,
  c,
  setLetters,
}: {
  dragProps: DragProps;
  c: string;
  setLetters: Dispatch<SetStateAction<string[]>>;
}) {
  const [active, setActive] = useState(false);
  const [isTop, setIsTop] = useState(false);
  return (
    <DropWrap
      {...dragProps}
      id={c}
      accepted={["letter"]}
      key={c}
      style={{
        width: 200,
        height: 40,
        background: "gray",
        scale: active ? "1.05" : "1",
        display: "flex",
        flexDirection: "column",
      }}
      onDragMove={(d) => {
        setIsTop(d.topHalf);
      }}
      onEnter={() => setActive(true)}
      onLeave={() => setActive(false)}
      onDragEnd={() => setActive(false)}
      onDrop={(p) => {
        const moving = p.state.siteLocalData?.letter as string;
        setActive(false);
        setIsTop(false);
        if (moving === c) return;

        const isBefore = p.moveState.topHalf;
        setLetters((prev) => {
          const next = prev.filter((l) => l !== moving);
          const target = prev.indexOf(c);

          if (isBefore) next.splice(target, 0, moving);
          else next.splice(target + 1, 0, moving);
          return next;
        });
      }}
    >
      {active && isTop && <div style={{ height: 2, width: "100%", background: "blue" }} />}
      <div style={{ flex: "1" }}>{c}</div>
      {active && !isTop && <div style={{ height: 2, width: "100%", background: "blue" }} />}
    </DropWrap>
  );
}

export const Reorder: StoryObj = {
  render: ReorderableList,
};
