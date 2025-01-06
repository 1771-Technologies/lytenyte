import { useId, useRef } from "react";
import { type MenuItem, type MenuParent } from "./menu-root";
import { useClasses } from "./menu-class-context";
import { clsx, containsPoint, getClientX, getClientY } from "@1771technologies/js-utils";
import { MenuPortal } from "./menu-portal";
import { useMenuStore } from "./menu-store-content";

export interface MenuProps {
  item: MenuItem;
  orientation: "vertical" | "horizontal";
  parentId?: string;
  disabled?: boolean;
}

export function Menu({ item, orientation, disabled: parentDisabled, parentId }: MenuProps) {
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
        {item.children.map((childItem, i) => {
          return (
            <Menu
              key={i}
              item={childItem}
              orientation={orientation}
              disabled={disabled}
              parentId={parentId}
            />
          );
        })}
      </div>
    );
  }

  return <Submenu item={item} disabled={disabled} orientation={orientation} parentId={parentId} />;
}

function Submenu({
  item,
  disabled,
  orientation,
  parentId,
}: {
  item: MenuParent;
  orientation: "vertical" | "horizontal";
  parentId?: string;
  disabled?: boolean;
}) {
  const s = useMenuStore();
  const setActive = s.store.setActiveId.peek();

  const activeId = s.useValue("activeId");
  const classes = useClasses();

  const ref = useRef<HTMLDivElement | null>(null);

  const referenceId = useId();

  return (
    <>
      <div
        ref={ref}
        role="menuitem"
        className={clsx(classes.base, classes.parent, item.className)}
        style={item.style}
        id={item.id}
        onPointerEnter={() => {
          setActive(item.id);
        }}
        onMouseLeave={(e) => {
          const parent = (e.target as HTMLElement).parentElement!;
          if (containsPoint(parent, getClientX(e.nativeEvent), getClientY(e.nativeEvent))) {
            setActive(item.id);
          }
          setActive(null);
        }}
        aria-haspopup="menu"
        aria-expanded={false}
        aria-controls={referenceId}
        aria-disabled={disabled}
        aria-label={item.axe?.axeLabel}
      >
        {item.label}
      </div>
      {ref.current && activeId === item.id && (
        <MenuPortal
          id={referenceId}
          parentId={item.id}
          target={ref.current!}
          aria-disabled={disabled}
          data-disabled={disabled}
          className={clsx(classes.menu, classes.parentMenu, item.menuClassName)}
          style={item.menuStyle}
        >
          {item.id}
          {item.children.map((c, i) => {
            return (
              <Menu
                key={i}
                item={c}
                orientation={orientation}
                disabled={disabled}
                parentId={item.id}
              />
            );
          })}
        </MenuPortal>
      )}
    </>
  );
}
