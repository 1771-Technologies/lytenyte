import { useState } from "react";
import { Popover, type PopoverTarget } from "../src/popover";

export default function Play() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<PopoverTarget>(null);

  return (
    <div>
      <button
        onClick={(e) => {
          setTarget(e.target as HTMLElement);
          setOpen(true);
        }}
      >
        Show Popover
      </button>
      <Popover open={open} onOpenChange={setOpen} popoverTarget={target}>
        This is the popover content
      </Popover>
    </div>
  );
}
