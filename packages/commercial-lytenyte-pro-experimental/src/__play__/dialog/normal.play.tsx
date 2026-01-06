import { Dialog } from "../../components/headless/dialog/index.js";
import { Menu } from "../../components/headless/menu/index.js";
import { Popover } from "../../components/headless/popover/index.js";
import "../../../css/components.css";

export default function NormalPlay() {
  return (
    <div className="ln-light">
      <Dialog.Root>
        <Dialog.Trigger data-ln-button="secondary" data-ln-size="md">
          Open Dialog
        </Dialog.Trigger>
        <Dialog.Container>
          <Dialog.Title>This is my dialog</Dialog.Title>
          <Dialog.Description>This is the dialog's description</Dialog.Description>
          Lee One two three.
          <Dialog.Close>x</Dialog.Close>
        </Dialog.Container>
      </Dialog.Root>

      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <Popover.Root placement="bottom">
          <Popover.Trigger data-ln-button="primary" data-ln-size="md" data-ln-icon>
            P
          </Popover.Trigger>
          <Popover.Container>
            <Popover.Arrow />
            <Popover.Title>This is the title</Popover.Title>
            <Popover.Description>This is the Desc</Popover.Description>
            This is my popover content.
          </Popover.Container>
        </Popover.Root>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <Menu.Root>
          <Menu.Trigger data-ln-button="primary" data-ln-size="md">
            Menu
          </Menu.Trigger>
          <Menu.Popover>
            <Menu.Arrow />
            <Menu.Title style={{ display: "none" }}>My Menu</Menu.Title>
            <Menu.Description style={{ display: "none" }}>This is the description</Menu.Description>
            <Menu.Container>
              <Menu.Item disabled onAction={() => {}}>
                Item A
              </Menu.Item>
              <Menu.Item onAction={() => {}}>Item B</Menu.Item>
              <Menu.Item onAction={() => {}}>Item C</Menu.Item>
              <Menu.Divider />
              <Menu.Submenu sideOffset={8}>
                <Menu.SubmenuTrigger>Sub List A</Menu.SubmenuTrigger>
                <Menu.SubmenuContainer>
                  <Menu.Item onAction={() => {}}>Item C</Menu.Item>
                  <Menu.Item onAction={() => {}}>Item C</Menu.Item>
                </Menu.SubmenuContainer>
              </Menu.Submenu>
              <Menu.RadioGroup value="x">
                <Menu.RadioItem value="y">Item Y</Menu.RadioItem>
                <Menu.RadioItem value="x">Item X</Menu.RadioItem>
                <Menu.RadioItem value="z">Item Z</Menu.RadioItem>
              </Menu.RadioGroup>
              <Menu.Divider />
              <Menu.CheckboxItem checked>Left</Menu.CheckboxItem>
              <Menu.CheckboxItem checked>Right</Menu.CheckboxItem>
            </Menu.Container>
          </Menu.Popover>
        </Menu.Root>
      </div>
    </div>
  );
}
