import { useAtomValue } from "@1771technologies/atom";
import { Portal } from "../portal/portal.js";
import { Positioner } from "../positioner/positioner.js";
import { visibleTooltips } from "./+state.js";
import type { JSX } from "react";
import { hide, show } from "./tooltip-api.js";

export function TooltipDriver() {
  const tooltipsToDisplay = useAtomValue(visibleTooltips);

  return (
    <>
      {tooltipsToDisplay.map((c) => {
        const props: JSX.IntrinsicElements["div"] = {
          id: c.id,
          role: "tooltip",
          onMouseEnter: () => c.interactive && show(c),
          onMouseLeave: () => c.interactive && hide(c.id),
        };

        const Render = typeof c.render === "function" ? <c.render {...props} /> : c.render;
        return (
          <Portal key={c.id} target={c.root ?? document.body}>
            <Positioner {...c.position} anchor={c.anchor} {...props}>
              {Render}
            </Positioner>
          </Portal>
        );
      })}
    </>
  );
}
