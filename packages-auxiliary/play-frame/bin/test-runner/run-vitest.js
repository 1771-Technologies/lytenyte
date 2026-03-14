import { buildTestFileResult } from "./build-test-file-result.js";
import { buildSummary } from "./build-summary.js";
import { getVitest, streamingReporter } from "./vitest-instance.js";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function runVitest({ cwd, testFiles, testNamePattern, projectName, onModule, onTestCaseStart, onTestCase, onDone, onError }) {
  let vitest = null;
  try {
    vitest = await getVitest(cwd);

    const collectedModules = [];
    streamingReporter.setOnModule((testModule) => {
      const mod = buildTestFileResult(testModule);
      collectedModules.push(mod);
      onModule(mod);
    });

    streamingReporter.setOnTestCaseStart((testCase) => {
      onTestCaseStart({
        filepath: testCase.module.moduleId,
        projectName: testCase.project?.name ?? "",
        fullName: testCase.fullName,
      });
    });

    streamingReporter.setOnTestCase((testCase) => {
      const result = testCase.result();
      onTestCase({
        filepath: testCase.module.moduleId,
        projectName: testCase.project?.name ?? "",
        fullName: testCase.fullName,
        state: result?.state ?? "pending",
        duration: testCase.diagnostic?.()?.duration,
        errors: result?.errors?.map((e) => e.message ?? String(e)) ?? [],
      });
    });

    // testNamePattern must be set on every project config — the root config
    // is not propagated to workspace projects during runTestSpecifications.
    // Vitest matches the pattern against the full task name (describe > test).
    const pattern = testNamePattern
      ? new RegExp(`^${escapeRegex(testNamePattern)}$`)
      : undefined;
    for (const project of vitest.projects) {
      project.config.testNamePattern = pattern;
    }

    const allSpecs = await vitest.globTestSpecifications();
    const specs = allSpecs.filter(
      (spec) =>
        testFiles.includes(spec.moduleId) &&
        (!projectName || spec.project.name === projectName),
    );

    await vitest.runTestSpecifications(specs);

    onDone(buildSummary(collectedModules));
  } catch (e) {
    onError(e?.message ?? String(e));
  } finally {
    streamingReporter?.setOnModule(null);
    streamingReporter?.setOnTestCaseStart(null);
    streamingReporter?.setOnTestCase(null);
    // Always clear the pattern so subsequent Run All runs are unfiltered
    if (vitest) {
      for (const project of vitest.projects) {
        project.config.testNamePattern = undefined;
      }
    }
  }
}
