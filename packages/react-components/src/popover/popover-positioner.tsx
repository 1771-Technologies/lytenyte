import { useDialog } from "../dialog/root.use-dialog.js";
import { Positioner, type PositionerProps } from "../positioner/positioner.js";

export function PopoverPositioner(props: PositionerProps) {
  const ctx = useDialog();

  return <Positioner {...props} anchor={props.anchor ?? ctx.trigger} />;
}
