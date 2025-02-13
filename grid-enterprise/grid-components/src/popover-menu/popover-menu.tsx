import {
  MenuRoot,
  type MenuAxe,
  type MenuItem,
  type MenuProps,
} from "@1771technologies/react-menu-legacy";
import { LngPopover } from "../popover/lng-popover";
import type { Placement, Rect } from "@1771technologies/positioner";
import { cc } from "../component-configuration";
import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { DefaultCheckbox } from "./default-checkbox";

interface PopoverMenuProps {
  readonly menuItems: MenuItem[];
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
  readonly placement: Placement;
  readonly popoverTarget: HTMLElement | Rect;
  readonly rtl?: boolean;

  readonly state?: any;
}

export interface MenuConfiguration {
  readonly axe?: MenuAxe;

  readonly rendererCheckbox?: MenuProps["rendererCheckbox"];
  readonly rendererItem?: MenuProps["rendererItem"];
  readonly rendererParent?: MenuProps["rendererParent"];
  readonly rendererRadio?: MenuProps["rendererRadio"];
}

export function PopoverMenu({
  menuItems,
  open,
  onOpenChange,
  placement,
  popoverTarget,
  state = {},
  rtl = false,
}: PopoverMenuProps) {
  const config = cc.menu.use();

  const Checkbox = config.rendererCheckbox ?? DefaultCheckbox;

  return (
    <LngPopover
      onOpenChange={onOpenChange}
      open={open}
      popoverTarget={popoverTarget}
      placement={placement}
    >
      <MenuRoot
        menuItems={menuItems}
        ariaLabelledBy={"clientHeight" in popoverTarget ? (popoverTarget.id ?? "") : ""}
        axe={config.axe!}
        state={state}
        rtl={rtl}
        rendererCheckbox={Checkbox}
        classes={{
          base: clsx(
            "lng1771-text-medium",
            css`
              display: flex;
              align-items: center;
              padding-inline-start: ${t.spacing.space_25};
              padding-inline-end: ${t.spacing.space_20};
              padding-block: ${t.spacing.space_10};
              min-width: 150px;
              border-radius: ${t.spacing.box_radius_medium};
              cursor: pointer;
              &:hover {
                background-color: ${t.colors.backgrounds_light};
              }
            `,
          ),
          separator: css`
            background-color: ${t.colors.borders_separator};
            height: 1px;
            margin-block: ${t.spacing.space_02};
          `,
        }}
      />
    </LngPopover>
  );
}
