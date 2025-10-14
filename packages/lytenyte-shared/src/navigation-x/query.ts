export const queryHeader = (gridId: string, element: HTMLElement) => {
  return element.querySelector(`[data-ln-gridid="${gridId}"][data-ln-header="true"]`);
};

export const queryFirstFocusable = (gridId: string, element: HTMLElement): HTMLElement | null => {
  const selector = `
  [data-ln-gridid="${gridId}"][data-ln-header-cell="true"][data-ln-colindex="0"],
  [data-ln-gridid="${gridId}"][data-ln-header-group="true"][data-ln-colindex="0"],
  [data-ln-gridid="${gridId}"][data-ln-header-floating="true"][data-ln-colindex="0"],
  [data-ln-gridid="${gridId}"][data-ln-cell="true"][data-ln-colindex="0"][data-ln-rowindex="0"],
  [data-ln-gridid="${gridId}"][data-ln-row="true"][data-ln-rowtype="full-width"] > div
`;

  return element.querySelector(selector) as HTMLElement | null;
};
