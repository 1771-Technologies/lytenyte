# Measure Right

A small library for the measuring the runtime performance of your UI components
and applications.

```ts
import { run, wait, expect } from "@1771technologies/measure-right";

type Benchmark = Parameters<typeof run>[0]["benchmarks"][number];

const task: Benchmark = {
  name: "My Task",
  before: async (page) => {
    await page.goto("https://example.com");
  },
  run: async (page) => {
    // Perform tasks. Measure right will measure the performance and memory
    // usage of everything that happens within this function.
  },
};

const [result, items] = await run({
  benchmarks: [task],
  iterations: 10,
  roundRobin: false,
  browserOptions: {
    headless: true,
    size: { height: 1200, width: 2000 },
  },
});
```

## Credits

This library is mainly based on the work by https://github.com/krausest/js-framework-benchmark.
