import { useId, useRef, useState } from "react";
import { type MenuItem, type MenuParent } from "./menu-root";
import { useClasses } from "./menu-class-context";
import { clsx } from "@1771technologies/js-utils";
import { MenuPortal } from "./menu-portal";

export interface MenuProps {
  item: MenuItem;
  orientation: "vertical" | "horizontal";
  disabled?: boolean;
}

export function Menu({ item, orientation, disabled: parentDisabled }: MenuProps) {
  const classes = useClasses();
  if (item.kind === "separator") {
    return <div className={classes.separator} role="separator" aria-orientation={orientation} />;
  }

  const disabled = parentDisabled ?? item.disabled;

  if (item.kind === "item") {
    return (
      <div
        className={clsx(classes.base, classes.item, item.className)}
        style={item.style}
        id={item.id}
        role="menuitem"
        tabIndex={-1}
        aria-label={item.axe?.axeLabel}
        aria-disabled={disabled}
        data-disabled={disabled}
        data-orientation={orientation}
      >
        {item.label}
      </div>
    );
  }

  if (item.kind === "checkbox" || item.kind === "radio") {
    return (
      <div
        id={item.id}
        className={clsx(
          classes.base,
          item.kind === "checkbox" && classes.checkbox,
          item.kind === "radio" && classes.radio,
          item.className,
        )}
        style={item.style}
        role={item.kind === "checkbox" ? "menuitemcheckbox" : "menuitemradio"}
        tabIndex={-1}
        aria-checked={item.checked}
        aria-label={item.axe?.axeLabel}
        aria-disabled={disabled}
        data-disabled={disabled}
        data-checked={item.checked}
        data-orientation={orientation}
      >
        {item.label}
      </div>
    );
  }

  if (item.kind === "group") {
    return (
      <div
        id={item.id}
        role="group"
        className={clsx(classes.group, item.className)}
        style={item.style}
        aria-label={item.axe?.axeLabel ?? item.label}
        aria-disabled={disabled}
        data-disabled={disabled}
        data-orientation={orientation}
      >
        {item.children.map((item, i) => {
          return <Menu key={i} item={item} orientation={orientation} disabled={disabled} />;
        })}
      </div>
    );
  }

  return <Submenu item={item} disabled={disabled} orientation={orientation} />;
}

function Submenu({
  item,
  disabled,
  orientation,
}: {
  item: MenuParent;
  orientation: "vertical" | "horizontal";
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const classes = useClasses();

  const id = useId();

  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        ref={ref}
        role="menuitem"
        className={clsx(classes.base, classes.parent, item.className)}
        style={item.style}
        id={item.id}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-disabled={disabled}
        aria-label={item.axe?.axeLabel}
      >
        {item.label}
      </div>
      {open && (
        <MenuPortal
          id={id}
          target={ref.current!}
          aria-disabled={disabled}
          data-disabled={disabled}
          className={clsx(classes.menu, classes.parentMenu, item.menuClassName)}
          style={item.menuStyle}
        >
          {item.children.map((c, i) => {
            return <Menu key={i} item={c} orientation={orientation} disabled={disabled} />;
          })}
        </MenuPortal>
      )}
    </>
  );
}
