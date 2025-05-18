import { useState } from "react";
import { useDraggable } from "../src/use-draggable";
import { useDroppable } from "../src/use-droppable";

void css`
  :global() {
    pre {
      margin: 0px;
    }
  }
`;

export default function Drag() {
  const [y, setY] = useState(0);
  const [x, setX] = useState(0);

  const d = useDraggable({
    dragData: () => 23,
    dragTags: () => ["alpha"],

    placeholder: () => (
      <div
        className={css`
          background-color: blue;
          color: white;
          padding: 2px;
        `}
      >
        I am dragging
      </div>
    ),
    onDragMove: ({ clientX, clientY }) => {
      setX(clientX);
      setY(clientY);
    },
    onDragEnd: () => {
      setX(0);
      setY(0);
    },
    onDragCancel: () => {
      setX(-1);
      setY(-1);
    },
  });

  const { isOver, onDragOver, onDrop } = useDroppable({ tags: ["alpha"] });

  return (
    <div>
      <div>
        <pre>X: {x}</pre>
        <pre>Y: {y}</pre>
      </div>
      <div
        className={css`
          padding: 20px;
          border: 1px solid black;
        `}
        {...d}
      >
        I can be dragged
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={
          css`
            width: 200px;
            height: 200px;
            border: 1px solid red;
            position: relative;
            top: 200px;
          ` +
          (isOver
            ? " " +
              css`
                background-color: green;
              `
            : "")
        }
      >
        I am a box
      </div>
    </div>
  );
}
