export const getGridId = (el: HTMLElement): string | null => el.getAttribute("data-ln-gridid");

export const getCell = (el: HTMLElement): string | null => el.getAttribute("data-ln-cell");

export const getRowType = (el: HTMLElement): string | null => el.getAttribute("data-ln-rowtype");

export const getRow = (el: HTMLElement): string | null => el.getAttribute("data-ln-row");

export const getRowIndex = (el: HTMLElement): string | null => el.getAttribute("data-ln-rowindex");

export const getRowDetail = (el: HTMLElement): string | null =>
  el.getAttribute("data-ln-row-detail");

export const getHeaderCell = (el: HTMLElement): string | null =>
  el.getAttribute("data-ln-header-cell");

export const getHeaderFloating = (el: HTMLElement): string | null =>
  el.getAttribute("data-ln-header-floating");

export const getHeaderRange = (el: HTMLElement): string | null =>
  el.getAttribute("data-ln-header-range");

export const getHeaderGroup = (el: HTMLElement): string | null =>
  el.getAttribute("data-ln-header-group");

export const getColSpan = (el: HTMLElement): string | null => el.getAttribute("data-ln-colspan");

export const getRowSpan = (el: HTMLElement): string | null => el.getAttribute("data-ln-rowspan");

export const getColIndex = (el: HTMLElement): string | null => el.getAttribute("data-ln-colindex");

export const getColPin = (el: HTMLElement): string | null => el.getAttribute("data-ln-colpin");

export const getRowPin = (el: HTMLElement): string | null => el.getAttribute("data-ln-rowpin");

export const getHeaderRow = (el: HTMLElement): string | null =>
  el.getAttribute("data-ln-header-row");

export const getHeader = (el: HTMLElement): string | null => el.getAttribute("data-ln-header");

export const getViewport = (el: HTMLElement): string | null => el.getAttribute("data-ln-viewport");
