import { relative } from "path";
import { buildTestFileResult } from "./build-test-file-result.js";
import { getVitest } from "./vitest-instance.js";

export async function collectVitest({ cwd, testFiles, onModule, onError }) {
  try {
    const vitest = await getVitest(cwd);

    const relativeFiles = testFiles.map((f) => relative(cwd, f));
    const { testModules } = await vitest.collect(relativeFiles);

    // vitest.collect() may return modules from previously collected files
    // (shared Vitest state). Filter strictly to the files we requested.
    for (const testModule of testModules) {
      if (testFiles.includes(testModule.moduleId)) {
        onModule(buildTestFileResult(testModule));
      }
    }
  } catch (e) {
    onError(e?.message ?? String(e));
  }
}
