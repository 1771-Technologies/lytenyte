import { MenuStateProvider } from "./menu-state-context";
import { Menu } from "./menu";
import { MenuClassProvider } from "./menu-class-context";
import type { CSSProperties } from "react";
import { MenuStoreProvider } from "./menu-store-content";

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
  readonly onCheckChange: (s: { state: D; item: MenuItemCheckbox<D> }) => void;
  readonly checked: boolean;
}

export interface MenuItemRadio<D = any> extends BaseMenuItem {
  readonly kind: "radio";
  readonly onCheckChange: (s: { state: D; item: MenuItemRadio<D> }) => void;
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

  readonly ariaLabelledBy: string;
  readonly orientation?: "vertical" | "horizontal";
  readonly id?: string;
  readonly disabled?: boolean;

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
  orientation = "vertical",
  disabled,
  classes,
}: MenuProps<D>) {
  return (
    <MenuStoreProvider>
      <MenuClassProvider value={classes}>
        <MenuStateProvider value={state}>
          <div
            role="menu"
            id={id}
            aria-disabled={disabled}
            data-disabled={disabled}
            className={classes.menu}
            tabIndex={0}
          >
            {menuItems.map((c, i) => {
              return <Menu key={i} item={c} orientation={orientation} disabled={disabled} />;
            })}
          </div>
        </MenuStateProvider>
      </MenuClassProvider>
    </MenuStoreProvider>
  );
}
