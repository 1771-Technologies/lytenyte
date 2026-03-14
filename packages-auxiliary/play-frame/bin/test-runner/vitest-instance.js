import { StreamingReporter } from "./streaming-reporter.js";
import { importVitest } from "./import-vitest.js";

let vitestInstance = null;
let vitestCwd = null;
export let streamingReporter = null;

export async function getVitest(cwd) {
  if (vitestInstance && vitestCwd === cwd) return vitestInstance;

  if (vitestInstance) {
    await vitestInstance.close();
    vitestInstance = null;
  }

  const { createVitest } = await importVitest(cwd);
  streamingReporter = new StreamingReporter();

  vitestInstance = await createVitest(
    "test",
    { watch: true, reporters: [streamingReporter] },
    { root: cwd },
  );

  await vitestInstance.init();
  vitestCwd = cwd;

  return vitestInstance;
}

export async function closeVitest() {
  if (vitestInstance) {
    await vitestInstance.close();
    vitestInstance = null;
    vitestCwd = null;
  }
}
