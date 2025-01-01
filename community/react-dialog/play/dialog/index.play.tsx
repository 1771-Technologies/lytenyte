import { useState } from "react";
import { Dialog } from "../../src";

export default function Play() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Dialog Now</button>
      <div style={{ height: "200vh" }} />
      <Dialog open={open} onOpenChange={setOpen}>
        This is my dialog content
        <div>
          <button>I can be focused</button>
        </div>
        <button>Button A</button>
        <button>Button B</button>
      </Dialog>
    </div>
  );
}
