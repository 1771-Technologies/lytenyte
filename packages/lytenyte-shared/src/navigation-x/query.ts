export const queryHeader = (gridId: string, element: HTMLElement): HTMLElement | null => {
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

export const queryCell = (
  gridId: string,
  rowIndex: number,
  colIndex: number,
  element: HTMLElement,
): HTMLElement | null => {
  return element.querySelector(
    `[data-ln-gridid="${gridId}"][data-ln-cell="true"][data-ln-rowindex="${rowIndex}"][data-ln-colindex="${colIndex}"]`,
  );
};

export const queryFullWidthRow = (
  gridId: string,
  rowIndex: number,
  element: HTMLElement,
): HTMLElement | null => {
  return element.querySelector(
    `[data-ln-gridid="${gridId}"][data-ln-row="true"][data-ln-rowtype="full-width"][data-ln-rowindex="${rowIndex}"] > *`,
  );
};

export const queryFloatingCell = (
  gridId: string,
  colIndex: number,
  element: HTMLElement,
): HTMLElement | null => {
  return element.querySelector(
    `[data-ln-gridid="${gridId}"][data-ln-header-cell="true"][data-ln-header-floating=true][data-ln-colindex="${colIndex}"]`,
  );
};

export const queryHeaderCell = (
  gridId: string,
  colIndex: number,
  element: HTMLElement,
): HTMLElement | null => {
  return element.querySelector(
    `[data-ln-gridid="${gridId}"][data-ln-header-cell="true"][data-ln-colindex="${colIndex}"]`,
  );
};

export const queryHeaderCellsAtRow = (
  gridId: string,
  rowIndex: number,
  element: HTMLElement,
): HTMLElement[] => {
  return Array.from(
    element.querySelectorAll(`[data-ln-gridid="${gridId}"][data-ln-header-row-${rowIndex}="true"]`),
  );
};

export const queryDetail = (
  gridId: string,
  rowIndex: number,
  element: HTMLElement,
): HTMLElement | null => {
  return element.querySelector(
    `[data-ln-gridid="${gridId}"][data-ln-rowindex="${rowIndex}"][data-ln-row-detail="true"]`,
  );
};
