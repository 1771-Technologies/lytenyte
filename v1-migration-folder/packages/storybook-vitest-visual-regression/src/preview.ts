import { expect } from "@storybook/test";

expect.extend({
  toMatchScreenshot: () => {
    return {
      pass: true,
      message: () => "No op in storybook",
    };
  },
});
