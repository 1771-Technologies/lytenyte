import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useDepth } from "./contexts/context-depth.js";
import { getMenuIds } from "./utils/get-menu-ids.js";
import { useMenuRoot } from "./contexts/context-menu-root.js";

export interface MenuCheckboxItemState {
  readonly checked: boolean;
}

export interface MenuCheckboxItemProps {
  readonly as?: SlotComponent<MenuCheckboxItemState>;
  readonly checked: boolean;
  readonly onCheckChange: (v: boolean) => void;
}

export const MenuCheckboxItem = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MenuCheckboxItemProps
>(function MenuCheckboxItem({ as, checked, onCheckChange, ...props }, forwarded) {
  const ctx = useMenuRoot();

  const internalProps: JSX.IntrinsicElements["div"] = {
    role: "menuitemcheckbox",
    "aria-checked": checked,
    tabIndex: -1,

    onMouseEnter: (ev) => {
      const ids = getMenuIds(ev.currentTarget);

      ev.currentTarget.focus();
      ctx.setActiveIds(ids);
    },
    onClick: () => onCheckChange(!checked),
    onKeyDown: (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      if (ev.key === "Enter" || ev.key === " ") onCheckChange(!checked);
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
        "data-ln-selected": checked,
      },
    ],
    ref: forwarded,
    slot: as ?? <div />,
    state: {
      checked,
    },
  });

  return slot;
});
