import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useMenuRadioGroup } from "./contexts/context-radio-group.js";
import { useDepth } from "./contexts/context-depth.js";
import { getMenuIds } from "./utils/get-menu-ids.js";
import { useMenuRoot } from "./contexts/context-menu-root.js";

export interface MenuRadioItemState {
  readonly checked: boolean;
}

export interface MenuRadioItemProps {
  readonly as?: SlotComponent<MenuRadioItemState>;
  readonly value: any;
}

export const MenuRadioItem = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MenuRadioItemProps
>(function MenuRadioItem({ as, value, ...props }, forwarded) {
  const radioCtx = useMenuRadioGroup();
  const ctx = useMenuRoot();

  const isOn = radioCtx.value !== undefined && value === radioCtx.value;

  const internalProps: JSX.IntrinsicElements["div"] = {
    role: "menuitemradio",
    "aria-checked": isOn,
    tabIndex: -1,
    onClick: () => radioCtx.onChange(value),
    onKeyDown: (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      if (ev.key === "Enter" || ev.key === " ") radioCtx.onChange(value);
    },

    onMouseEnter: (ev) => {
      const ids = getMenuIds(ev.currentTarget);

      ev.currentTarget.focus();
      ctx.setActiveIds(ids);
    },
  };

  const depth = useDepth();
  const slot = useSlot({
    props: [
      internalProps,
      props,
      {
        "data-ln-menu-item": true,
        "data-ln-depth": depth,
        "data-ln-selected": isOn,
      },
    ],
    ref: forwarded,
    slot: as ?? <div />,
    state: { checked: isOn },
  });

  return slot;
});
