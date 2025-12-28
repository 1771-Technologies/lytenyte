import {
  getCell,
  getGridId,
  getHeaderCell,
  getHeaderFloating,
  getHeaderGroup,
  getRow,
  getRowDetail,
  getRowType,
  getViewport,
} from "./attributes.js";

export const isHeaderGroup = (gridId: string, el: HTMLElement) =>
  getHeaderGroup(el) === "true" && getGridId(el) === gridId;

export const isHeaderCell = (gridId: string, el: HTMLElement) =>
  getHeaderCell(el) === "true" && getGridId(el) === gridId && getHeaderFloating(el) == null;

export const isFloatingCell = (gridId: string, el: HTMLElement) =>
  getHeaderCell(el) === "true" && getGridId(el) === gridId && getHeaderFloating(el) == "true";

export const isCell = (gridId: string, el: HTMLElement) => getCell(el) === "true" && getGridId(el) === gridId;

export const isFullWidth = (gridId: string, el: HTMLElement) =>
  getRow(el) === "true" && getRowType(el) === "full-width" && getGridId(el) === gridId;

export const isDetail = (gridId: string, el: HTMLElement) =>
  getRowDetail(el) === "true" && getGridId(el) === gridId;

export const isViewport = (gridId: string, el: HTMLElement) =>
  getViewport(el) === "true" && getGridId(el) === gridId;

export const isRow = (gridId: string, el: HTMLElement): boolean =>
  el.getAttribute("data-ln-row") === "true" && el.getAttribute("data-ln-gridid") === gridId;
