import {
  defineEcConfig,
  pluginCollapsibleSections,
  pluginLineNumbers,
} from "@1771technologies/lytenyte-doc/code";

export default defineEcConfig({
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: false,
  },
  themes: ["kanagawa-dragon", "rose-pine-dawn"],
  frames: false,
  themeCssSelector: (t) => {
    if (t.name === "kanagawa-dragon") return `[data-theme="dark"]`;
    return `[data-theme="light"]`;
  },
});
