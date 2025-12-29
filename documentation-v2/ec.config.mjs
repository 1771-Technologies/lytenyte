import {
  defineEcConfig,
  pluginCollapsibleSections,
  pluginLineNumbers,
} from "@1771technologies/lytenyte-doc/code";

export default defineEcConfig({
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: false,
    frame: "none",
  },

  themes: ["aurora-x", "github-light"],
  styleOverrides: {
    frames: {
      copyIcon:
        "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9ImN1cnJlbnRjb2xvciIgdmlld0JveD0iMCAwIDI1NiAyNTYiPgogIDxwYXRoIGQ9Ik0yMTYsMzJIODhhOCw4LDAsMCwwLTgsOFY4MEg0MGE4LDgsMCwwLDAtOCw4VjIxNmE4LDgsMCwwLDAsOCw4SDE2OGE4LDgsMCwwLDAsOC04VjE3Nmg0MGE4LDgsMCwwLDAsOC04VjQwQTgsOCwwLDAsMCwyMTYsMzJaTTE2MCwyMDhINDhWOTZIMTYwWm00OC00OEgxNzZWODhhOCw4LDAsMCwwLTgtOEg5NlY0OEgyMDhaIj48L3BhdGg+Cjwvc3ZnPg==)",
    },
    textMarkers: {
      backgroundOpacity: "40%",
    },
  },
  frames: {
    showCopyToClipboardButton: true,
  },
  themeCssSelector: (t) => {
    if (t.name === "kanagawa-dragon") return `[data-theme="dark"]`;
    return `[data-theme="light"]`;
  },
});
