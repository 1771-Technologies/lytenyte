import { forwardRef } from "react";
import { Popover } from "../headless/popover/index.js";
import { useSmartSelect } from "./context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";

function SmartSelectContainerBase(
  props: Popover.Component.Container,
  ref: Popover.Component.Container["ref"],
) {
  const { setContainer } = useSmartSelect();

  const combined = useCombinedRefs(ref, setContainer);

  return (
    <Popover.Container
      {...props}
      onClick={(e) => {
        e.preventDefault();
      }}
      ref={combined}
      data-ln-smart-select-container
    />
  );
}

export const SmartSelectContainer = forwardRef(SmartSelectContainerBase);
