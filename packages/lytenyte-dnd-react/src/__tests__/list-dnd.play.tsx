import { useRef, useState } from "react";
import { useDraggable } from "../use-draggable.js";
import { useMoveFlip } from "../list/use-move-flip.js";
import { useDroppable } from "../use-droppable.js";
import { useCombinedRefs } from "../hooks/use-combined-refs.js";
import { arrayMove } from "../list/move-item.js";

export default function ListDnd() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  return (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <div>
        <button
          onClick={() => {
            setItems((prev) => {
              return [...prev].sort(() => Math.random() * 10 - Math.random() * 10);
            });
          }}
        >
          Shuffle
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {items.map((x, i) => {
          return (
            <ListItem
              key={x}
              data={{ index: x, value: i }}
              position={i}
              onDragEnter={(n) => {
                if (i === n) return;

                const isBefore = i < n;
                const to = i + (isBefore ? 0 : 0);
                setItems((prev) => {
                  return arrayMove(prev, n, to);
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function ListItem({
  data,
  position,
  onDragEnter,
}: {
  position: number;
  data: { index: number; value: any };
  onDragEnter: (i: number) => void;
}) {
  const [el, setElement] = useState<HTMLElement | null>(null);
  const { props, isDragActive } = useDraggable({
    data: { list: { kind: "site", data } },
  });

  const positionRef = useRef(position);
  positionRef.current = position;

  const { attrs, eventHandlers, ref } = useDroppable({
    accepted: ["list"],
    onEnter: () => {
      onDragEnter(positionRef.current as number);
    },
    active: !isDragActive,
  });

  useMoveFlip(el, position);
  const r = useCombinedRefs(ref, setElement);

  return (
    <div
      ref={r}
      style={{
        border: "1px solid gray",
        padding: "8px",
        borderRadius: "8px",
        background: "black",
        color: "white",
        opacity: isDragActive ? 0.7 : 1,
      }}
      {...props}
      {...eventHandlers}
      {...attrs}
    >
      Item At {data.index}
    </div>
  );
}
