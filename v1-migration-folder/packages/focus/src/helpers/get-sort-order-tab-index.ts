import { getTabIndex, hasTabIndex } from "@1771technologies/lytenyte-dom-utils";

export const getSortOrderTabIndex = (node: HTMLElement, isScope: boolean): number => {
  const tabIndex = getTabIndex(node);

  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }

  return tabIndex;
};
