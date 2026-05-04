import { describe, expect, test } from "vitest";
import { basicPreventScroll } from "./basic-prevent-scroll.js";
import { wait } from "@1771technologies/js-utils";

describe("basicPreventScroll", () => {
  test("Should set the body overflow to hidden", async () => {
    let bodyOverflow = getComputedStyle(document.documentElement);

    expect(bodyOverflow.overflow).toEqual("visible");

    const res = basicPreventScroll(document.documentElement);
    await wait(20);
    bodyOverflow = getComputedStyle(document.documentElement);
    expect(bodyOverflow.overflow).toEqual("hidden");

    res();
    await wait(20);
    bodyOverflow = getComputedStyle(document.documentElement);
    expect(bodyOverflow.overflow).toEqual("visible");
  });
});
