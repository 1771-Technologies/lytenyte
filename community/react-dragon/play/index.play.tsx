import { useDraggable } from "../src/use-draggable";

export default function Drag() {
  const d = useDraggable({ dragData: () => 23, dragTags: () => ["alpha"] });

  return (
    <div>
      <div {...d}>I can be dragged</div>
    </div>
  );
}
