import { useState } from "react";
import { useDraggable, useDroppable } from "../src";
import { clsx } from "@1771technologies/js-utils";

export default function List() {
  return (
    <>
      <h1>List Dragging</h1>
      <div
        className={css`
          display: grid;
          gap: 4px;
        `}
      >
        <div>
          <ItemAdder />
        </div>

        <div></div>
        <div
          className={css`
            display: flex;
            flex-direction: column;
            gap: 20px;
          `}
        >
          <Dropper tags={["odd"]} />
          <Dropper tags={["even"]} />
        </div>
      </div>
    </>
  );
}

function ItemAdder() {
  const [count, setCount] = useState(0);

  const draggable = useDraggable({
    dragData: () => count,
    dragTags: () => (count % 2 === 1 ? ["odd"] : ["even"]),
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

function Dropper({ tags }: { tags: string[] }) {
  const [items, setItems] = useState<number[]>([]);

  const { isOver, canDrop, onDragOver, onDrop } = useDroppable({
    tags,
    onDrop: ({ getData }) => {
      const c = getData() as number;
      setItems((prev) => [...prev, c]);
    },
  });

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-testid={`drop-${tags.join("")}`}
      className={clsx(
        css`
          width: 200px;
          height: 200px;
          border: 1px solid green;
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
      {items.map((d) => {
        return <div key={d}>{d}</div>;
      })}
    </div>
  );
}
