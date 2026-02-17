//#start
import { Menu } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import {
  CheckIcon,
  ChevronRightIcon,
  CodeIcon,
  CopyIcon,
  RowSpacingIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { clsx, type ClassValue } from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
//#end

const menuClass = "grid grid-cols-[24px_1fr] gap-1 ps-[4px]";
const radioClass = "grid grid-cols-[24px_1fr] gap-1";

export default function ComponentDemo() {
  const [radioValue, setRadioValue] = useState("medium");
  const [smoothScroll, setSmoothScroll] = useState(false);
  const [notify, setNotify] = useState(true);
  return (
    <div style={{ height: "400px" }} className="ln-grid flex justify-center pt-8">
      <Menu>
        <Menu.Trigger data-ln-button="website" data-ln-size="md">
          Show Menu Items
        </Menu.Trigger>
        <Menu.Popover>
          <Menu.Arrow />
          <Menu.Container>
            <Menu.Title className="sr-only">Example Menu</Menu.Title>
            <Menu.Description className="sr-only">
              This is an example menu to demonstrate LyteNyte Grid's Menu component
            </Menu.Description>

            <Menu.Item onAction={() => {}} className={menuClass}>
              <div className="flex items-center justify-center">
                <CopyIcon />
              </div>
              <div>Copy Content</div>
            </Menu.Item>
            <Menu.Item onAction={() => {}} className={menuClass}>
              <div className="flex items-center justify-center">
                <TrashIcon />
              </div>
              <div>Delete Row</div>
            </Menu.Item>
            <Menu.Divider />

            <Menu.Submenu>
              <Menu.SubmenuTrigger className="grid grid-cols-[24px_100px_20px] items-center justify-between">
                <div>
                  <RowSpacingIcon />
                </div>
                <div>Row Height</div>
                <div>
                  <ChevronRightIcon />
                </div>
              </Menu.SubmenuTrigger>
              <Menu.SubmenuContainer>
                <Menu.RadioGroup value={radioValue} onChange={setRadioValue}>
                  <Menu.RadioItem className={radioClass} value="small">
                    <RadioCircle checked={radioValue === "small"} />
                    <div>Small</div>
                  </Menu.RadioItem>
                  <Menu.RadioItem className={radioClass} value="medium">
                    <RadioCircle checked={radioValue === "medium"} />
                    <div>Medium</div>
                  </Menu.RadioItem>
                  <Menu.RadioItem className={radioClass} value="large">
                    <RadioCircle checked={radioValue === "large"} />
                    <div>Large</div>
                  </Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.SubmenuContainer>
            </Menu.Submenu>

            <Menu.Submenu>
              <Menu.SubmenuTrigger className="grid grid-cols-[24px_100px_20px] items-center justify-between">
                <div>
                  <CodeIcon />
                </div>
                <div>Settings</div>
                <div>
                  <ChevronRightIcon />
                </div>
              </Menu.SubmenuTrigger>
              <Menu.SubmenuContainer>
                <Menu.Group>
                  <Menu.CheckboxItem
                    checked={notify}
                    className={radioClass}
                    onClick={() => setNotify((prev) => !prev)}
                  >
                    <Checkbox checked={notify} />
                    <div>Notify On Error</div>
                  </Menu.CheckboxItem>
                  <Menu.CheckboxItem
                    checked={smoothScroll}
                    onClick={() => setSmoothScroll((prev) => !prev)}
                    className={radioClass}
                  >
                    <Checkbox checked={smoothScroll} />
                    <div>Smooth Scroll</div>
                  </Menu.CheckboxItem>
                </Menu.Group>
              </Menu.SubmenuContainer>
            </Menu.Submenu>
          </Menu.Container>
        </Menu.Popover>
      </Menu>
    </div>
  );
}

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

function RadioCircle({ checked }: { checked: boolean }) {
  return (
    <div className={tw("border-ln-text-xlight size-3 rounded-full border", checked && "bg-ln-primary-50")} />
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={tw(
        "border-ln-border-xstrong rounded-xs flex size-3 items-center justify-center border",
        checked && "bg-ln-primary-50",
      )}
    >
      {checked && <CheckIcon className="size-3 text-white" />}
    </div>
  );
}
