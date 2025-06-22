import { Table } from "@1771technologies/cli-table";
import { makeUint32PositionArray } from "../../coordinates/make-uint32-position-array.js";
import { computeBounds, type ComputeBoundsArgs } from "../compute-bounds.js";
import { describe, expect, test } from "vitest";

const yPositions = makeUint32PositionArray(() => 50, 200);
const xPositions = makeUint32PositionArray(() => 50, 100);

const base: ComputeBoundsArgs = {
  viewportWidth: 500,
  viewportHeight: 500,
  scrollTop: 0,
  scrollLeft: 0,
  xPositions,
  yPositions,
  topCount: 0,
  bottomCount: 0,
  startCount: 0,
  endCount: 0,
};

function printBounds(bounds: ComputeBoundsArgs) {
  const b = computeBounds(bounds);

  const cols = [
    `${b.colStartStart}`,
    `${b.colStartEnd}`,

    `${b.colCenterStart}`,
    `${b.colCenterEnd}`,
    `${b.colCenterLast}`,

    `${b.colEndStart}`,
    `${b.colEndEnd}`,
  ];
  const rows = [
    `${b.rowTopStart}`,
    `${b.rowTopEnd}`,

    `${b.rowCenterStart}`,
    `${b.rowCenterEnd}`,
    `${b.rowCenterLast}`,

    `${b.rowBotStart}`,
    `${b.rowBotEnd}`,
  ];

  const t = new Table();
  t.push(["CS Start", "CS End", "CC Start", "CC End", "CC Last", "CE Start", "CE End"]);
  t.push(cols);
  t.push(["RS Start", "RS End", "RC Start", "RC End", "RC Last", "RE Start", "RE End"]);
  t.push(rows);

  return t.toString();
}

describe("computeBounds", () => {
  test("should return the correct value when there are no items", () => {
    const next = { ...base, xPositions: new Uint32Array(), yPositions: new Uint32Array() };

    expect(printBounds(next)).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 0      │ 0       │ 0        │ 0      │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 0      │ 0       │ 0        │ 0      │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);
  });

  test("should return the correct value when there are no pinned items", () => {
    expect(printBounds(base)).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 12     │ 100     │ 100      │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 15     │ 200     │ 200      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);

    expect(printBounds({ ...base, scrollTop: 120, scrollLeft: 120 })).toMatchInlineSnapshot(
      `
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 1        │ 14     │ 100     │ 100      │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 17     │ 200     │ 200      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `,
    );

    expect(printBounds({ ...base, scrollTop: 200, scrollLeft: 200 })).toMatchInlineSnapshot(
      `
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 3        │ 16     │ 100     │ 100      │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 2        │ 19     │ 200     │ 200      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `,
    );

    expect(printBounds({ ...base, scrollTop: 200 * 50 - 500 })).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 12     │ 100     │ 100      │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 188      │ 200    │ 200     │ 200      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);

    expect(printBounds({ ...base, scrollTop: 200 * 52 })).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 12     │ 100     │ 100      │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 198      │ 200    │ 200     │ 200      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);

    expect(printBounds({ ...base, scrollLeft: 100 * 50 - 500 })).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 89       │ 100    │ 100     │ 100      │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 15     │ 200     │ 200      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);
  });

  test("should return the correct value when there are pinned items", () => {
    const pinnedBase = {
      ...base,
      startCount: 2,
      endCount: 2,
      topCount: 2,
      bottomCount: 2,
    };

    expect(printBounds(pinnedBase)).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 2        │ 14     │ 98      │ 98       │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 2        │ 17     │ 198     │ 198      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);

    expect(printBounds({ ...pinnedBase, scrollTop: 120, scrollLeft: 120 })).toMatchInlineSnapshot(
      `
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 3        │ 16     │ 98      │ 98       │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 2        │ 19     │ 198     │ 198      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `,
    );

    expect(printBounds({ ...pinnedBase, scrollTop: 200 * 50 - 500 })).toMatchInlineSnapshot(
      `
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 2        │ 14     │ 98      │ 98       │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 190      │ 198    │ 198     │ 198      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `,
    );

    expect(printBounds({ ...pinnedBase, scrollLeft: 100 * 50 - 500 })).toMatchInlineSnapshot(
      `
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 91       │ 98     │ 98      │ 98       │ 100    │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 2        │ 17     │ 198     │ 198      │ 200    │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `,
    );
  });

  test("should return the correct bounds when there are variables sizes", () => {
    const xPositions = new Uint32Array([0, 20, 60, 80, 120, 180, 220, 270, 300, 325]);
    const yPositions = new Uint32Array([0, 60, 90, 140, 200, 230, 270, 310, 330, 350, 420]);

    const b = {
      ...base,
      viewportWidth: 100,
      viewportHeight: 100,
      xPositions,
      yPositions,
    };

    expect(printBounds(b)).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 5      │ 9       │ 9        │ 9      │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 0        │ 7      │ 10      │ 10       │ 10     │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);

    expect(printBounds({ ...b, scrollTop: 150, scrollLeft: 100 })).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 2        │ 7      │ 9       │ 9        │ 9      │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 1        │ 10     │ 10      │ 10       │ 10     │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);

    expect(printBounds({ ...b, scrollTop: 330, scrollLeft: 270 })).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 6        │ 9      │ 9       │ 9        │ 9      │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 0      │ 6        │ 10     │ 10      │ 10       │ 10     │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);
  });

  test("should return the correct bounds when there are variables sizes and pins", () => {
    const xPositions = new Uint32Array([0, 20, 60, 80, 120, 180, 220, 270, 300, 325]);
    const yPositions = new Uint32Array([100, 200, 300, 350, 380, 410, 440, 500, 530, 600, 640]);

    const b = {
      ...base,
      viewportWidth: 100,
      viewportHeight: 100,
      startCount: 2,
      endCount: 1,
      topCount: 2,
      bottomCount: 2,
      xPositions,
      yPositions,
    };

    expect(printBounds(b)).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 2        │ 6      │ 8       │ 8        │ 9      │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 2        │ 8      │ 8       │ 8        │ 10     │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);

    expect(printBounds({ ...b, scrollTop: 120 })).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 2        │ 6      │ 8       │ 8        │ 9      │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 3        │ 8      │ 8       │ 8        │ 10     │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);

    expect(printBounds({ ...b, scrollTop: 200, scrollLeft: 200 })).toMatchInlineSnapshot(`
      "
      ┌──────────┬────────┬──────────┬────────┬─────────┬──────────┬────────┐
      │ CS Start │ CS End │ CC Start │ CC End │ CC Last │ CE Start │ CE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 5        │ 8      │ 8       │ 8        │ 9      │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ RS Start │ RS End │ RC Start │ RC End │ RC Last │ RE Start │ RE End │
      ├──────────┼────────┼──────────┼────────┼─────────┼──────────┼────────┤
      │ 0        │ 2      │ 5        │ 8      │ 8       │ 8        │ 10     │
      └──────────┴────────┴──────────┴────────┴─────────┴──────────┴────────┘"
    `);
  });
});
