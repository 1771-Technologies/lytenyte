import "./menu.css";
import "../../css/main.css";
import type { Meta, StoryObj } from "@storybook/react";
import { MenuRoot } from "../menu-root.js";
import { MenuPanel } from "../menu-panel.js";
import { MenuItem } from "../menu-item.js";
import { MenuSubmenuRoot } from "../menu-submenu-root.js";
import { MenuSubmenuTrigger } from "../menu-submenu-trigger.js";
import { MenuSubmenuParent } from "../menu-submenu-parent.js";
import { MeneSubmenuPositioner } from "../menu-submenu-positioner.js";
import { MenuGroup } from "../menu-group.js";
import { MenuGroupLabel } from "../menu-group-label.js";
import { MenuRadioGroup } from "../menu-radio-group.js";
import { MenuRadioItem } from "../menu-radio-item.js";
import { useState } from "react";
import { MenuCheckboxItem } from "../menu-checkbox-item.js";
import { Popover } from "../../popover/index.js";
import type { PositionerProps } from "../../positioner/positioner.js";
import { expect, userEvent, within } from "@storybook/test";
import { sleep } from "@1771technologies/lytenyte-js-utils";

const meta: Meta = {
  title: "Components/Menu",
};
export default meta;

export const Main: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState("x");

    return (
      <MenuRoot>
        <MenuPanel>
          <MenuItem>Item 1</MenuItem>
          <MenuItem action={() => {}}>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>

          <MenuSubmenuRoot>
            <MenuSubmenuTrigger>Additional</MenuSubmenuTrigger>
            <MeneSubmenuPositioner>
              <MenuSubmenuParent>
                <MenuItem>Sub Item 1</MenuItem>
                <MenuItem>Sub Item 2</MenuItem>

                <MenuItem>Sub Item 3</MenuItem>

                <MenuSubmenuRoot>
                  <MenuSubmenuTrigger>Sub Additional</MenuSubmenuTrigger>
                  <MeneSubmenuPositioner>
                    <MenuSubmenuParent>
                      <MenuItem>Sub Sub Item 1</MenuItem>
                      <MenuSubmenuRoot>
                        <MenuSubmenuTrigger>Sub Sub Item 2</MenuSubmenuTrigger>
                        <MeneSubmenuPositioner>
                          <MenuSubmenuParent>
                            <MenuItem>Sub Sub Sub Item 1</MenuItem>
                            <MenuItem>Sub Sub Sub Item 2</MenuItem>
                            <MenuItem>Sub Sub Sub Item 3</MenuItem>
                          </MenuSubmenuParent>
                        </MeneSubmenuPositioner>
                      </MenuSubmenuRoot>
                      <MenuItem>Sub Sub Item 3</MenuItem>
                    </MenuSubmenuParent>
                  </MeneSubmenuPositioner>
                </MenuSubmenuRoot>
              </MenuSubmenuParent>
            </MeneSubmenuPositioner>
          </MenuSubmenuRoot>

          <MenuGroup>
            <MenuGroupLabel style={{ width: 200, padding: 8, fontFamily: "monospace" }}>
              Workspace
            </MenuGroupLabel>
            <MenuItem>Work 1</MenuItem>
            <MenuItem>Work 2</MenuItem>
            <MenuItem>Work 3</MenuItem>
          </MenuGroup>
          <MenuRadioGroup value={value} onChange={setValue}>
            <MenuRadioItem value="x">Live</MenuRadioItem>
            <MenuRadioItem value="r">Off</MenuRadioItem>
            <MenuRadioItem value="v">Mid</MenuRadioItem>
          </MenuRadioGroup>
          <MenuCheckboxItem checked onCheckChange={() => {}}>
            Alpha
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={false} onCheckChange={() => {}}>
            Beta
          </MenuCheckboxItem>
        </MenuPanel>
      </MenuRoot>
    );
  },
  play: async () => {
    const c = within(document.body);

    const menu = c.getByRole("menu");
    menu.focus();
    await sleep();

    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    await expect(c.getByText("Additional")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(c.getByText("Sub Item 1")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.click(c.getByText("Sub Item 2"));
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowUp}{ArrowRight}");
    await expect(c.getByText("Sub Sub Item 1")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{ArrowLeft}");
    await expect(c.getByText("Sub Additional")).toHaveFocus();
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(c.getByText("Additional")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await expect(c.getByText("Work 2")).toHaveFocus();
    await userEvent.click(c.getByText("Work 2"));
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await userEvent.click(c.getByText("Mid"));
    await userEvent.hover(c.getByText("Alpha"));
    await userEvent.unhover(c.getByText("Alpha"));
    await userEvent.hover(c.getByText("Work 2"));
    await userEvent.unhover(c.getByText("Work 2"));

    await userEvent.hover(c.getByText("Additional"));
    await sleep(300);
    await userEvent.unhover(c.getByText("Additional"));

    await userEvent.hover(c.getByText("Live"));
    await userEvent.keyboard("{Enter} ");
    await userEvent.keyboard("{Shift>}{Enter}{/Shift} ");

    await userEvent.click(c.getByText("Item 2"));
    await userEvent.keyboard("{Enter}");

    await userEvent.click(c.getByText("Beta"));
    await userEvent.keyboard("{Enter} ");
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");

    await userEvent.click(c.getByText("Additional"));
    await userEvent.keyboard(
      "{ArrowRight}{ArrowUp}{ArrowRight}{ArrowDown}{ArrowRight}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowDown}",
    );
  },
};

export const PopoverMenu: StoryObj = {
  render: () => {
    return (
      <Popover.Root>
        <Popover.Trigger>Open Menu</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Panel>
              <MenuRoot>
                <MenuPanel>
                  <MenuItem>Item 1</MenuItem>
                  <MenuItem>Item 2</MenuItem>
                  <MenuItem>Item 3</MenuItem>
                </MenuPanel>
              </MenuRoot>
            </Popover.Panel>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    );
  },
};

function Context() {
  const [anchor, setAnchor] = useState<PositionerProps["anchor"] | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        style={{ width: 200, height: 200, border: "1px solid black" }}
        onContextMenu={(ev) => {
          ev.preventDefault();
          setAnchor({
            getBoundingClientRect: () => {
              return {
                height: 0,
                width: 0,
                left: ev.clientX,
                x: ev.clientX,
                right: ev.clientX,
                y: ev.clientY,
                top: ev.clientY,
                bottom: ev.clientY,
              };
            },
          });
          setOpen(true);
        }}
      >
        Context Menu
      </div>

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Portal>
          <Popover.Positioner anchor={anchor} side="end" align="start">
            <Popover.Panel>
              <MenuRoot>
                <MenuPanel>
                  <MenuItem>Item 1</MenuItem>
                  <MenuItem>Item 2</MenuItem>
                  <MenuItem>Item 3</MenuItem>
                </MenuPanel>
              </MenuRoot>
            </Popover.Panel>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}

export const ContextMenu: StoryObj = {
  render: () => <Context />,
};
