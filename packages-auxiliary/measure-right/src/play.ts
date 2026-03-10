import { expect } from "playwright/test";
import type { Benchmark } from "./types.js";
import { wait } from "@1771technologies/lytenyte-shared";
import { run } from "./run.js";

const test: Benchmark = {
  name: "Testing Benchmark",
  before: async (page) => {
    await page.goto("https://example.com/");
    await wait(100);
  },
  run: async (page) => {
    await expect(page.getByText("Example Domain")).toBeVisible();
  },
};

const result = await run({
  benchmarks: [test],
  iterations: 1,
  roundRobin: false,
  browserOptions: {
    headless: false,
    size: { width: 1280, height: 960 },
  },
});

const resultTable = result.map((c) => {
  return {
    name: c.name,
    total: c.jsTime.value + c.layoutTime.value + c.paintTime.value,
    memory: c.memory.value,
    js: c.jsTime.value,
    layout: c.layoutTime.value,
    paint: c.paintTime.value,
  };
});
console.table(resultTable);
