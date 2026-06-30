import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import type { Grid } from "../../../index.js";
import {
  resolveAnimateSettings,
  DISABLED_ANIMATE_SETTINGS,
  type AnimateSettings,
} from "./resolve-animate-settings.js";

const context = createContext<AnimateSettings>(DISABLED_ANIMATE_SETTINGS);

export function RowAnimateSettingsProvider({
  rowAnimate,
  children,
}: PropsWithChildren<{ rowAnimate: boolean | Grid.RowAnimate | undefined }>) {
  const settings = useMemo(() => resolveAnimateSettings(rowAnimate), [rowAnimate]);
  return <context.Provider value={settings}>{children}</context.Provider>;
}

export const useRowAnimateSettings = () => useContext(context);
