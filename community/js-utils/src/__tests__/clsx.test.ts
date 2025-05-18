import { clsx } from "../clsx.js";

test("should correctly handle classes joining", () => {
  const nonTruthy = null;
  const truthy = true;
  expect(clsx("abc", nonTruthy && "ba")).toEqual("abc");

  expect(clsx("alpha", null, truthy && "ba")).toEqual("alpha ba");
});
