import type { TreeViewItem } from "@1771technologies/lytenyte-pro/components";

export const items: TreeViewItem[] = [
  { id: "src-index", path: ["src"], name: "index.ts" },
  { id: "src-app", path: ["src"], name: "app.ts" },

  { id: "button-component", path: ["src", "components"], name: "Button.tsx" },
  { id: "modal-component", path: ["src", "components"], name: "Modal.tsx" },
  { id: "header-component", path: ["src", "components"], name: "Header.tsx" },

  { id: "use-auth-hook", path: ["src", "hooks"], name: "useAuth.ts" },
  { id: "use-theme-hook", path: ["src", "hooks"], name: "useTheme.ts" },

  { id: "date-utils", path: ["src", "utils"], name: "date.ts" },
  { id: "string-utils", path: ["src", "utils"], name: "string.ts" },

  { id: "global-css", path: ["src", "styles"], name: "global.css" },

  { id: "env-config", path: ["config"], name: "env.ts" },
  { id: "readme-file", path: [], name: "README.md" },
  { id: "package-json", path: [], name: "package.json" },
];
