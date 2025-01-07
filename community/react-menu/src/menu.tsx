import { useId, useMemo, useRef, type ReactNode } from "react";
import {
  type MenuItem,
  type MenuItemCheckbox,
  type MenuItemLeaf,
  type MenuItemRadio,
  type MenuParent,
} from "./menu-root";
import { useClasses } from "./menu-class-context";
import { clsx, containsPoint, getClientX, getClientY } from "@1771technologies/js-utils";
import { MenuPortal } from "./menu-portal";
import { useMenuStore } from "./menu-store-context";
import { useMenuState } from "./menu-state-context";

export interface MenuProps {
  item: MenuItem;
  parentId?: string;
  disabled?: boolean;

  readonly rendererItem?: (item: MenuItemLeaf) => ReactNode;
  readonly rendererCheckbox?: (item: MenuItemCheckbox) => ReactNode;
  readonly rendererRadio?: (item: MenuItemRadio) => ReactNode;
  readonly rendererParent?: (item: MenuParent) => ReactNode;
}

export function Menu({ item, disabled: parentDisabled, parentId, ...props }: MenuProps) {
  const store = useMenuStore();
  const classes = useClasses();
  const state = useMenuState();
  if (item.kind === "separator") {
    return <div className={classes.separator} role="separator" aria-orientation="horizontal" />;
  }

  const disabled = parentDisabled ?? item.disabled;

  if (item.kind === "item") {
    return (
      <div
        className={clsx(classes.base, classes.item, item.className)}
        style={item.style}
        id={item.id}
        role="menuitem"
        tabIndex={disabled ? undefined : -1}
        onFocus={() => {
          store.store.activeId.set(parentId ?? null);
        }}
        onClick={() => {
          if (disabled) return;
          item.action({ item, state });
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === " " || e.key === "Enter") item.action({ item, state });
        }}
        aria-label={item.axe?.axeLabel}
        aria-describedby={item.axe?.axeDescription}
        aria-disabled={disabled}
        data-disabled={disabled}
      >
        {props.rendererItem && <props.rendererItem {...item} />}
        {!props.rendererItem && item.label}
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
        tabIndex={disabled ? undefined : -1}
        onClick={() => {
          if (disabled) return;
          if (item.kind === "checkbox") item.onCheckChange({ item, state, checked: !item.checked });
          else item.onCheckChange({ item, state, checked: !item.checked });
        }}
        onFocus={() => {
          store.store.activeId.set(parentId ?? null);
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          const key = e.key;
          if (key === "Enter" || key === " ") {
            if (item.kind === "checkbox")
              item.onCheckChange({ item, state, checked: !item.checked });
            else item.onCheckChange({ item, state, checked: !item.checked });
          }
        }}
        aria-checked={item.checked}
        aria-label={item.axe?.axeLabel}
        aria-describedby={item.axe?.axeDescription}
        aria-disabled={disabled}
        data-disabled={disabled}
        data-checked={item.checked}
      >
        {props.rendererCheckbox && item.kind === "checkbox" && <props.rendererCheckbox {...item} />}
        {props.rendererRadio && item.kind === "radio" && <props.rendererRadio {...item} />}
        {((!props.rendererCheckbox && item.kind === "checkbox") ||
          (!props.rendererRadio && item.kind === "radio")) &&
          item.label}
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
        aria-describedby={item.axe?.axeDescription}
        aria-disabled={disabled}
        data-disabled={disabled}
      >
        {item.children.map((childItem, i) => {
          return (
            <Menu key={i} item={childItem} disabled={disabled} parentId={parentId} {...props} />
          );
        })}
      </div>
    );
  }

  return <Submenu item={item} disabled={disabled} parentId={parentId} {...props} />;
}

function Submenu({
  item,
  disabled,
  parentId,
  ...props
}: {
  item: MenuParent;
  parentId?: string;
  disabled?: boolean;

  readonly rendererItem?: (item: MenuItemLeaf) => ReactNode;
  readonly rendererCheckbox?: (item: MenuItemCheckbox) => ReactNode;
  readonly rendererRadio?: (item: MenuItemRadio) => ReactNode;
  readonly rendererParent?: (item: MenuParent) => ReactNode;
}) {
  const s = useMenuStore();
  const setActive = s.store.setActiveId.peek();

  const activeId = s.useValue("activeId");
  const classes = useClasses();

  const ref = useRef<HTMLDivElement | null>(null);

  const referenceId = useId();

  const childIds = useMemo(() => {
    const ids = new Set<string>();
    const stack = [...item.children];
    while (stack.length) {
      const c = stack.pop()!;
      if (c.kind === "submenu") {
        stack.push(...c.children);
        ids.add(c.id);
      }
      if (c.kind === "group") {
        stack.push(...c.children);
      }
    }

    return ids;
  }, [item.children]);

  return (
    <>
      <div
        ref={ref}
        role="menuitem"
        className={clsx(classes.base, classes.parent, item.className)}
        style={item.style}
        id={item.id}
        tabIndex={disabled ? undefined : -1}
        onPointerEnter={() => {
          if (disabled) return;
          setActive(item.id);
        }}
        onMouseLeave={(e) => {
          if (disabled) return;
          const parent = (e.target as HTMLElement).parentElement!;
          if (containsPoint(parent, getClientX(e.nativeEvent), getClientY(e.nativeEvent))) {
            setActive(parentId ?? "", 200);
            return;
          }
          setActive(null, 200);
        }}
        aria-haspopup="menu"
        aria-expanded={false}
        aria-controls={referenceId}
        aria-disabled={disabled}
        aria-label={item.axe?.axeLabel}
        aria-describedby={item.axe?.axeDescription}
        data-haspopover={true}
        data-disabled={disabled}
      >
        {props.rendererParent && <props.rendererParent {...item} />}
        {!props.rendererParent && item.label}

        {ref.current && (activeId === item.id || childIds.has(activeId ?? "")) && (
          <MenuPortal
            id={referenceId}
            hasParent={!!parentId}
            item={item}
            target={ref.current!}
            aria-disabled={disabled}
            data-disabled={disabled}
            className={clsx(classes.menu, classes.parentMenu, item.menuClassName)}
            style={item.menuStyle}
          >
            {item.children.map((c, i) => {
              return <Menu key={i} item={c} disabled={disabled} parentId={item.id} {...props} />;
            })}
          </MenuPortal>
        )}
      </div>
    </>
  );
}
