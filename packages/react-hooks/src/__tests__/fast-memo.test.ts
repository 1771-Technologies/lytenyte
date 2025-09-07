import { describe, test } from "vitest";
import { fastDeepMemo, fastMemo } from "../fast-memo.js";

describe("fastMemo", () => {
  test("smoke test for fast memo", () => {
    fastMemo(() => {});
  });
});

describe("fastDeepMemo", () => {
  test("smoke test for fast deep memo", () => {
    fastDeepMemo(() => {});
  });
});
