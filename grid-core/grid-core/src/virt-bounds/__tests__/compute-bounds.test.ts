import { computeBounds, type ComputeBoundsArgs } from "../compute-bounds.js";
import { formatTable, makeUint32PositionArray } from "@1771technologies/js-utils";

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

  const values = [`${b.columnStart}`, `${b.columnEnd}`, `${b.rowStart}`, `${b.rowEnd}`];

  return formatTable([values], ["First Col", "Last Col", "First Row", "Last Row"]);
}

test("computeBounds should return the correct value when there are no pinned items", () => {
  expect(printBounds(base)).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    0         | 12       | 0         | 12      
    "
  `);

  expect(printBounds({ ...base, scrollTop: 120, scrollLeft: 120 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    1         | 14       | 0         | 14      
    "
  `);

  expect(printBounds({ ...base, scrollTop: 200, scrollLeft: 200 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    3         | 16       | 2         | 16      
    "
  `);

  expect(printBounds({ ...base, scrollTop: 200 * 50 - 500 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    0         | 12       | 188       | 200     
    "
  `);

  expect(printBounds({ ...base, scrollTop: 200 * 52 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    0         | 12       | 198       | 200     
    "
  `);

  expect(printBounds({ ...base, scrollLeft: 100 * 50 - 500 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    89        | 100      | 0         | 12      
    "
  `);
});

test("computeBounds should return the correct value when there are pinned items", () => {
  const pinnedBase = {
    ...base,
    startCount: 2,
    endCount: 2,
    topCount: 2,
    bottomCount: 2,
  };

  expect(printBounds(pinnedBase)).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    2         | 14       | 2         | 14      
    "
  `);

  expect(printBounds({ ...pinnedBase, scrollTop: 120, scrollLeft: 120 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    3         | 16       | 2         | 16      
    "
  `);

  expect(printBounds({ ...pinnedBase, scrollTop: 200 * 50 - 500 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    2         | 14       | 190       | 198     
    "
  `);

  expect(printBounds({ ...pinnedBase, scrollLeft: 100 * 50 - 500 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    91        | 98       | 2         | 14      
    "
  `);
});

test("computeBounds should return the correct bounds when there are variables sizes", () => {
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
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    0         | 5        | 0         | 4       
    "
  `);

  expect(printBounds({ ...b, scrollTop: 150, scrollLeft: 100 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    2         | 7        | 1         | 7       
    "
  `);

  expect(printBounds({ ...b, scrollTop: 330, scrollLeft: 270 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    6         | 9        | 6         | 10      
    "
  `);
});

test("computeBounds should return the correct bounds when there are variables sizes and pins", () => {
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
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    2         | 6        | 2         | 6       
    "
  `);

  expect(printBounds({ ...b, scrollTop: 120 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    2         | 6        | 3         | 8       
    "
  `);

  expect(printBounds({ ...b, scrollTop: 200, scrollLeft: 200 })).toMatchInlineSnapshot(`
    "
    First Col | Last Col | First Row | Last Row
    -------------------------------------------
    5         | 8        | 5         | 8       
    "
  `);
});
