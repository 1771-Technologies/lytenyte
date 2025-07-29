import { useState } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useDraggable } from "../use-draggable.js";
import { DropWrap } from "../drop-wrap/drop-wrap.js";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import { dragHandler } from "./drag-utils.js";
import { resetDragState } from "../utils/reset-drag-state.js";

const wait = (n?: number) => new Promise((res) => setTimeout(res, n ?? 20));

describe("drag", () => {
  beforeEach(async () => {
    resetDragState();
    await wait();
  });
  test("should be able to perform a basic drag", async () => {
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
          <div id="x" {...dragProps}>
            Box containing {count}
          </div>

          <DropWrap
            id="b"
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

    const screen = render(<DropItemComp />);

    const draggable = screen.getByText("Box containing 1");

    await expect.element(draggable).toBeVisible();

    await userEvent.dragAndDrop(draggable, screen.getByText("Target For Drop: 0"));
    await wait(80);
    const lo = document.querySelector('[data-ln-drop-zone="true"]');
    expect(lo?.textContent).toEqual("Target For Drop: 1");
  });

  test("should be able to perform a basic drag with touch", async () => {
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
          <div id="x" {...dragProps}>
            Box containing {count}
          </div>

          <DropWrap
            id="b"
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

    const screen = render(<DropItemComp />);

    const draggable = screen.getByText("Box containing 1");
    const el = draggable.element();
    dragHandler.touchstart(el);
    await wait(300);

    const dropLocator = screen.getByText("Target For Drop: 0");
    const dropEl = dropLocator.element();
    const bb = dropEl.getBoundingClientRect();
    dragHandler.touchmove(dropEl, { x: bb.x + 2, y: bb.y + 2 });
    await wait();
    dragHandler.touchmove(dropEl, { x: 0, y: 0 });
    await wait();
    dragHandler.touchmove(dropEl, { x: bb.x + 2, y: bb.y + 2 });
    await wait();
    dragHandler.touchend(el, { x: bb.x + 2, y: bb.y + 2 });

    await wait(80);
    const lo = document.querySelector('[data-ln-drop-zone="true"]');
    expect(lo?.textContent).toEqual("Target For Drop: 1");
  });

  test("should be able to perform a basic drag with touch that is then cancelled", async () => {
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
        placeholder: () => <div>Run</div>,
        onDrop: () => setCount((prev) => prev + 1),
      });

      return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div id="x" {...dragProps}>
            Box containing {count}
          </div>

          <DropWrap
            id="b"
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

    const screen = render(<DropItemComp />);

    const draggable = screen.getByText("Box containing 1");
    const el = draggable.element();
    dragHandler.touchstart(el);
    await wait(300);

    const dropLocator = screen.getByText("Target For Drop: 0");
    const dropEl = dropLocator.element();
    const bb = dropEl.getBoundingClientRect();
    dragHandler.touchmove(dropEl, { x: bb.x + 2, y: bb.y + 2 });
    await wait();
    dragHandler.touchmove(dropEl, { x: 0, y: 0 });
    await wait();
    dragHandler.touchmove(dropEl, { x: bb.x + 2, y: bb.y + 2 });
    await wait();
    dragHandler.touchcancel(el, { x: bb.x + 2, y: bb.y + 2 });
  });

  test("should be able to handle nested dragging with placeholder and data transfer", async () => {
    function DropItemComp() {
      const [count, setCount] = useState(1);
      const [data, setData] = useState("0");

      const { dragProps } = useDraggable({
        getItems: () => {
          return {
            dataTransfer: {
              fine: "1",
            },
          };
        },
        placeholder: () => <div>Run</div>,
        onDrop: () => setCount((prev) => prev + 1),
      });

      return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div id="x" {...dragProps}>
            Box containing {count}
          </div>

          <DropWrap
            id="b"
            accepted={["fine"]}
            onDrop={(p) => {
              const count = p.state.dataTransfer?.fine;

              setData(count!);
            }}
          >
            Target For Drop: {data}
          </DropWrap>
        </div>
      );
    }

    const screen = render(<DropItemComp />);

    const draggable = screen.getByText("Box containing 1");

    await expect.element(draggable).toBeVisible();

    await userEvent.dragAndDrop(draggable, screen.getByText("Target For Drop: 0"));
    await expect.element(screen.getByText("Target For Drop: 1")).toBeVisible();
  });

  test("should be able to drag to an item then leave that the item", async () => {
    const start = vi.fn();
    const end = vi.fn();
    const move = vi.fn();
    const drop = vi.fn();
    function DropItemComp() {
      const [hovered, setHovered] = useState(false);

      const { dragProps } = useDraggable({
        getItems: () => {
          return {
            dataTransfer: {
              fine: "1",
            },
          };
        },
        onDragStart: start,
        onDragEnd: end,
        onDragMove: move,
        onDrop: drop,
        placeholder: () => <div>Run</div>,
        placeholderOffset: [0, 0],
      });

      return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div id="x" {...dragProps}>
            Box containing nothing
          </div>

          <DropWrap
            id="b"
            accepted={["fine"]}
            onLeave={() => {
              setHovered(false);
            }}
            onEnter={() => {
              setHovered(true);
            }}
          >
            Target For Drop {hovered ? "Yes" : "No"}
          </DropWrap>
        </div>
      );
    }

    const screen = render(<DropItemComp />);

    const draggable = screen.getByText("Box containing nothing");
    await expect.element(draggable).toBeVisible();
    const dragEl = draggable.element();

    dragHandler.start(dragEl);

    const dropZone = screen.getByText("Target For Drop No");
    const dropEl = dropZone.element();

    dragHandler.enter(dropEl);

    await expect.element(screen.getByText("Target For Drop Yes")).toBeVisible();
    dragHandler.leave(dropEl);
    await expect.element(screen.getByText("Target For Drop No")).toBeVisible();

    dragHandler.move(dragEl, { x: 10, y: 10 });
    await wait();
    dragHandler.move(dragEl, { x: 10, y: 10 });
    await wait();
    dragHandler.move(dragEl, { x: 10, y: 10 });
    await wait();
    dragHandler.move(dragEl, { x: 15, y: 15 });
    await wait();
    dragHandler.move(dragEl, { x: 20, y: 20 });
    await wait();

    await expect.element(screen.getByText("Run")).toBeVisible();

    dragHandler.over(dropEl);
    await wait();
    dragHandler.drop(dropEl);
    await wait();
    dragHandler.end(dropEl);
    await wait();

    expect(start).toHaveBeenCalledOnce();
    expect(end).toHaveBeenCalledOnce();
  });

  test("should be able to drag to an item with touch", async () => {
    const start = vi.fn();
    const end = vi.fn();
    const move = vi.fn();
    const drop = vi.fn();
    function DropItemComp() {
      const [hovered, setHovered] = useState(false);

      const { dragProps } = useDraggable({
        getItems: () => {
          return {
            dataTransfer: {
              fine: "1",
            },
          };
        },
        onDragStart: start,
        onDragEnd: end,
        onDragMove: move,
        onDrop: drop,
        placeholder: () => <div>Run</div>,
        placeholderOffset: [0, 0],
      });

      return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div id="x" {...dragProps}>
            Box containing nothing
          </div>

          <DropWrap
            id="b"
            accepted={["fine"]}
            onLeave={() => {
              setHovered(false);
            }}
            onEnter={() => {
              setHovered(true);
            }}
          >
            Target For Drop {hovered ? "Yes" : "No"}
          </DropWrap>
        </div>
      );
    }

    const screen = render(<DropItemComp />);

    const draggable = screen.getByText("Box containing nothing");
    await expect.element(draggable).toBeVisible();
    const dragEl = draggable.element();

    dragHandler.touchstart(dragEl);
    await wait(400);

    dragHandler.touchmove(dragEl, { x: 10, y: 10 });
    await wait();
    dragHandler.touchmove(dragEl, { x: 15, y: 15 });
    await wait();
    dragHandler.touchmove(dragEl, { x: 20, y: 20 });
    await wait();

    await expect.element(screen.getByText("Run")).toBeVisible();

    dragHandler.touchend(dragEl);
  });

  test("should handle keyboard interactions", async () => {
    const c = render(<DragWithKeyboard />);

    const btn = c.getByText("I drag");
    await expect.element(btn).toBeVisible();
    (btn.element() as HTMLElement).focus();
    await expect.element(btn).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await wait(20);
    await userEvent.keyboard("{ArrowRight}");
    await wait(20);
    await userEvent.keyboard("{Enter}");
    await expect.element(c.getByText("Dropzone X: 1")).toBeVisible();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{Enter}");
    await expect.element(c.getByText("Dropzone Z: 0")).toBeVisible();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{Escape}");
    await expect.element(c.getByText("Dropzone Z: 0")).toBeVisible();
    await userEvent.keyboard("{Meta>}{Enter}{/Meta}");
    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Meta>}{ArrowRight}{/Meta}");
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Enter}");

    (btn.element() as HTMLElement).blur();
    await expect.element(btn).not.toHaveFocus();
  });
});

function DragWithKeyboard() {
  const { dragProps } = useDraggable({
    getItems: (el) => {
      return {
        siteLocalData: {
          fine: el.id,
        },
      };
    },
    placeholder: (d) => <div className="dragging">Value: {d.siteLocalData?.letter}</div>,
    placeholderOffset: [20, 20],
  });

  const [dropX, setDropX] = useState(0);
  const [dropY, setDropY] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "90vh",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div {...dragProps}>I drag</div>
      </div>
      <div style={{ margin: 40, display: "flex", justifyContent: "space-between" }}>
        <DropWrap
          accepted={["fine"]}
          style={{ width: 200, height: 200, background: "gray" }}
          onDrop={() => setDropX((prev) => prev + 1)}
        >
          Dropzone X: {dropX}
        </DropWrap>
        <DropWrap
          accepted={["fine"]}
          style={{ width: 200, height: 200, background: "gray" }}
          onDrop={() => setDropY((prev) => prev + 1)}
        >
          Dropzone Y: {dropY}
        </DropWrap>
        <DropWrap accepted={["blue"]} style={{ width: 200, height: 200, background: "gray" }}>
          Dropzone Z: 0
        </DropWrap>
      </div>
      <div style={{ minHeight: 4000, width: 100 }} />
      <div style={{ margin: 40, display: "flex", justifyContent: "space-between" }}>
        <DropWrap
          accepted={["fine"]}
          style={{ width: 200, height: 200, background: "gray" }}
          onDrop={() => setDropX((prev) => prev + 1)}
        >
          Dropzone T: {dropX}
        </DropWrap>
        <DropWrap
          accepted={["fine"]}
          style={{ width: 200, height: 200, background: "gray" }}
          onDrop={() => setDropY((prev) => prev + 1)}
        >
          Dropzone V: {dropY}
        </DropWrap>
        <DropWrap accepted={["blue"]} style={{ width: 200, height: 200, background: "gray" }}>
          Dropzone G: 0
        </DropWrap>
      </div>
    </div>
  );
}
