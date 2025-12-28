import { forwardRef, useState, type JSX } from "react";
import { useCombinedRefs } from "../../../hooks/use-combined-ref.js";
import { useMenuItemEvents } from "../item/use-menu-item-events.js";
import { comboContext } from "./combo-context.js";

function ComboMenuImpl(props: ComboMenu.Props, ref: ComboMenu.Props["ref"]) {
  const [item, setItem] = useState<HTMLDivElement | null>(null);

  const combinedRefs = useCombinedRefs(ref, setItem);

  const [active] = useMenuItemEvents(item, undefined, () => {
    const input = item?.querySelector('[data-ln-combomenu-input="true"]') as HTMLElement;
    if (input) input.blur();
  });

  const [activeEl, setActiveEl] = useState<HTMLDivElement | null>(null);

  return (
    <comboContext.Provider value={{ activeEl, setActiveEl, menu: item }}>
      <div
        role="menuitem"
        {...props}
        ref={combinedRefs}
        tabIndex={0}
        data-ln-menu-item
        data-ln-combo
        data-ln-active={active}
        onFocus={(ev) => {
          props.onFocus?.(ev);
          if (ev.isPropagationStopped()) return;

          const input = ev.currentTarget.querySelector('[data-ln-combomenu-input="true"]') as HTMLElement;
          if (input) input.focus();
        }}
      />
    </comboContext.Provider>
  );
}

export const ComboMenu = forwardRef(ComboMenuImpl);

export namespace ComboMenu {
  export type Props = JSX.IntrinsicElements["div"];
}
