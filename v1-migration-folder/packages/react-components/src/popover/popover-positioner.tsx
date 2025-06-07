import { useDialog } from "../dialog/root.use-dialog";
import { Positioner, type PositionerProps } from "../positioner/positioner";

export function PopoverPositioner(props: PositionerProps) {
  const ctx = useDialog();

  return <Positioner {...props} anchor={props.anchor ?? ctx.trigger} />;
}
