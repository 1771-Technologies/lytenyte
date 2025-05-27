import type { StorybookConfig } from "@storybook/react-vite";

const stories = process.env.STORY_PATH?.split(",") ?? [
  "../packages/**/*.stories.mdx",
  "../packages/**/*.stories.@(js|jsx|mjs|ts|tsx)",
];

const config: StorybookConfig = {
  stories: stories,
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@1771technologies/storybook-vitest-visual-regression",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
