import { describe, expect, test } from "vitest";
import { makeRowDataStore } from "../make-row-data-store";
import { createStore } from "@1771technologies/atom";

describe("makeRowDataStore", () => {
  test("should return the correct store", () => {
    expect(makeRowDataStore(createStore())).toMatchInlineSnapshot(`
      {
        "atoms": {
          "bottomCount": {
            "init": 0,
            "read": [Function],
            "toString": [Function],
            "write": [Function],
          },
          "rowCenterCount": {
            "init": 0,
            "read": [Function],
            "toString": [Function],
            "write": [Function],
          },
          "rowCount": {
            "read": [Function],
            "toString": [Function],
          },
          "topCount": {
            "init": 0,
            "read": [Function],
            "toString": [Function],
            "write": [Function],
          },
        },
        "store": {
          "rowBottomCount": {
            "get": [Function],
            "set": [Function],
            "useValue": [Function],
            "watch": [Function],
          },
          "rowCenterCount": {
            "get": [Function],
            "set": [Function],
            "useValue": [Function],
            "watch": [Function],
          },
          "rowCount": {
            "get": [Function],
            "useValue": [Function],
            "watch": [Function],
          },
          "rowTopCount": {
            "get": [Function],
            "set": [Function],
            "useValue": [Function],
            "watch": [Function],
          },
        },
      }
    `);
  });
});
