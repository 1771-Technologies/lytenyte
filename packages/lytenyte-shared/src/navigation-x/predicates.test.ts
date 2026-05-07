import { expect, test, describe } from "vitest";
import {
  isCell,
  isDetail,
  isFloatingCell,
  isFullWidth,
  isHeaderCell,
  isHeaderGroup,
  isRow,
  isViewport,
} from "./predicates.js";

describe("predicates", () => {
  test("Should return correct result for isHeaderGroup", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-header-group", "true");
    el.setAttribute("data-ln-gridid", "x");
    const el2 = document.createElement("div");
    el2.setAttribute("data-ln-header-group", "true");
    el2.setAttribute("data-ln-gridid", "y");

    expect(isHeaderGroup("x", el)).toEqual(true);
    expect(isHeaderGroup("x", el2)).toEqual(false);
    expect(isHeaderGroup("x", document.createElement("div"))).toEqual(false);
  });

  test("Should return correct result for isHeaderCell", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-header-cell", "true");
    el.setAttribute("data-ln-gridid", "x");
    const el2 = document.createElement("div");
    el2.setAttribute("data-ln-header-cell", "true");
    el2.setAttribute("data-ln-gridid", "y");
    const floating = document.createElement("div");
    floating.setAttribute("data-ln-header-cell", "true");
    floating.setAttribute("data-ln-header-floating", "true");
    floating.setAttribute("data-ln-gridid", "x");

    expect(isHeaderCell("x", el)).toEqual(true);
    expect(isHeaderCell("x", floating)).toEqual(false);
    expect(isHeaderCell("x", el2)).toEqual(false);
    expect(isHeaderCell("x", document.createElement("div"))).toEqual(false);
  });

  test("Should return correct result for isFloatingCell", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-header-cell", "true");
    el.setAttribute("data-ln-gridid", "x");

    const el2 = document.createElement("div");
    el2.setAttribute("data-ln-header-cell", "true");
    el2.setAttribute("data-ln-gridid", "y");

    const floating = document.createElement("div");
    floating.setAttribute("data-ln-header-cell", "true");
    floating.setAttribute("data-ln-header-floating", "true");
    floating.setAttribute("data-ln-gridid", "x");

    expect(isFloatingCell("x", floating)).toEqual(true);
    expect(isFloatingCell("x", el)).toEqual(false);
    expect(isFloatingCell("x", el2)).toEqual(false);
    expect(isFloatingCell("x", document.createElement("div"))).toEqual(false);
  });

  test("Should return correct result for isCell", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-cell", "true");
    el.setAttribute("data-ln-gridid", "x");

    const el2 = document.createElement("div");
    el2.setAttribute("data-ln-cell", "true");
    el2.setAttribute("data-ln-gridid", "y");

    expect(isCell("x", el)).toEqual(true);
    expect(isCell("x", el2)).toEqual(false);
    expect(isCell("x", document.createElement("div"))).toEqual(false);
  });

  test("Should return correct result for isFullWidth", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-row", "true");
    el.setAttribute("data-ln-rowtype", "full-width");
    el.setAttribute("data-ln-gridid", "x");

    const el2 = document.createElement("div");
    el2.setAttribute("data-ln-row", "true");
    el2.setAttribute("data-ln-rowtype", "full-width");
    el2.setAttribute("data-ln-gridid", "y");

    expect(isFullWidth("x", el)).toEqual(true);
    expect(isFullWidth("x", el2)).toEqual(false);
    expect(isFullWidth("x", document.createElement("div"))).toEqual(false);
  });

  test("Should return correct result for isDetail", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-row-detail", "true");
    el.setAttribute("data-ln-gridid", "x");

    const el2 = document.createElement("div");
    el2.setAttribute("data-ln-row-detail", "true");
    el2.setAttribute("data-ln-gridid", "y");

    expect(isDetail("x", el)).toEqual(true);
    expect(isDetail("x", el2)).toEqual(false);
    expect(isDetail("x", document.createElement("div"))).toEqual(false);
  });

  test("Should return correct result for isViewport", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-viewport", "true");
    el.setAttribute("data-ln-gridid", "x");

    const el2 = document.createElement("div");
    el2.setAttribute("data-ln-viewport", "true");
    el2.setAttribute("data-ln-gridid", "y");

    expect(isViewport("x", el)).toEqual(true);
    expect(isViewport("x", el2)).toEqual(false);
    expect(isViewport("x", document.createElement("div"))).toEqual(false);
  });

  test("Should return correct result for isRow", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-row", "true");
    el.setAttribute("data-ln-gridid", "x");

    const el2 = document.createElement("div");
    el2.setAttribute("data-ln-row", "true");
    el2.setAttribute("data-ln-gridid", "y");

    expect(isRow("x", el)).toEqual(true);
    expect(isRow("x", el2)).toEqual(false);
  });
});
