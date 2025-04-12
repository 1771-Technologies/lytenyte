import "./menu.css";

import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { Menu } from "@base-ui-components/react/menu";
import { useMenuClassName } from "./use-menu-class-name.js";
import { ArrowRightIcon, TickmarkIcon } from "../icons";
import { emptyBB } from "./column-menu/column-menu-driver";
import { useAnchor } from "../anchor-context/anchor-context";

export const MenuSubmenu = ({
  children,
  trigger,
  ...props
}: ComponentProps<typeof Menu.Root> & { trigger: ReactNode }) => {
  return (
    <Menu.Root {...props}>
      {trigger}

      <Menu.Portal>{children}</Menu.Portal>
    </Menu.Root>
  );
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

export const MenuGroup: typeof Menu.Group = forwardRef(function MenuGroup(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__group", className);
  return <Menu.Group {...props} ref={ref} className={cl} />;
});

export const MenuGroupLabel: typeof Menu.GroupLabel = forwardRef(function MenuGroupLabel(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__group-label", className);
  return <Menu.GroupLabel {...props} ref={ref} className={cl} />;
});

export const MenuSubmenuTrigger: typeof Menu.SubmenuTrigger = forwardRef(function SubmenuTrigger(
  { className, children, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__submenu-trigger", className);
  return (
    <Menu.SubmenuTrigger {...props} className={cl} ref={ref}>
      {children}
      <ArrowRightIcon width={16} height={16} />
    </Menu.SubmenuTrigger>
  );
});

export const MenuRadioGroup: typeof Menu.RadioGroup = forwardRef(function RadioGroup(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__radio-group", className);
  return <Menu.RadioGroup {...props} className={cl} ref={ref} />;
});

export const MenuRadioItemIndicator = forwardRef(function RadioItemIndicator(
  { children, className, ...props }: ComponentProps<typeof Menu.RadioItemIndicator>,
  ref: ComponentProps<typeof Menu.RadioItemIndicator>["ref"],
) {
  const cl = useMenuClassName("lng1771-menu__radio-item-indicator", className);

  return (
    <Menu.RadioItemIndicator {...props} ref={ref} className={cl}>
      {children ?? <TickmarkIcon width={16} height={16} />}
    </Menu.RadioItemIndicator>
  );
});

export const MenuRadioItem: typeof Menu.RadioItem = forwardRef(function RadioItem(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__radio-item", className);
  return <Menu.RadioItem {...props} ref={ref} className={cl} />;
});

export const MenuCheckboxItemIndicator = forwardRef(function CheckboxItemIndicator(
  { children, className, ...props }: ComponentProps<typeof Menu.CheckboxItemIndicator>,
  ref: ComponentProps<typeof Menu.CheckboxItemIndicator>["ref"],
) {
  const cl = useMenuClassName("lng1771-menu__checkbox-item-indicator", className);

  return (
    <Menu.CheckboxItemIndicator {...props} ref={ref} className={cl}>
      {children ?? <TickmarkIcon width={16} height={16} />}
    </Menu.CheckboxItemIndicator>
  );
});

export const MenuCheckboxItem: typeof Menu.CheckboxItem = forwardRef(function CheckboxItem(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__checkbox-item", className);
  return <Menu.CheckboxItem {...props} ref={ref} className={cl} />;
});

export const SubMenuPositioner: typeof Menu.Positioner = forwardRef(function SubMenuPositioner(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__submenu-positioner", className);

  return <Menu.Positioner {...props} ref={ref} className={cl} />;
});

export const MenuPositioner: typeof Menu.Positioner = forwardRef(function MenuPositioner(
  { className, ...props },
  ref,
) {
  const cl = useMenuClassName("lng1771-menu__positioner", className);

  const target = useAnchor();

  return (
    <Menu.Positioner
      side="bottom"
      align="start"
      anchor={
        target
          ? "getBoundingClientRect" in target
            ? target
            : {
                getBoundingClientRect: () => ({
                  x: target.x,
                  y: target.y,
                  width: target.width,
                  height: target.height,
                  top: target.y,
                  left: target.x,
                  bottom: target.y,
                  right: target.x,
                  toJSON: () => "",
                }),
              }
          : emptyBB
      }
      {...props}
      ref={ref}
      className={cl}
    />
  );
});
