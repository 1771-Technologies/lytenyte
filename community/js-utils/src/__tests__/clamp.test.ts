import { clamp } from "../clamp.js";

test("clamp should return the correct value", () => {
  expect(clamp(0, 10, 20)).toEqual(10);
  expect(clamp(11, 10, 20)).toEqual(11);
  expect(clamp(11, 23, 20)).toEqual(20);
  expect(clamp(22, 23, 20)).toEqual(20);
});
