import { MenuStateProvider } from "./menu-state-context";
import { Menu } from "./menu";
import { MenuClassProvider } from "./menu-class-context";
import { useRef, type CSSProperties } from "react";
import { MenuStoreProvider, useMenuStore } from "./menu-store-content";
import { getFocusableElements } from "@1771technologies/js-utils";
import { RtlProvider } from "@1771technologies/react-utils";

export interface MenuAxe {
  readonly axeDescription: string;
}

export interface BaseMenuItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;

  readonly className?: string;
  readonly style?: CSSProperties;

  readonly axe?: {
    readonly axeLabel: string;
  };
}

export interface MenuItemLeaf<D = any> extends BaseMenuItem {
  readonly kind: "item";
  readonly action: (s: { state: D; item: MenuItemLeaf<D> }) => void;
}

export interface MenuItemCheckbox<D = any> extends BaseMenuItem {
  readonly kind: "checkbox";
  readonly onCheckChange: (s: { state: D; item: MenuItemCheckbox<D>; checked: boolean }) => void;
  readonly checked: boolean;
}

export interface MenuItemRadio<D = any> extends BaseMenuItem {
  readonly kind: "radio";
  readonly onCheckChange: (s: { state: D; item: MenuItemRadio<D>; checked: boolean }) => void;
  readonly checked: boolean;
}

export interface MenuItemGroup<D = any> extends BaseMenuItem {
  readonly kind: "group";
  readonly children: MenuItem<D>[];
}
export interface MenuSeparator {
  readonly kind: "separator";
}

export interface MenuParent<D = any> extends BaseMenuItem {
  readonly kind: "submenu";
  readonly children: MenuItem<D>[];

  readonly menuClassName?: string;
  readonly menuStyle?: CSSProperties;
}

export type MenuItem<D = any> =
  | MenuParent<D>
  | MenuItemLeaf<D>
  | MenuItemGroup<D>
  | MenuItemCheckbox<D>
  | MenuItemRadio<D>
  | MenuSeparator;

export interface MenuProps<D = any> {
  readonly menuItems: MenuItem<D>[];
  readonly state: D;

  readonly id?: string;
  readonly disabled?: boolean;

  readonly ariaLabelledBy: string;
  readonly axe: MenuAxe;

  readonly rtl: boolean;

  readonly classes: {
    readonly base: string;
    readonly menu?: string;
    readonly separator?: string;
    readonly item?: string;
    readonly group?: string;
    readonly parent?: string;
    readonly parentMenu?: string;
    readonly radio?: string;
    readonly checkbox?: string;
  };
}

export function MenuRoot<D = any>({
  id,
  menuItems,
  state,
  disabled,
  classes,
  rtl,
  ...props
}: MenuProps<D>) {
  return (
    <RtlProvider value={rtl ?? false}>
      <MenuStoreProvider>
        <MenuClassProvider value={classes}>
          <MenuStateProvider value={state}>
            <MenuImpl
              id={id}
              menuItems={menuItems}
              disabled={disabled}
              classes={classes}
              state={state}
              rtl={rtl}
              {...props}
            />
          </MenuStateProvider>
        </MenuClassProvider>
      </MenuStoreProvider>
    </RtlProvider>
  );
}

function MenuImpl({ axe, ariaLabelledBy, rtl, id, disabled, classes, menuItems }: MenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const s = useMenuStore();
  return (
    <div
      role="menu"
      id={id}
      ref={ref}
      aria-labelledby={ariaLabelledBy}
      aria-description={axe.axeDescription}
      aria-disabled={disabled}
      data-disabled={disabled}
      className={classes.menu}
      tabIndex={0}
      onKeyDown={(ev) => {
        const unfilteredItems = getFocusableElements(ref.current!, true);
        const items = unfilteredItems.filter((c) => c.getAttribute("role")?.includes("menu"));

        if (!items.length || !document.activeElement) return;

        if (ev.key === "ArrowDown" && document.activeElement === ref.current) {
          items[0].focus();
          ev.preventDefault();
          return;
        }

        const directionArrow = rtl ? "ArrowLeft" : "ArrowRight";
        const keys = ["ArrowDown", "ArrowUp", directionArrow];

        if (!keys.includes(ev.key)) return;

        let activeMenuItem = document.activeElement as HTMLElement;
        while (activeMenuItem && !activeMenuItem.role?.includes("menu"))
          activeMenuItem = activeMenuItem.parentElement as HTMLElement;

        const active = items.indexOf(document.activeElement as HTMLElement);
        if (active === -1) return;

        if (ev.key === "ArrowDown") {
          const next = active + 1;
          if (next >= items.length) return;

          items[next].focus();

          ev.preventDefault();
          ev.stopPropagation();
        }

        if (ev.key === "ArrowUp") {
          const next = active - 1;
          if (next < 0) return;
          items[next].focus();

          ev.preventDefault();
          ev.stopPropagation();
        }

        if (ev.key === directionArrow) {
          const current = items[active];

          if (current.dataset.haspopover) {
            s.store.activeId.set(current.id);

            setTimeout(() => {
              const el = document.querySelector(`[data-itemid="${current.id}"]`) as HTMLElement;
              el?.focus();
            }, 20);
          }

          ev.preventDefault();
          ev.stopPropagation();
        }
      }}
    >
      {menuItems.map((c, i) => {
        return <Menu key={i} item={c} disabled={disabled} />;
      })}
    </div>
  );
}
