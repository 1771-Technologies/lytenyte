import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, useId, useMemo, useState, type JSX } from "react";
import { MenuIdProvider } from "./contexts/context-id.js";
import { SubmenuProvider } from "./contexts/context-submenu.js";

export interface MenuSubmenuRootProps {
  readonly as?: SlotComponent;
}

export const MenuSubmenuRoot = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MenuSubmenuRootProps
>(function MenuSubMenuRoot({ as, ...props }, forwarded) {
  const id = useId();

  const slot = useSlot({
    props: [props, { "data-ln-menu-submenu-root": true, role: "none" }],
    ref: forwarded,
    slot: as ?? <div />,
  });

  const [trigger, setTrigger] = useState<HTMLElement | null>(null);

  return (
    <SubmenuProvider value={useMemo(() => ({ trigger, setTrigger }), [trigger])}>
      <MenuIdProvider value={id}>{slot}</MenuIdProvider>
    </SubmenuProvider>
  );
});
