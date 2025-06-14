import "./drop-combo.css";
import type { Meta, StoryObj } from "@storybook/react";
import { DropComboRoot } from "../drop-combo-root.js";
import { useDropCombo } from "../use-drop-combo.js";
import { states } from "./data.js";
import { DropComboToggle } from "../drop-combo-toggle.js";
import { DropComboPortal } from "../drop-combo-portal.js";
import { DropComboPositioner } from "../drop-combo-positioner.js";
import { DropComboOptions } from "../drop-combo-options.js";
import { DropComboInput } from "../drop-combo-input.js";
import { DropComboClear } from "../drop-combo-clear.js";
import { DropComboOption } from "../drop-combo-option.js";
import { expect, userEvent } from "@storybook/test";
import { sleep } from "@1771technologies/lytenyte-js-utils";
import { within } from "@testing-library/react";
import { useState } from "react";

const meta: Meta = {
  title: "Components/DropCombo",
};
export default meta;

function MainComp() {
  const { context, state } = useDropCombo({
    items: states,
  });
  return (
    <DropComboRoot context={context}>
      <DropComboToggle>Toggle {state.selected?.label ?? "None"}</DropComboToggle>
      <DropComboPortal>
        <DropComboPositioner>
          <DropComboOptions>
            <div style={{ display: "flex" }}>
              <DropComboInput />
              <DropComboClear>X</DropComboClear>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {state.options.length > 0 &&
                state.options.map((c, i) => {
                  return (
                    <DropComboOption key={c} index={i} option={c}>
                      {c}
                    </DropComboOption>
                  );
                })}
            </div>
          </DropComboOptions>
        </DropComboPositioner>
      </DropComboPortal>
    </DropComboRoot>
  );
}

export const Main: StoryObj = {
  render: () => {
    return <MainComp></MainComp>;
  },
  play: async () => {
    const c = within(document.body);
    await userEvent.click(c.getByText("Toggle None"));
    await sleep(80);

    await userEvent.click(c.getByText("Arizona"));
    await userEvent.click(c.getByText("Toggle Arizona"));
    await userEvent.click(c.getByText("Wyoming"));

    await expect(c.getByText("Toggle Wyoming")).toBeVisible();
  },
};

function ControlledComp() {
  const [selected, setSelected] = useState<(typeof states)[0] | undefined>(states[0]);
  const { context, state } = useDropCombo({
    items: states,
    selected,
    allowDeselect: true,
    onSelect: setSelected,
  });
  return (
    <DropComboRoot context={context}>
      <DropComboToggle>Toggle {state.selected?.label ?? "None"}</DropComboToggle>
      <DropComboPortal>
        <DropComboPositioner>
          <DropComboOptions>
            <div style={{ display: "flex" }}>
              <DropComboInput />
              <DropComboClear>X</DropComboClear>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {state.options.length > 0 &&
                state.options.map((c, i) => {
                  return (
                    <DropComboOption key={c} index={i} option={c}>
                      {c}
                    </DropComboOption>
                  );
                })}
            </div>
          </DropComboOptions>
        </DropComboPositioner>
      </DropComboPortal>
    </DropComboRoot>
  );
}

export const Controlled: StoryObj = {
  render: () => {
    return <ControlledComp />;
  },
  play: async () => {
    const c = within(document.body);
    await userEvent.click(c.getByText("Toggle Alabama"));
    await sleep(80);

    await userEvent.keyboard("Arizona{ArrowDown}{Enter}");

    await expect(c.getByText("Toggle Arizona")).toBeVisible();

    await userEvent.click(c.getByText("Toggle Arizona"));
    await userEvent.click(c.getByText("Arizona"));
    await expect(c.getByText("Toggle None")).toBeVisible();
  },
};
