import { useIsoEffect, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import type { OpenState } from "./use-transition-effect";
import { forwardRef, useId, type JSX } from "react";
import { useDialog } from "./root.use-dialog";

export interface DialogDescriptionProps {
  readonly as?: SlotComponent<OpenState>;
}

export const DialogDescription = forwardRef<
  HTMLHeadingElement,
  JSX.IntrinsicElements["h2"] & DialogDescriptionProps
>(function DialogDescription({ as, ...props }, forwarded) {
  const { setDescriptionId, state } = useDialog();
  const internalId = useId();
  const id = props.id;

  useIsoEffect(() => {
    setDescriptionId(id ?? internalId);

    return () => {
      setDescriptionId(undefined);
    };
  }, [id, setDescriptionId]);

  const render = useSlot({
    props: [props, { id: id ?? internalId }],
    ref: forwarded,
    slot: as ?? <p />,
    state,
  });

  return render;
});
