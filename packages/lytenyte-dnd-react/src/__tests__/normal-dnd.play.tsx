import { useDraggable } from "../use-draggable.js";
import { useDroppable } from "../use-droppable.js";

export default function NormalDndPlay() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Draggable />
      <Droppable />
    </div>
  );
}

function Draggable() {
  const { props } = useDraggable({
    data: {
      x: { kind: "site", data: "alpha" },
    },
  });

  return (
    <div style={{ width: "200px", height: "100px", border: "1px solid black" }} {...props}>
      I can Be Dragged
    </div>
  );
}

function Droppable() {
  const { attrs, eventHandlers, ref, canDrop } = useDroppable({
    accepted: ["x"],
    onDrop: (p) => {
      alert(JSON.stringify(p.data));
    },
  });

  return (
    <div
      style={{ width: "200px", height: "200px", background: canDrop ? "blue" : "green" }}
      ref={ref}
      {...eventHandlers}
      {...attrs}
    >
      I can be dropped on
    </div>
  );
}
