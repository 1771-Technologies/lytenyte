import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import type { Grid } from "../../../index.js";
import {
  resolveAnimateSettings,
  DISABLED_ANIMATE_SETTINGS,
  type AnimateSettings,
} from "./resolve-animate-settings.js";

const context = createContext<AnimateSettings>(DISABLED_ANIMATE_SETTINGS);

export function ColumnAnimateSettingsProvider({
  columnAnimate,
  children,
}: PropsWithChildren<{ columnAnimate: boolean | Grid.ColumnAnimate | undefined }>) {
  const settings = useMemo(() => resolveAnimateSettings(columnAnimate), [columnAnimate]);
  return <context.Provider value={settings}>{children}</context.Provider>;
}

export const useColumnAnimateSettings = () => useContext(context);
