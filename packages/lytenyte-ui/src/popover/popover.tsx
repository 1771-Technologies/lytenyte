import { forwardRef, useState, type ReactNode, type Ref } from "react";

export const Popover = forwardRef((props: Popover.Props, ref: Popover.Props["ref"]) => {
  const [] = useState;

  return <></>;
});

export namespace Popover {
  export interface State {
    readonly open: boolean;
    readonly toggle: (state?: boolean) => void;
  }

  export interface Props {
    readonly open?: boolean;
    readonly onOpenChange?: (change: boolean) => void;

    readonly ref?: Ref<State>;

    readonly children?: ReactNode | ((props: State) => ReactNode);
  }
}
