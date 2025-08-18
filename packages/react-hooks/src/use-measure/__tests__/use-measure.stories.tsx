import type { Meta, StoryObj } from "@storybook/react";
import { useMeasure } from "../use-measure.js";
import { within } from "@storybook/test";

const meta: Meta = {
  title: "react-hooks/useMeasure",
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [ref, bounds] = useMeasure();
    return (
      <div>
        <div>Height: {bounds.height}</div>
        <div style={{ height: 200, width: 200 }} ref={ref}></div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const x = within(canvasElement);
    await x.findByText("Height: 200");
  },
};
