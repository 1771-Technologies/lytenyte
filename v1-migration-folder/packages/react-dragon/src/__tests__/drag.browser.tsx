import { useState } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useDraggable } from "../use-draggable";
import { DropWrap } from "../drop-wrap/drop-wrap";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import { dragHandler } from "./drag-utils";
import { resetDragState } from "../utils/reset-drag-state";

const wait = (n?: number) => new Promise((res) => setTimeout(res, n ?? 20));

describe("drag", () => {
  beforeEach(() => {
    resetDragState();
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
    await expect.element(screen.getByText("Target For Drop: 1")).toBeVisible();
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
    await expect.element(screen.getByText("Target For Drop: 1")).toBeVisible();
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
});
