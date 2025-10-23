import { expect, test } from "vitest";
import {
  getCell,
  getColIndex,
  getRowDetail,
  getColPin,
  getColSpan,
  getGridId,
  getHeader,
  getHeaderCell,
  getHeaderFloating,
  getHeaderRange,
  getHeaderRow,
  getRow,
  getRowIndex,
  getRowPin,
  getRowSpan,
  getRowType,
  getHeaderGroup,
  getViewport,
} from "../attributes.js";

test("getGridId", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-gridid", "x");
  expect(getGridId(el)).toEqual("x");
  expect(getGridId(document.createElement("div"))).toEqual(null);
});

test("getCell", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-cell", "true");
  expect(getCell(el)).toEqual("true");
  expect(getCell(document.createElement("div"))).toEqual(null);
});

test("getRowType", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-rowtype", "full-width");
  expect(getRowType(el)).toEqual("full-width");
  expect(getRowType(document.createElement("div"))).toEqual(null);
});

test("getRow", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-row", "true");
  expect(getRow(el)).toEqual("true");
  expect(getRow(document.createElement("div"))).toEqual(null);
});

test("getRowIndex", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-rowindex", "2");
  expect(getRowIndex(el)).toEqual("2");
  expect(getRowIndex(document.createElement("div"))).toEqual(null);
});

test("getRowDetail", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-row-detail", "true");
  expect(getRowDetail(el)).toEqual("true");
  expect(getRowDetail(document.createElement("div"))).toEqual(null);
});

test("getHeaderCell", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-header-cell", "true");
  expect(getHeaderCell(el)).toEqual("true");
  expect(getHeaderCell(document.createElement("div"))).toEqual(null);
});

test("getHeaderFloating", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-header-floating", "true");
  expect(getHeaderFloating(el)).toEqual("true");
  expect(getHeaderFloating(document.createElement("div"))).toEqual(null);
});

test("getHeaderRange", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-header-range", "1,2");
  expect(getHeaderRange(el)).toEqual("1,2");
  expect(getHeaderRange(document.createElement("div"))).toEqual(null);
});

test("getColSpan", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-colspan", "2");
  expect(getColSpan(el)).toEqual("2");
  expect(getColSpan(document.createElement("div"))).toEqual(null);
});

test("getRowSpan", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-rowspan", "2");
  expect(getRowSpan(el)).toEqual("2");
  expect(getRowSpan(document.createElement("div"))).toEqual(null);
});

test("getColIndex", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-colindex", "2");
  expect(getColIndex(el)).toEqual("2");
  expect(getColIndex(document.createElement("div"))).toEqual(null);
});

test("getColPin", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-colpin", "start");
  expect(getColPin(el)).toEqual("start");
  expect(getColPin(document.createElement("div"))).toEqual(null);
});

test("getRowPin", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-rowpin", "top");
  expect(getRowPin(el)).toEqual("top");
  expect(getRowPin(document.createElement("div"))).toEqual(null);
});

test("getHeaderGroup", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-header-group", "true");
  expect(getHeaderGroup(el)).toEqual("true");
  expect(getHeaderGroup(document.createElement("div"))).toEqual(null);
});

test("getHeaderRow", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-header-row", "true");
  expect(getHeaderRow(el)).toEqual("true");
  expect(getHeaderRow(document.createElement("div"))).toEqual(null);
});

test("getHeader", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-header", "true");
  expect(getHeader(el)).toEqual("true");
  expect(getHeader(document.createElement("div"))).toEqual(null);
});

test("getViewport", () => {
  const el = document.createElement("div");
  el.setAttribute("data-ln-viewport", "true");
  expect(getViewport(el)).toEqual("true");
  expect(getViewport(document.createElement("div"))).toEqual(null);
});
