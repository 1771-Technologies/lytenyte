import type { Meta, StoryObj } from "@storybook/react";
import { handleFocusCapture, handleKeyDown } from "../grouped-focus";
import { expect, userEvent } from "@storybook/test";
import { sleep } from "@1771technologies/lytenyte-js-utils";

const meta: Meta = {
  title: "Components/Utils",
};

export default meta;

export const GroupedFocused: StoryObj = {
  render: () => {
    return (
      <>
        <button>Alpha</button>
        <div id="x" tabIndex={0} onFocusCapture={handleFocusCapture} onKeyDown={handleKeyDown}>
          <button>Beta</button>
          <div tabIndex={0}>Sigma</div>
        </div>
        <button>Write</button>
      </>
    );
  },
  play: async ({ canvas }) => {
    const alpha = canvas.getByText("Alpha");
    alpha.focus();
    await userEvent.keyboard("{Tab}");
    await sleep();
    expect(document.getElementById("x")).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await sleep();
    expect(document.getElementById("x")).not.toHaveFocus();
    expect(canvas.getByText("Write")).toHaveFocus();
    alpha.focus();
    await sleep();
    await userEvent.keyboard("{Tab}");
    await sleep();

    await userEvent.keyboard("{ArrowRight}");
    await sleep();
    expect(canvas.getByText("Beta")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(canvas.getByText("Sigma")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(canvas.getByText("Beta")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(canvas.getByText("Sigma")).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("A");
    expect(canvas.getByText("Beta")).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    expect(canvas.getByText("Write")).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");

    alpha.focus();
    await userEvent.keyboard("{Tab}");
    await userEvent.keyboard("{ArrowLeft}");
    expect(canvas.getByText("Sigma")).toHaveFocus();
  },
};

export const GroupedFocusEmpty: StoryObj = {
  render: () => {
    return (
      <>
        <button>Alpha</button>
        <div
          id="x"
          tabIndex={0}
          onFocusCapture={handleFocusCapture}
          onKeyDown={handleKeyDown}
        ></div>
        <button>Write</button>
      </>
    );
  },
  play: async ({ canvas }) => {
    const alpha = canvas.getByText("Alpha");
    alpha.focus();
    await userEvent.keyboard("{Tab}");
    await sleep();
    expect(document.getElementById("x")).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await sleep();
    expect(document.getElementById("x")).not.toHaveFocus();
    expect(canvas.getByText("Write")).toHaveFocus();
    alpha.focus();
    await sleep();
    await userEvent.keyboard("{Tab}");
    await sleep();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("A");
    await userEvent.keyboard("{Tab}");
    expect(canvas.getByText("Write")).toHaveFocus();
  },
};
