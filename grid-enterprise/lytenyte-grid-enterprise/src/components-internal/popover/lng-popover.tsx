import "./lng-popover.css";
import { clsx } from "@1771technologies/js-utils";
import { Popover } from "@1771technologies/react-popover";

export const LngPopover: typeof Popover = (props) => {
  return <Popover {...props} className={clsx("lng1771-popover", props.className)} />;
};
