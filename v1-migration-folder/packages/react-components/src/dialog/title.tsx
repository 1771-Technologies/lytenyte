import { useIsoEffect, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import type { OpenState } from "./use-transition-effect";
import { forwardRef, useId, type JSX } from "react";
import { useDialog } from "./root.use-dialog";

export interface DialogTitleProps {
  readonly slot?: SlotComponent<OpenState>;
}

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  JSX.IntrinsicElements["h2"] & DialogTitleProps
>(function DialogTitle({ slot, ...props }, forwarded) {
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
    slot: slot ?? <h2 />,
    state,
  });

  return render;
});
