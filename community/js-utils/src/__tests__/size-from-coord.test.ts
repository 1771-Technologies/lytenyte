import { sizeFromCoord } from "../size-from-coord";
import { makeUint32PositionArray } from "../make-uint32-position-array";

test("sizeFromCoord should return the correct value", () => {
  const positions = makeUint32PositionArray(() => 20, 5);
  expect(sizeFromCoord(1, positions)).toEqual(20);
  expect(sizeFromCoord(1, positions, 2)).toEqual(40);
});
