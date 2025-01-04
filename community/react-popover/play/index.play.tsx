import { useState } from "react";
import { Popover, type PopoverTarget } from "../src/popover";
import type { Placement } from "@1771technologies/positioner";

export default function Play() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<PopoverTarget>(null);
  const [placement, setPlacement] = useState<Placement>("left-start");
  const [rtl, setRtl] = useState(false);

  return (
    <>
      <button onClick={() => setRtl(!rtl)}>Rtl {rtl ? "on" : "off"}</button>
      <select value={placement} onChange={(e) => setPlacement(e.target.value as Placement)}>
        <option value={"left-start"}>left-start</option>
        <option value={"left"}>left</option>
        <option value={"left-end"}>left-end</option>

        <option value={"right-start"}>right-start</option>
        <option value={"right"}>right</option>
        <option value={"right-end"}>right-end</option>

        <option value={"bottom-start"}>bottom-start</option>
        <option value={"bottom"}>bottom</option>
        <option value={"bottom-end"}>bottom-end</option>

        <option value={"top-start"}>top-start</option>
        <option value={"top"}>top</option>
        <option value={"top-end"}>top-end</option>
      </select>
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
          width: 500px;
          height: 500px;
        `}
      >
        <button
          onClick={(e) => {
            setTarget(e.target as HTMLElement);
            setOpen(true);
          }}
        >
          Show Popover
        </button>
        <Popover
          open={open}
          onOpenChange={setOpen}
          popoverTarget={target}
          placement={placement}
          rtl={rtl}
        >
          This is the popover content
        </Popover>
      </div>
    </>
  );
}
