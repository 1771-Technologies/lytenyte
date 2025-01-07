import { srOnlyStyle } from "@1771technologies/js-utils";
import type { Coords, Rect } from "@1771technologies/positioner";
import {
  MenuRoot,
  type MenuAxe,
  type MenuItemCheckbox,
  type MenuItemGroup,
  type MenuItemLeaf,
  type MenuItemRadio,
  type MenuParent,
  type MenuProps,
  type MenuSeparator,
} from "@1771technologies/react-menu";
import { Popover } from "@1771technologies/react-popover";
import { refCompat } from "@1771technologies/react-utils";
import { useId, useImperativeHandle, useState, type CSSProperties, type RefObject } from "react";
import { processMenuItems } from "./process-menu-items";

export interface ContextMenuItemLeaf<D = any> extends MenuItemLeaf<D> {
  readonly closeOnAction?: boolean;
}

export interface ContextMenuCheckbox<D = any> extends MenuItemCheckbox<D> {
  readonly closeOnAction?: boolean;
}

export interface ContextMenuItemRadio<D = any> extends MenuItemRadio<D> {
  readonly closeOnAction?: boolean;
}

export interface ContextMenuParent<D = any> extends Omit<MenuParent<D>, "children"> {
  readonly children: ContextMenuItem<D>[];
}
export interface ContextMenuItemGroup<D = any> extends Omit<MenuItemGroup<D>, "children"> {
  readonly children: ContextMenuItem<D>[];
}

export type ContextMenuItem<D = any> =
  | ContextMenuParent<D>
  | ContextMenuItemLeaf<D>
  | ContextMenuItemGroup<D>
  | ContextMenuCheckbox<D>
  | ContextMenuItemRadio<D>
  | MenuSeparator;

export interface ContextMenuApi {
  readonly show: (s: { position: Coords; menuItems: ContextMenuItem[]; state: any }) => void;
  readonly close: () => void;
}

export interface ContextMenuAxe {
  readonly axeDescription: string;
}

export interface ContextMenuProps
  extends Omit<MenuProps, "menuItems" | "axe" | "state" | "ariaLabelledBy"> {
  readonly ref: RefObject<ContextMenuApi | null> | ((c: ContextMenuApi | null) => void);

  readonly dialogClassName?: string;
  readonly dialogStyle?: CSSProperties;
  readonly axe: ContextMenuAxe;
  readonly menuAxe: MenuAxe;
}

function ContextMenuImpl({
  ref,
  axe,
  menuAxe,
  dialogClassName,
  dialogStyle,
  ...props
}: ContextMenuProps) {
  const [target, setTarget] = useState<Rect | null>(null);
  const [items, setItems] = useState<ContextMenuItem[]>([]);
  const [state, setState] = useState<any>({});

  const id = useId();

  useImperativeHandle(ref, () => {
    const close = () => {
      setItems([]);
      setTarget(null);
      setState({});
    };
    return {
      show: (s) => {
        const items = processMenuItems(s.menuItems, close);

        setItems(items);
        setTarget({ ...s.position, width: 0, height: 0 });
        setState(s.state);
      },
      close,
    } satisfies ContextMenuApi;
  });

  if (!target) return null;

  return (
    <>
      <div style={srOnlyStyle} id={id} aria-description={axe.axeDescription}>
        {axe.axeDescription}
      </div>
      <Popover
        open={!!target}
        /* v8 ignore next */
        onOpenChange={() => setTarget(null)}
        popoverTarget={target}
        className={dialogClassName}
        style={dialogStyle}
      >
        <MenuRoot
          axe={menuAxe}
          {...props}
          ariaLabelledBy={id}
          state={state}
          menuItems={items}
        ></MenuRoot>
      </Popover>
    </>
  );
}

export const ContextMenu = refCompat<ContextMenuApi | null, ContextMenuProps>(ContextMenuImpl);
