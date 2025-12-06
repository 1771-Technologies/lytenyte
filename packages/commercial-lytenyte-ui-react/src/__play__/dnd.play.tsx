import "../design/ui.css";
import { useState } from "react";
import { DragList } from "../components/drag-list/index.js";

/*
- Allow multiple rows under the same group.
- Allow external drag sources
- Allow separate orientations per row
- Keyboard navigation (based on orientation)
- Keyboard select and move (space to select, then space to drop)
- FLIP animations
*/

export default function Dnd() {
  const [items, setItems] = useState(() => ["Alpha", "Beta", "Sigma"].map((x) => ({ id: x })));
  return (
    <div className="ln-light">
      <DragList.Root items={items} onItemsChange={setItems}>
        <DragList.Row>
          {(x: { id: string }) => {
            return <div data-ln-pill>{x.id}</div>;
          }}
        </DragList.Row>
      </DragList.Root>
      <DragList.Root items={items} onItemsChange={setItems}>
        <DragList.Row>
          {(x: { id: string }) => {
            return <div data-ln-pill="column">{x.id}</div>;
          }}
        </DragList.Row>
      </DragList.Root>
      <DragList.Root items={items} onItemsChange={setItems}>
        <DragList.Row>
          {(x: { id: string }) => {
            return <div data-ln-pill="column-pivot">{x.id}</div>;
          }}
        </DragList.Row>
      </DragList.Root>
      <DragList.Root items={items} onItemsChange={setItems}>
        <DragList.Row>
          {(x: { id: string }) => {
            return <div data-ln-pill="row-pivot">{x.id}</div>;
          }}
        </DragList.Row>
      </DragList.Root>
      <div style={{ height: "1px", background: "black", marginBlock: 20 }} />
      <DragList.Root items={items} onItemsChange={setItems} orientation="vertical">
        <DragList.Row />
      </DragList.Root>
    </div>
  );
}
