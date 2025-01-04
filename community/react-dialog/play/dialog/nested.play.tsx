import { useState } from "react";
import { Dialog } from "../../src/index.js";

export default function Nested() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      <div style={{ height: "200vh" }} />
      <Dialog open={open} onOpenChange={setOpen}>
        This is my dialog content
        <div>
          <button>I can be focused</button>
        </div>
        <input />
        <button onClick={() => setOpen2(true)}>Open second</button>
        <Dialog open={open2} onOpenChange={setOpen2}>
          This is a nest dialog. <input />
        </Dialog>
      </Dialog>
    </div>
  );
}
