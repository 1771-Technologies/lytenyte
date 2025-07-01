import { describe, expect, test } from "vitest";
import { getTranslate } from "../get-translate";

describe("getTranslate", () => {
  test("should return the correct value", () => {
    expect(getTranslate(0, 20)).toMatchInlineSnapshot(`"translate3d(0px, 20px, 0px)"`);
    expect(getTranslate(40, 20)).toMatchInlineSnapshot(`"translate3d(40px, 20px, 0px)"`);
    expect(getTranslate(40, 20)).toMatchInlineSnapshot(`"translate3d(40px, 20px, 0px)"`);
  });
});
