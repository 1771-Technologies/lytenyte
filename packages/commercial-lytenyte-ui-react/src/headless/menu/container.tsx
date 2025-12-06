import { forwardRef, useState, type JSX } from "react";
import { useMenu } from "./use-menu.js";
import { useSubmenuContext } from "./submenu/submenu-context.js";
import { useCombinedRefs } from "../../hooks/use-combined-ref.js";

function ContainerImpl(props: Container.Props, ref: Container.Props["ref"]) {
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null);
  const combinedRefs = useCombinedRefs(ref, setMenuEl);

  const sub = useSubmenuContext();

  const finalRefs = useCombinedRefs(combinedRefs, sub?.submenuRef);
  useMenu(menuEl);

  if (sub && !sub.open) return null;

  return (
    <div
      {...props}
      role="menu"
      ref={finalRefs}
      data-ln-terminal-menu={!sub}
      data-ln-submenu={sub ? true : undefined}
      data-ln-menu
      style={{
        ...props.style,
        ...(sub ? { position: "absolute" } : {}),
      }}
    />
  );
}

export const Container = forwardRef(ContainerImpl);

export namespace Container {
  export type Props = JSX.IntrinsicElements["div"];
}
