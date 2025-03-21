import "./menu.css";

import { forwardRef } from "react";
import { Menu } from "@base-ui-components/react/menu";
import { useMenuClassName } from "./use-menu-class-name.js";
import { ArrowSvg } from "./arrow-svg";

export const Unstyled = {
  Container: Menu.Popup,
  Item: Menu.Item,
  Separator: Menu.Separator,
  Arrow: Menu.Arrow,
};

export const MenuContainer: typeof Menu.Popup = forwardRef(function MenuContainer(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu", className);
  return <Menu.Popup {...props} className={cl} ref={ref} />;
});

export const MenuItem: typeof Menu.Item = forwardRef(function MenuItem(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__item", className);
  return <Menu.Item {...props} className={cl} ref={ref} />;
});

export const MenuSeparator: typeof Menu.Separator = forwardRef(function MenuSeparator(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__separator", className);
  return <Menu.Separator {...props} className={cl} ref={ref} />;
});

export const MenuArrow: typeof Menu.Arrow = forwardRef(function MenuArrow(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__arrow", className);

  return (
    <Menu.Arrow {...props} className={cl} ref={ref}>
      {props.children ?? <ArrowSvg />}
    </Menu.Arrow>
  );
});
