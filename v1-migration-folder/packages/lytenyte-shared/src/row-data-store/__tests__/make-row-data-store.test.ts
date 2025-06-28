import { describe, expect, test } from "vitest";
import { makeRowDataStore } from "../make-row-data-store";
import { atom, createStore } from "@1771technologies/atom";
import type { RowLeaf } from "../../+types";
import { makeGridAtom } from "../../grid-atom/make-grid-atom";
import { renderHook } from "@testing-library/react";

describe("makeRowDataStore", () => {
  test("should return the correct store", () => {
    const d = makeRowDataStore(createStore(), (() => {}) as any);
    delete (d as any).atoms.snapshotKey;

    expect(d).toMatchInlineSnapshot(`
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
          "rowClearCache": [Function],
          "rowCount": {
            "get": [Function],
            "useValue": [Function],
            "watch": [Function],
          },
          "rowForIndex": [Function],
          "rowInvalidateIndex": [Function],
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

  test("should handle row updates", () => {
    const rowByIndex = atom(() => {
      return (r: number): RowLeaf<number> => ({ id: `${r}`, data: r, kind: "leaf" });
    });

    const store = createStore();
    const gridAtom = makeGridAtom(rowByIndex, store);

    const dataStore = makeRowDataStore(store, gridAtom);

    const d = dataStore.store.rowForIndex(11);

    const rowA = d.get();
    expect(rowA).toMatchInlineSnapshot(`
      {
        "data": 11,
        "id": "11",
        "kind": "leaf",
      }
    `);

    expect(dataStore.store.rowForIndex(11).get()).toBe(d.get());

    dataStore.store.rowInvalidateIndex(11);
    const rowB = dataStore.store.rowForIndex(11).get();
    expect(rowB).toEqual(rowA);
    expect(rowB).not.toBe(rowA);

    dataStore.store.rowClearCache();

    const res = renderHook(() => {
      return d.useValue();
    });
    expect(res.result).toMatchInlineSnapshot(`
      {
        "current": {
          "data": 11,
          "id": "11",
          "kind": "leaf",
        },
      }
    `);
  });
});
