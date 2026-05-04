import { describe, test } from "vitest";
import { sleep, wait } from "./sleep.js";

describe("sleep", () => {
  test("Should be able to sleep", async () => {
    await sleep();
    await wait();
  });
});
