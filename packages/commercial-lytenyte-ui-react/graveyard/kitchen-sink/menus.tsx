import { useState } from "react";
import { Menu } from "../components/menu/index.js";
import { tw } from "../components/tw.js";

export function Menus() {
  const [opt, setOpt] = useState("x");
  return (
    <div>
      <h2>Menu</h2>
      <Menu.Root placement="bottom">
        <Menu.Trigger size="icon">
          <span className="sr-only">Nested menu</span>
          <span className="iconify ph--acorn-duotone"></span>
        </Menu.Trigger>
        <Menu.Popover>
          <Menu.Arrow />
          <Menu.Title className="sr-only">Random items</Menu.Title>
          <Menu.Description>This is some description</Menu.Description>
          <Menu.Container>
            <Menu.Item onAction={() => {}}>Item A</Menu.Item>
            <Menu.Item onAction={() => {}}>Item B</Menu.Item>

            <Menu.Submenu>
              <Menu.SubmenuTrigger className="flex items-center gap-2">
                <span>Nested Menu</span>
              </Menu.SubmenuTrigger>
              <Menu.SubmenuContainer>
                <Menu.Item onAction={() => {}}>Subitem A</Menu.Item>
                <Menu.Item onAction={() => {}}>Subitem A</Menu.Item>
              </Menu.SubmenuContainer>
            </Menu.Submenu>

            <Menu.Submenu>
              <Menu.SubmenuTrigger>Treason</Menu.SubmenuTrigger>
              <Menu.SubmenuContainer>
                <Menu.ComboMenu>
                  <Menu.ComboInput className="mb-1" />
                  <Menu.ComboOption onAction={() => {}}>Option A</Menu.ComboOption>
                  <Menu.ComboOption onAction={() => {}}>Option B</Menu.ComboOption>
                  <Menu.ComboOption onAction={() => {}}>Option C</Menu.ComboOption>
                  <Menu.ComboOption onAction={() => {}}>Option D</Menu.ComboOption>
                </Menu.ComboMenu>
              </Menu.SubmenuContainer>
            </Menu.Submenu>

            <Menu.Divider />

            <Menu.ComboMenu>
              <Menu.ComboInput className="mb-1" />
              <Menu.ComboCheckbox checked>
                {(x) => {
                  return (
                    <div className="grid grid-cols-[1fr_auto] items-center">
                      <span>Alpha</span>
                      {!x ? <span></span> : <span className="iconify ph--check-bold"></span>}
                    </div>
                  );
                }}
              </Menu.ComboCheckbox>
              <Menu.ComboCheckbox checked>Option B</Menu.ComboCheckbox>
              <Menu.ComboCheckbox checked>Option C</Menu.ComboCheckbox>
              <Menu.ComboCheckbox checked>Option D</Menu.ComboCheckbox>
            </Menu.ComboMenu>

            <Menu.Divider />

            <Menu.RadioGroup value={opt} onChange={setOpt}>
              <Menu.RadioItem
                value="x"
                className={tw(
                  "ln-active:bg-gray-300/60 cursor-pointer select-none",
                  "text-nowrap rounded px-2 py-0.5 focus-visible:outline-none",
                )}
              >
                {() => {
                  return <label className="flex justify-between">X value</label>;
                }}
              </Menu.RadioItem>
              <Menu.RadioItem value="y">
                {() => {
                  return <label className="flex justify-between">Y value</label>;
                }}
              </Menu.RadioItem>
              <Menu.RadioItem value="z">
                {() => {
                  return <label className="flex justify-between">Z value</label>;
                }}
              </Menu.RadioItem>
            </Menu.RadioGroup>
            <Menu.Group>
              <Menu.Divider />
              <Menu.Header>Checkboxes</Menu.Header>
              <Menu.CheckboxItem checked>
                {(x) => {
                  return (
                    <div className="grid grid-cols-[1fr_auto] items-center">
                      <span>Alpha</span>
                      {!x ? <span></span> : <span className="iconify ph--check-bold"></span>}
                    </div>
                  );
                }}
              </Menu.CheckboxItem>
              <Menu.CheckboxItem checked={false}>
                {(x) => {
                  return (
                    <div className="grid grid-cols-[1fr_auto] items-center">
                      <span>Beta</span>
                      {!x ? <span></span> : <span className="iconify ph--check-bold"></span>}
                    </div>
                  );
                }}
              </Menu.CheckboxItem>
            </Menu.Group>
          </Menu.Container>
        </Menu.Popover>
      </Menu.Root>
    </div>
  );
}
