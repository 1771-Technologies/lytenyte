import { describe, expect, test } from "vitest";
import { expandDirectionFromKey } from "./expand-direction-from-key.js";

describe("expandDirectionFromKey", () => {
  test("Should return the correct direction given the key", () => {
    expect(expandDirectionFromKey("ArrowUp", false)).toEqual("up");
    expect(expandDirectionFromKey("ArrowDown", false)).toEqual("down");
    expect(expandDirectionFromKey("ArrowLeft", false)).toEqual("start");
    expect(expandDirectionFromKey("ArrowLeft", true)).toEqual("end");
    expect(expandDirectionFromKey("ArrowRight", false)).toEqual("end");
    expect(expandDirectionFromKey("ArrowRight", true)).toEqual("start");
    expect(expandDirectionFromKey("A", true)).toEqual(null);
  });
});
