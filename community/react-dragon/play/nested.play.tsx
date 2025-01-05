import { useState, type PropsWithChildren } from "react";
import { useDraggable, useDroppable } from "../src";
import { clsx } from "@1771technologies/js-utils";

export default function NestedPlay() {
  return (
    <div>
      <h1>Nested drag test</h1>
      <ItemAdder />

      <div
        className={css`
          padding: 20px;
          display: flex;
          justify-content: space-between;
        `}
      >
        <Dropper tags={["any"]}>
          <Dropper tags={["even"]}>
            <Dropper tags={["odd"]}></Dropper>
          </Dropper>
        </Dropper>
      </div>
    </div>
  );
}

function ItemAdder() {
  const [count, setCount] = useState(0);

  const draggable = useDraggable({
    dragData: () => count,
    dragTags: () => {
      const tags = count % 2 === 1 ? ["odd"] : ["even"];
      tags.push("any");

      return tags;
    },
    disabled: count > 10,
    onDragCancel: () => setCount((prev) => Math.max(prev - 1, 0)),
    onDragEnd: () => setCount((prev) => prev + 1),
    placeholder: () => (
      <div
        className={css`
          background-color: green;
          width: 100px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        Moving: {count}
      </div>
    ),
  });

  return (
    <div
      className={css`
        padding: 20px;
        border: 1px solid black;
      `}
    >
      <div
        {...draggable}
        data-testid="drag-handle"
        className={css`
          display: inline-block;
          padding: 8px;
          background-color: green;
          margin: 2px;
        `}
      >
        H
      </div>
      {count}
    </div>
  );
}

function Dropper({ children, tags }: PropsWithChildren<{ tags: string[] }>) {
  const [count, setCount] = useState<number[]>([]);

  const { isOver, canDrop, ...props } = useDroppable({
    tags,
    onDrop: (p) => setCount((prev) => [...prev, p.getData() as number]),
  });

  return (
    <div
      {...props}
      data-testid={`drop-${tags.join("")}`}
      className={clsx(
        css`
          padding: 50px;
          border: 1px solid grey;
          background-color: white;
        `,
        isOver &&
          canDrop &&
          css`
            background-color: lightblue;
          `,
        isOver &&
          !canDrop &&
          css`
            background-color: lightcoral;
          `,
      )}
    >
      <div
        className={css`
          height: 20px;
        `}
      >
        I have {JSON.stringify(count)}
      </div>
      <div>{children}</div>
    </div>
  );
}
