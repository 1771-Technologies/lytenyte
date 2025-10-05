import { describe, test } from "vitest";
import { sleep } from "../sleep.js";

describe("sleep", () => {
  test("should be able to sleep", async () => {
    await sleep();
  });
});
