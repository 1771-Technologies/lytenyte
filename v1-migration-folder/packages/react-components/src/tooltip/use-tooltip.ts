import { useEffect, useId, useState } from "react";
import { hide, show } from "./tooltip-api.js";
import type { Tooltip } from "./+types.js";

export function useTooltip(props: Omit<Tooltip, "anchor" | "id"> & { open?: boolean }) {
  const [el, ref] = useState<HTMLElement | null>(null);
  const internalId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!el) return;

    const onShow = () => {
      props.onShow?.();
      setOpen(true);
    };
    const onHide = () => {
      props.onHide?.();
      setOpen(false);
    };

    if (props.open != null) {
      if (props.open) {
        show({
          id: internalId,
          anchor: el,
          ...props,
          onHide,
          onShow,
          showDelay: 0,
          hideDelay: 0,
        });
      } else {
        hide(internalId);
      }
      return;
    }

    const controller = new AbortController();
    el.addEventListener(
      "mouseenter",
      () => {
        show({
          id: internalId,
          anchor: el,
          ...props,
          onShow,
          onHide,
        });
      },
      { signal: controller.signal },
    );

    el.addEventListener(
      "mouseleave",
      () => {
        hide(internalId);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [el, internalId, props]);

  return { "aria-describedby": internalId, "aria-haspopup": true, "aria-expanded": open, ref };
}
