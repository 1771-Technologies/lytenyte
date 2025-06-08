import { useEffect, useState } from "react";
import { hide, show } from "./tooltip-api.js";
import type { Tooltip } from "./+types.js";

export type UseTooltipArgs = Omit<Tooltip, "anchor"> & { open?: boolean };

export function useTooltip(props: UseTooltipArgs) {
  const [el, ref] = useState<HTMLElement | null>(null);
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
          anchor: el,
          ...props,
          onHide,
          onShow,
          showDelay: 0,
          hideDelay: 0,
        });
      } else {
        hide(props.id);
      }
      return;
    }

    const controller = new AbortController();
    el.addEventListener(
      "mouseenter",
      () => {
        show({ anchor: el, ...props, onShow, onHide });
      },
      { signal: controller.signal },
    );

    el.addEventListener(
      "mouseleave",
      () => {
        hide(props.id);
      },
      { signal: controller.signal },
    );

    el.addEventListener("focus", () => {
      show({ anchor: el, ...props, onShow, onHide });
    });
    el.addEventListener("blur", () => {
      hide(props.id);
    });

    return () => controller.abort();
  }, [el, props]);

  return {
    "aria-describedby": open ? props.id : undefined,
    ref,
    tabIndex: 0,
  };
}
