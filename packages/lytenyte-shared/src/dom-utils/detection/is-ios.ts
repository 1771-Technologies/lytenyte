import { getNavigatorData } from "./get-navigator-data.js";

export const isIOS = () => {
  const nav = getNavigatorData();
  // iPads can claim to be MacIntel
  return nav.platform === "MacIntel" && nav.maxTouchPoints > 1
    ? true
    : /iP(hone|ad|od)|iOS/.test(nav.platform);
};
