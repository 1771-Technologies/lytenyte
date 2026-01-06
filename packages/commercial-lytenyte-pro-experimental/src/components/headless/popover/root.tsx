import type { PropsWithChildren } from "react";
import { useMemo, useState } from "react";
import { DialogRoot } from "../dialog/root.js";
import { PopoverContext } from "./context.js";

export function PopoverRoot(props: PropsWithChildren<PopoverRoot.Props>) {
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);

  return (
    <PopoverContext.Provider value={useMemo(() => ({ setTrigger }), [])}>
      <DialogRoot {...props} anchor={props.anchor ?? trigger} />
    </PopoverContext.Provider>
  );
}

export namespace PopoverRoot {
  export type Props = DialogRoot.Props;
}
