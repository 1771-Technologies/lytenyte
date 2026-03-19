import { getNavigatorData } from "./get-navigator-data.js";

/**
 * Returns true if the current device is running iOS, including iPadOS devices that report as
 * MacIntel.
 */
export const isIOS = () => {
  const nav = getNavigatorData();
  // iPads can claim to be MacIntel
  return nav.platform === "MacIntel" && nav.maxTouchPoints > 1
    ? true
    : /iP(hone|ad|od)|iOS/.test(nav.platform);
};
