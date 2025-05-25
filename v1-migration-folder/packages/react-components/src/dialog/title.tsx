import { useIsoEffect, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import type { OpenState } from "./use-transition-effect.js";
import { forwardRef, useId, type JSX } from "react";
import { useDialog } from "./root.use-dialog.js";

export interface DialogTitleProps {
  readonly as?: SlotComponent<OpenState>;
}

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  JSX.IntrinsicElements["h2"] & DialogTitleProps
>(function DialogTitle({ as, ...props }, forwarded) {
  const { setTitleId, state } = useDialog();
  const internalId = useId();
  const id = props.id;

  useIsoEffect(() => {
    setTitleId(id ?? internalId);

    return () => {
      setTitleId(undefined);
    };
  }, [id, setTitleId]);

  const render = useSlot({
    props: [props, { id: id ?? internalId }],
    ref: forwarded,
    slot: as ?? <h2 />,
    state,
  });

  return render;
});
