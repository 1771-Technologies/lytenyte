import { forwardRef } from "react";
import { useCombinedRefs } from "../../hooks/use-combined-ref.js";
import { DialogTrigger } from "../dialog/trigger.js";
import { usePopoverContext } from "./context.js";

export const PopoverTriggerBase = (props: DialogTrigger.Props, ref: DialogTrigger.Props["ref"]) => {
  const { setTrigger } = usePopoverContext();
  const combined = useCombinedRefs(ref, setTrigger);

  return <DialogTrigger {...props} ref={combined} />;
};

export const PopoverTrigger = forwardRef(PopoverTriggerBase);

export namespace PopoverTrigger {
  export type Props = DialogTrigger.Props;
  export type State = DialogTrigger.State;
}
